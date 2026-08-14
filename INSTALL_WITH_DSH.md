# 交给 DSH 的插件安装任务

请执行以下操作：

1. 运行 `npx --yes @deepseek-ai/dsh plugin --profile web add github:huangshihao/dsh-liang-effort`，将插件安装并启用到 Web profile。不要假设系统已经全局安装了 `dsh` 命令。
2. 重启原来的 DSH Web 进程，使插件生效。如果原来使用 `npx @deepseek-ai/dsh web` 启动，就继续使用该命令；沿用原来的工作目录、端口和其他启动参数。

不需要执行额外验证，也不要修改 DSH 或插件源码。
