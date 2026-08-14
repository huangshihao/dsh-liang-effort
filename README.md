# dsh-liang-effort

一个外置 DSH Web 插件：把所有 provider 的推理强度改成“滑动变祖器”式滑轨。任意三个 effort 会按提供方顺序显示成 `牢梁 / 梁子 / 梁圣`；更多 effort 会自动匹配 `小难梁 / 牢梁 / 梁子 / 梁圣 / 梁神 / 梁祖`。

协议值没有改变：插件只替换浏览器里的显示和交互。DeepSeek 仍提交 `off / high / max`，Kimi K3 仍提交 `low / high / max`，其他 provider 也提交各自公布的原始 id。

## 安装

```bash
dsh plugin --profile web add github:huangshihao/dsh-liang-effort
```

安装完成后重启 `dsh web`。也可以把 [INSTALL_WITH_DSH.md](./INSTALL_WITH_DSH.md) 整份交给 DSH，让它通过 shell 工具执行安装和验收。

## 交互

- 输入框右侧仍显示当前模型，点击后可以继续切换模型。
- 弹层中的人物从卡片上沿探出，滑轨位于人物右侧，模型选择收在最底部的独立通栏中。人物视频使用逐帧抠像的透明版本，梁祖保留金色光环并去除后方黑底。
- 当所选模型恰好公布三个 effort 时，插件按原顺序显示 `牢梁 / 梁子 / 梁圣` 三档滑轨。
- 当 effort 多于三个时，插件按 `off / minimal / low / medium / high / max` 语义映射为 `小难梁 / 牢梁 / 梁子 / 梁圣 / 梁神 / 梁祖`；未知名称按顺序自动匹配梁阶。
- 每个梁阶下方同时显示 provider 的真实 effort id，例如 `牢梁 (low)`；滑块提交的仍是括号中的原始协议值。
- provider 没有声明默认 effort 时，切换到该模型会明确选择其公布的第一档，避免 UI 显示档位而 Host 仍处于未指定状态。
- 拖动滑轨会沿原始 `liang-evolution.mp4` 的时间轴播放透明版本的中间形态：升档使用视频连续播放；降档最多以约 30fps 反向采样，并等待每个 seek 解码完成后再取下一帧，避免未呈现帧被后续 seek 覆盖。两种方向都配合缩放和光晕过渡。
- 对没有推理能力的模型只保留模型切换。
- 原生 range 控件支持键盘操作，并为读屏器提供中文档位说明；减少动态效果的系统设置会关闭主要动画。

## 为什么能作为一个包安装

本包同时声明 `dsh.bundle` 和 `dsh.client`：profile patch 挂载 Node 端插件，Node 端为 MP4 提供 Range 路由；浏览器端以 `priority: -100` 接管 `conversation.input.model` 单实例 slot，并复用 DSH 原有的 `modelDirectories` 服务。因此 `/model` 命令、模型目录和 Host 校验路径保持不变。

## 本地开发

```bash
pnpm install
pnpm run check
```

`lib/` 是提交到仓库的发布产物，GitHub 依赖安装无需执行 `prepare`。在本地 DSH checkout 中验证：

```bash
dsh plugin --profile web add /absolute/path/to/dsh-liang-effort
dsh web
```

## 卸载

```bash
dsh plugin --profile web remove dsh-liang-effort
```

重启 `dsh web` 后，优先级为 `0` 的 DSH 内置模型选择界面会重新生效。

## 素材与许可

插件代码和文档按 MIT 许可发布；`media/liang-evolution.mp4` 不包含在 MIT 授权内。视频来源、校验值和权利状态见 [MEDIA-NOTICE.md](./MEDIA-NOTICE.md)。
