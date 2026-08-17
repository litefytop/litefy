# litefy

轻量 React UI 组件库 CLI，直接将组件源码复制到你的项目，完全可控可修改。

```bash
[pm‑execute] litefy init
[pm‑execute] litefy@latest add button
```

## ✨ 特性

- 🎨 **零运行时依赖**，图标仅依赖 `lucide-react`
- 📦 **复制而非安装**：组件源码写入本地项目，可随意修改
- 📋 **内置组件注册表**：注册表随 CLI 打包发布，无需额外远程接口请求
- 🌐 **组件源码通过 jsDelivr CDN 获取**
- 📄 支持附带下载组件文档 Markdown（`--docs`）

## 安装

无需提前安装，直接使用 [pm‑execute]：

```bash
[pm‑execute] litefy init
```

或者全局安装：

```bash
npm install -g litefy
litefy init
```

## 使用

### 初始化项目配置

```bash
litefy init
```

在项目根目录生成 `litefy.json`。

选项：

- `-y, --yes`：跳过交互，直接使用默认配置

### 添加组件

```bash
[pm‑execute] litefy@latest add button
[pm‑execute] litefy@latest add modal drawer
[pm‑execute] litefy@latest add accordion --docs
```

选项：

- `-o, --overwrite`：强制覆盖已存在的组件文件
- `-d, --docs`：同步下载组件 Markdown 文档到 `docs/`

### 删除组件

```bash
litefy rm button
```

### 可用组件

完整组件清单内置在 CLI 注册表中：
`accordion`, `anchor`, `button`, `carousel`, `checkbox`, `combobox`, `date‑picker`, `description`, `dialog`, `drawer`, `dropdown`, `empty`, `form`, `image`, `input`, `loading`, `number‑field`, `paginated‑viewer`, `pagination`, `paper`, `password`, `progress`, `radio`, `select`, `separator`, `sidebar`, `slider`, `tabs`, `text‑area`, `theme`, `title`, `toast`, `tooltip`, `upload`, `virtual‑scroll`, `watermark`

## 配置说明 `litefy.json`

```json
{
  "components": "./src/components",
  "installed": ["button", "modal"]
}
```

- `components`：组件存放目录
- `installed`：已安装组件列表，CLI 自动维护

## 工作原理

1. `litefy init` 在本地生成配置文件 `litefy.json`。
2. CLI 使用**打包在内部的组件注册表**，不请求远程 registry 接口。
3. 根据注册表内 CDN 地址，下载对应的 `.tsx` 组件源码写入你的项目目录。
4. 组件代码完全归你所有，无黑盒，可任意修改。

> 新增/更新组件需要发布新版本 CLI，注册表跟随 npm 包一起分发。

## 版本说明

CLI 跟随 npm 版本发布，注册表内置在包内。
指定版本使用：

```bash
[pm‑execute] litefy@0.1.2 add button
```

## License

MIT
