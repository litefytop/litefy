Litefy · 轻量可私有化 React UI 组件库
Litefy 是一款轻量、无运行时依赖的 React UI 组件库，采用 源码本地化 模式：所有组件、Hook、样式源码直接下载到你的项目，完全可控、可二次修改，无黑盒、无隐性升级。
✨ 核心特性

- 💯 源码本地化：复制而非安装，组件源码完全属于项目，自由修改
- 📦 内置本地注册表：注册表随 CLI 打包发布，无需远程接口请求
- 🌐 CDN 极速拉取：组件源码通过 jsDelivr 按需下载
- 🧩 三类资源统一管理：Components / Hooks / Styles 独立目录、独立安装清单
- 🔁 全自动 Barrel 聚合：自动维护 index.ts 导出，无冗余、无残留
- 🛠 完整工程化指令：init / add / rm / repair / clean / uninstall
- 🎨 零运行时依赖：仅图标依赖 lucide-react，样式基于 Tailwind CSS
  📥 安装使用
  支持临时执行 / 全局安装两种方式，无需提前配置。
  临时执行（推荐）

# 初始化项目

npx litefy init

# 添加组件

npx litefy add button modal

全局安装
npm install -g litefy

litefy init
litefy add button

📖 完整命令文档

1. 初始化项目
   生成 litefy.json 配置、目录骨架、基础 CSS、自动安装依赖。
   litefy init

参数：

- -y, --yes：跳过交互，使用默认目录配置

2. 添加组件 / Hook / 样式
   根据内置注册表按需下载资源，自动维护安装清单与模块导出。
   litefy add button
   litefy add use-toggle dialog

参数：

- -o, --overwrite：强制覆盖已存在文件

3. 删除组件 / Hook / 样式
   删除本地文件、清理配置、自动重写导出，纯离线操作。
   litefy rm button
4. Repair 修复（联网）
   场景：配置完好、文件被手动删除
   以 installed 配置为真相源，自动补全缺失的组件/Hook 文件。
   litefy repair

5. Clean 清理（纯离线）
   场景：文件已删除、配置残留导致 TS 报错
   扫描磁盘真实文件，修剪无效配置，不下载任何资源。
   litefy clean

6. Uninstall 完全卸载
   二次确认后，删除所有 Litefy 本地目录 + litefy.json，重置项目状态。
   litefy uninstall

📂 配置文件 litefy.json
全新三层结构，彻底隔离组件、钩子、样式资源，互不干扰。
{
"components": {
"path": "./src/ui/litefy/components",
"installed": ["button", "dialog"]
},
"hooks": {
"path": "./src/ui/litefy/hooks",
"installed": ["use-toggle"]
},
"styles": {
"path": "./src/ui/litefy/styles",
"installed": []
}
}

CLI 全自动维护所有 installed 数组与 index.ts 导出，无需手动修改。
⚙️ 工作原理（核心闭环）

1. 注册表本地内置：组件清单、类型、CDN 地址全部打包在 CLI 内部，无需后端服务。
2. 唯一真相源：所有导出、安装状态以 litefy.json 中 installed 数组为准。
3. 无字符串匹配逻辑：Add / Rm / Repair / Clean 全部完整重写 index.ts，彻底杜绝注释、手动修改导致的导出错乱。
4. 按需联网：仅 Add / Repair 需要网络下载源码，Rm / Clean / Uninstall 完全离线。
5. 样式保护性忽略：Repair / Clean 不处理 CSS 文件，保留用户自定义样式修改。
   📦 可用资源清单
   组件、Hooks 持续更新，内置清单包含：
   accordion, anchor, button, carousel, checkbox, collapse, combobox, date-picker, description, dialog, drawer, dropdown, empty, form, image, input, loading, number-field, paginated-viewer, pagination, paper, password, progress, radio, select, separator, sidebar, slider, tabs, text-area, theme, title, toast, tooltip, upload, virtual-scroll, watermark
   📌 版本机制
   注册表、组件资源跟随 CLI 版本发布，升级 CLI 即可获取最新组件与修复：
   npx litefy@latest add button

📄 License
MIT
