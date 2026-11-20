# 源码查看（app/components/source.tsx · FileSource、Source）

- `FileSource` 两态：文件列表 → 单文件预览；预览顶栏路径居左、返回按钮居右，高度由父容器比例约束。
- 列表按无样式骨架 / 皮肤 / 样式入口分组；源码来自构建期 `?raw` 模块，模块级 `codeCache` 保证二次进入零加载闪烁。
- `Source` 由组件名解析 registry 条目与同名皮肤文件，二者去重后交给 `FileSource`——纯样式组件（`type: "skin"` 条目）registry 指向的即是皮肤文件，列表里只出现一次。
