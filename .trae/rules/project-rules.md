# 项目规则

## 项目结构

```
src/
├── assets/           # 静态资源
│   ├── img/          # 图片
│   ├── font/         # 字体
│   └── style/        # 样式 CSS 文件
├── component/        # 项目专用组件
│   └── ui/           # 项目通用 UI 组件（视觉相关）
├── lib/              # 工具函数和第三方库封装
└── pages/            # 页面（用户所看到的）
    └── config/       # 路由和国际化配置
```

## 组件放置规则

- **`component/`** - 项目专用组件
  - 仅当前项目使用的组件
  - 业务逻辑相关的组件
  - 例如：`docs.tsx`（文档展示组件）、`anchor.tsx`（锚点导航）
  
- **`component/ui/`** - 项目通用 UI 组件
  - 与视觉/样式相关的通用组件
  - 可在多个项目中复用的基础 UI 组件
  - 例如：`button.tsx`、`title.tsx`、`anatomy.tsx`

**判断原则**：
- 如果组件包含业务逻辑或特定于当前项目的功能 → 放在 `component/`
- 如果组件是纯视觉/样式相关，且可跨项目复用 → 放在 `component/ui/`

**错误示例**：
- ❌ 将 `docs.tsx` 放在 `component/ui/`（这是文档展示组件，不是通用 UI）
- ❌ 将 `anchor.tsx` 放在 `component/ui/`（这是导航功能组件，不是通用 UI）

## 文件命名

- 文件命名始终使用 Kabab-Case
