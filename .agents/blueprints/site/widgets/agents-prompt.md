# AI 接入提示（app/components/agents-prompt.tsx · AgentPrompt）

- 页面提供中英双语的 Litefy 消费 prompt，可复制；文案随路由语言切换。
- prompt 说明结构文档与 design.md 的分工、headless 与皮肤项目的差异，以及成品组件和低层零件二选一的规则。
- prompt 给出 `litefy@latest` 的新项目流程：React 19+、TypeScript、Tailwind CSS 4、`init`、`add`、样式表导入与皮肤组件导入路径；固定版本仅用于临时冒烟测试。
- 机器可读文档与 design.md 链接固定到提交 `40515e8a9b66bd56f09ae263e970df1033067dfb`，不跟随分支漂移。
- 复制成功显示对勾与状态文本，复制失败显示可手动复制的提示；不改变现有按钮与代码块外观。
