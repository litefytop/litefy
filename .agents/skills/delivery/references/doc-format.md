# 文档书写格式（content/docs/，组件与 utils 同一模板，utils 天然没有变体与键盘交互两节）

1. 文件与语言：组件页 `content/docs/component/<name>.mdx`（英文）+ `<name>.zh.mdx`（中文），utils 在 `content/docs/utils/`；frontmatter 与章节标题各自写各自的语言。双语正本与同步机制见 i18n-gate.md，本文件只管格式
2. 变体所有外观共用一个 demo：`<ComponentPreview name="variants" />`，对应 `app/demos/<name>/variants.tsx`
3. 用法节首个 demo 前只允许一行概括：一句话、单段落，demo 已表达的观感与交互不复述、不逐条列举；机制细节（键盘、朗读、内部时钟、兼容性理由）归 API 参考与数据属性表格；额外能力（如 loading）自成小节，一行说明 + demo；文风参考 shadcn。本条由 `scripts/check-doc-format.mjs` 门禁化（组件域：中文正本全查 ≤ 100 字符、英文只查白名单内 ≤ 200 字符；utils 为存量欠账暂不门禁），挂 `types:check` 与 prebuild，违规即失败
4. 属性描述表三列：属性、类型、说明；不设默认值列，有真实默认值的行把默认值并入说明列末尾（中文「，默认 X」、英文 ", defaults to X"），缺省行不写默认值

```markdown
---
{组件页自己的 frontmatter}
---
## 安装

<Installation name="component" />

## 用法

{此处用一行简短的描述}
<ComponentPreview name="basic" />（基础 demo 不带小标题）

### 变体（若存在）

{此处用一行简短的描述}
<ComponentPreview name="variants" />（并非所有组件都有变体，只有组件有多个外观或者其结构功能发生改变才展示，如 `Drawer` 组件的 `expandable` 变体，Button 组件的外观变体等，所有变体用一个demo展示）

## API 参考 （如果是单组件，不存在封装组件和原子组件，直接展示属性描述）

### 封装组件

开箱即用的成品组件。

#### {ComponentName}

{表格：属性描述}
{表格：data-* 属性,如`data-orientation`、`data-state` 等。}

### 原子组件

原子组件是组件的最小单位，用于构建更复杂的组件。

#### {ComponentName}{ComponentPart}

{表格：属性描述}

## 键盘交互（若存在）

{表格：键盘交互}


```
