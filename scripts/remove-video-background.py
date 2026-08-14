#!/usr/bin/env python3
"""从梁氏演化源视频生成带透明通道的人物视频。"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove


def parse_args() -> argparse.Namespace:
    """读取视频抠像参数。"""
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--ffmpeg", required=True, type=Path)
    parser.add_argument("--model", default="u2net_human_seg")
    return parser.parse_args()


def raw_mask(frame_rgb: np.ndarray, session: object) -> np.ndarray:
    """调用人物分割模型生成原始遮罩。"""
    mask_image = remove(
        Image.fromarray(frame_rgb),
        session=session,
        only_mask=True,
        post_process_mask=True,
    )
    return np.asarray(mask_image, dtype=np.float32)


def subject_envelope(frame_rgb: np.ndarray, session: object) -> np.ndarray:
    """从初始人物生成允许形态演化的空间包络。"""
    baseline = (raw_mask(frame_rgb, session) > 8).astype(np.uint8) * 255
    contours, _ = cv2.findContours(baseline, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filled = np.zeros_like(baseline)
    cv2.drawContours(filled, contours, -1, 255, thickness=cv2.FILLED)
    head = cv2.dilate(
        filled,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)),
        iterations=1,
    )
    body = cv2.dilate(
        filled,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (35, 35)),
        iterations=1,
    )
    expanded = body
    expanded[: int(frame_rgb.shape[0] * 0.55)] = head[: int(frame_rgb.shape[0] * 0.55)]
    return cv2.GaussianBlur(expanded.astype(np.float32), (9, 9), 0)


def alpha_mask(
    frame_rgb: np.ndarray,
    session: object,
    previous: np.ndarray | None,
    envelope: np.ndarray,
) -> np.ndarray:
    """生成人物遮罩并抑制相邻帧的边缘闪烁。"""
    current = raw_mask(frame_rgb, session)
    if previous is not None:
        current = current * 0.86 + previous * 0.14
    current = np.minimum(current, envelope)
    border = max(8, frame_rgb.shape[0] // 40)
    gray = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2GRAY)
    border_pixels = np.concatenate((
        gray[:border].ravel(),
        gray[-border:].ravel(),
        gray[:, :border].ravel(),
        gray[:, -border:].ravel(),
    ))
    dark_background = np.median(border_pixels) < 110
    left_ear_region = np.zeros(frame_rgb.shape[:2], dtype=np.uint8)
    height, width = frame_rgb.shape[:2]
    cv2.ellipse(
        left_ear_region,
        (int(width * 0.3), int(height * 0.43)),
        (int(width * 0.09), int(height * 0.23)),
        0,
        0,
        360,
        255,
        thickness=cv2.FILLED,
    )
    if not dark_background:
        repaired = np.fliplr(current).copy()
        repaired[left_ear_region == 0] = 0
        current = np.maximum(
            current,
            np.minimum(cv2.GaussianBlur(repaired, (3, 3), 0), envelope),
        )
    else:
        hsv = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2HSV)
        gold_details = (
            (hsv[:, :, 0] >= 5)
            & (hsv[:, :, 0] <= 35)
            & (hsv[:, :, 1] >= 55)
            & (hsv[:, :, 2] >= 35)
        )
        gold_alpha = gold_details.astype(np.uint8) * 255
        gold_alpha = cv2.morphologyEx(
            gold_alpha,
            cv2.MORPH_CLOSE,
            cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)),
        )
        current = np.maximum(current, cv2.GaussianBlur(gold_alpha, (3, 3), 0))
    return cv2.GaussianBlur(current, (3, 3), 0)


def encode_command(ffmpeg: Path, width: int, height: int, fps: float, output: Path) -> list[str]:
    """构造支持透明通道的 VP9 编码命令。"""
    return [
        str(ffmpeg),
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgba",
        "-video_size",
        f"{width}x{height}",
        "-framerate",
        f"{fps:g}",
        "-i",
        "-",
        "-an",
        "-c:v",
        "libvpx-vp9",
        "-pix_fmt",
        "yuva420p",
        "-b:v",
        "0",
        "-crf",
        "24",
        "-deadline",
        "good",
        "-cpu-used",
        "4",
        "-row-mt",
        "1",
        "-auto-alt-ref",
        "0",
        "-metadata:s:v:0",
        "alpha_mode=1",
        str(output),
    ]


def main() -> int:
    """逐帧分割人物并写入透明 WebM。"""
    args = parse_args()
    capture = cv2.VideoCapture(str(args.input))
    if not capture.isOpened():
        raise RuntimeError(f"无法打开源视频：{args.input}")

    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = capture.get(cv2.CAP_PROP_FPS)
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    args.output.parent.mkdir(parents=True, exist_ok=True)

    session = new_session(args.model)
    ok, baseline_bgr = capture.read()
    if not ok:
        raise RuntimeError("源视频没有可处理的帧")
    envelope = subject_envelope(cv2.cvtColor(baseline_bgr, cv2.COLOR_BGR2RGB), session)
    capture.set(cv2.CAP_PROP_POS_FRAMES, 0)
    encoder = subprocess.Popen(
        encode_command(args.ffmpeg, width, height, fps, args.output),
        stdin=subprocess.PIPE,
    )
    previous: np.ndarray | None = None
    written = 0
    try:
        while True:
            ok, frame_bgr = capture.read()
            if not ok:
                break
            frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
            mask = alpha_mask(frame_rgb, session, previous, envelope)
            previous = mask
            rgba = np.dstack((frame_rgb, np.clip(mask, 0, 255).astype(np.uint8)))
            if encoder.stdin is None:
                raise RuntimeError("FFmpeg 标准输入不可用")
            encoder.stdin.write(rgba.tobytes())
            written += 1
            if written % 15 == 0 or written == frame_count:
                print(f"已处理 {written}/{frame_count} 帧", flush=True)
    finally:
        capture.release()
        if encoder.stdin is not None:
            encoder.stdin.close()

    return_code = encoder.wait()
    if return_code != 0:
        raise RuntimeError(f"FFmpeg 编码失败：{return_code}")
    print(f"透明视频已写入 {args.output}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
