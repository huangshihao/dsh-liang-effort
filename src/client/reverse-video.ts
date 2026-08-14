/** 反向视频取样所需的时钟和媒体状态。 */
export interface ReverseSampleInput {
  duration: number
  lastSampleAt: number
  now: number
  seeking: boolean
  start: number
  startedAt: number
  target: number
}

/** 单次反向动画帧的取样结果。 */
export interface ReverseSample {
  complete: boolean
  lastSampleAt: number
  time?: number
}

/**
 * 计算反向动画下一次应展示的视频时间。
 *
 * @param input 当前动画和媒体解码状态。
 * @returns 本帧是否结束动画，以及可选的视频取样时间。
 */
export function reverseSampleAt(input: ReverseSampleInput): ReverseSample {
  // 对同一 video 连续写 currentTime 会取消尚未完成的解码；保留已经
  // 发出的 seek，直到浏览器呈现该帧后再请求下一帧。
  if (input.seeking) {
    return { complete: false, lastSampleAt: input.lastSampleAt }
  }
  const progress = Math.min(1, (input.now - input.startedAt) / input.duration)
  const eased = progress < .5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2
  const complete = progress === 1
  if (input.now - input.lastSampleAt < 1_000 / 30 && !complete) {
    return { complete, lastSampleAt: input.lastSampleAt }
  }
  return {
    complete,
    lastSampleAt: input.now,
    time: input.start + (input.target - input.start) * eased,
  }
}
