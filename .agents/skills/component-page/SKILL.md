---
name: "component-page"
description: "Creates component documentation page following anchor page architecture. Invoke when user wants to create a new component documentation page."
---

# Component Page Creator

创建组件文档页面遵循 anchor page 架构。

## 目录结构

```
src/pages/<component-name>/
├── page.tsx           # 主页面文件
├── doc.md            # 说明页 MD 格式（仅用于复制，不渲染）
├── index.ts           # 导出配置（必须存在）
└── examples/          # 示例目录
    ├── index.ts       # 批量导出所有示例
    └── Example1.tsx   # 示例文件
```

## 页面结构（4 个主要章节）

| 章节 | id | 内容来源 |
|------|-----|---------|
| 安装 | `installation` | ShikiCodeBlock + 组件源码 |
| 示例 | `examples` | examples 目录 |
| 结构 | `anatomy` | Anatomy 组件 |
| 文档 | `docs` | Docs 组件 + i18n 配置 |

## 详细说明

- [page-tsx.md](./page-tsx.md) - 页面结构模板
- [i18n.md](./i18n.md) - 翻译配置说明
- [examples.md](./examples.md) - 示例文件说明
- [doc-md.md](./doc-md.md) - doc.md 说明
