# 交给 DSH 的安装任务

请在安装了 DSH 的机器上完成以下任务：

1. 执行 `dsh plugin --profile web add github:huangshihao/dsh-liang-effort`，把 `dsh-liang-effort` 加入 Web profile。
2. 确认命令成功，并确认 Web profile 的 `package.json` 中同时出现依赖 `dsh-liang-effort` 和 `dsh.profile.bundles` 条目。
3. 重启正在运行的 `dsh web` 进程；不要修改 DeepSeek 请求协议，也不要把 `off`、`high`、`max` 改成中文后发给模型提供方。
4. 打开任一普通会话，在输入框右侧打开模型菜单。确认 DeepSeek 和 Kimi K3 等三档模型都显示 `牢梁`、`梁子`、`梁圣`；五档 Kimi 模型显示 `小难梁`、`牢梁`、`梁子`、`梁圣`、`梁神`；完整六档再增加 `梁祖`；拖动后人物画面沿视频时间轴连续变化。
5. 如果安装或启动失败，保留原始终端输出并解释失败点，不要静默修改 DSH 源码。

验收标准：所有 effort 都显示梁阶别名，Host 最终收到的 `reasoningEffort` 仍是当前 provider 公布的原始 id。

卸载命令：`dsh plugin --profile web remove dsh-liang-effort`，随后重启 `dsh web`。
