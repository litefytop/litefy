# 安全扫描

- 域：自动化域——`.github/workflows/security.yaml`（持续集成与安全检查如何运行）。
- 工作流在推送主分支、每日定时与手动触发时运行依赖 CVE 审计、OSV 深度扫描和 CodeQL 静态分析。
- OSV 可复用工作流显式声明 `contents: read`、`actions: read`、`security-events: write`，满足嵌套作业读取 Actions 运行信息与上传扫描结果所需的权限。
- 工作流权限遵循最小权限原则，不为其它作业额外开放权限。
