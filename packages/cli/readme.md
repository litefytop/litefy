# Litefy · 源码本地化的 React 组件库

- 组件骨架与皮肤、钩子、工具、方案样式表以源码文件复制进你的项目，之后归你改。
- npm 包名 `litefy`，可执行文件 `litefy`，版本与 `registry.json` 一起发布。
- 无头骨架零 class、零样式钩子，只发逻辑 `data-*` 与 aria；`add` 会把骨架与对应皮肤一起装好，外观由风格方案的样式表驱动。

## 前提条件

- React 19+（用了 React 19 的新特性，低版本不兼容）
- TypeScript
- Tailwind CSS 4：方案样式表是纯主题层，须接进你自己的 Tailwind 入口（先 `@import "tailwindcss"` 再 `@import` 方案 `index.css`）；没有 Tailwind 就生成不出皮肤写的工具类

## 命令

| 命令 | 做什么 | 联网 |
|------|--------|------|
| `litefy init` | 生成 `litefy.json`，交互选定方案（或选暂不=纯 headless），建 `ui/litefy/{components,skins,styles,utils}` 与聚合 barrel，装依赖 | 装依赖与样式表时 |
| `litefy add <components...>` | 下载组件骨架并随装对应皮肤，解析每条 `dependence` 带出依赖；纯样式组件（callout / card / badge 等）没有骨架，直接安装皮肤文件 | 是 |
| `litefy add style <scheme>` | 安装或切换一个风格方案的样式表（纯主题层）；最后安装的方案是 `styles/index.css` 唯一接线的方案；把它接进你自己的 Tailwind 入口（先 `@import "tailwindcss"` 再 `@import` 它），皮肤工具类由你的入口扫描生成 | 是 |
| `litefy install` | 一次性装上 registry 的全部条目 | 是 |
| `litefy rm <names...>` | 删除已装文件（含随装皮肤）并更新配置与导出 | 否 |
| `litefy repair` | 以 `installed` 清单为真相源补拉缺失文件、重建导出 | 是 |
| `litefy clean` | 修剪配置里本地已不存在的记录 | 否 |
| `litefy uninstall` | 删除全部本地 Litefy 目录与 `litefy.json`；业务代码里手写的 import 要你自己清 | 否 |

**选项**：`-y, --yes` 跳过交互并自动装 npm 依赖；`-o, --overwrite` 覆盖已存在文件；`-s, --style <scheme>` 切换方案——写入配置并重装该方案样式表；方案在 init 选定后 `add` 无需再带，混用方案不被支持（方案是项目级决定）；`-a, --all` 只为兼容保留，样式一律整套装；`-i, --icon-library <lib>`（`add` / `install`）换图标适配器——组件的图标 import 永远指向 `icons.tsx`，适配器落盘同名文件、该图标库的 npm 包自动安装（默认 lucide 零依赖；换库后建议跑一次类型检查：全部图标槽位的命名导入都要在适配器上有对应导出）。

未 `init` 直接 `add` 会自动走初始化。`litefy.json` 的路径字段不要手改；自行挪目录要同步改导入路径，CLI 不替你改写。

## litefy.json

四层各自记 `path` 与 `installed`，导出文件由 CLI 整份重写。默认父目录 `./src`，即 `./src/ui/litefy/components`、`…/skins`、`…/utils`、`…/styles`；样式表按别名 `@/ui/litefy/styles/index.css` 接进你的 Tailwind 入口，皮肤从 `@/ui/litefy/skins` 引用（与骨架分桶，避免成品名互相遮蔽）。

## 可装资源

条目逐名等于 `packages/cli/registry.json`，文档不参与判定。

- 组件 66：条目附 `skin` 字段，`add` 时骨架与皮肤一起落位
- 纯样式皮肤 6：`badge` `callout` `card` `cn` `slots` `swatch-picker`（无骨架，安装即皮肤文件本体）
- 钩子 17：`use-chart-palette` `use-combobox` `use-drag` `use-floating-panel` `use-image-status` `use-load-more` `use-motion-preference` `use-pagination` `use-panel-focus` `use-reduced-motion` `use-remote-pagination` `use-remote-sort` `use-scroll-spy` `use-spin` `use-theme` `use-upload-monitor` `use-virtual-scroll`
- 工具 8：`chart-kit` `chart-paint` `date-math` `floating-position` `is-icon-only` `lock-page-scroll` `scheme-duration` `trap-tab-key`
- 样式表 4：`style/minimal/base` `style/minimal/preset` `style/neo-brutalist/base` `style/neo-brutalist/preset`

方案以整体为单位安装：不存在按组件拆分的样式条目。组件条目即「骨架 + 皮肤」成对交付，控件上的类按该方案 `design.md` 的规定生效。

## 拉取来源

`add` / `install` / `repair` / `style` 从 jsDelivr 按需取源码文件；`registry.json` 与离线兜底的 `sources/` 随 CLI 一起打包，没有后端服务。`rm` / `clean` / `uninstall` 全程离线。

## License

MIT
