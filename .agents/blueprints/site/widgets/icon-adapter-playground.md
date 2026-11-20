# IconAdapterPlayground（app/components/icon-adapter-playground.tsx）

- 层：界面域·部件——headless 指南「适配器验证」节的动态演示件。
- 机制：lucide / tabler 双适配器实现同时进站点包，开关切换后网格逐格换字形；数据源 = 当前适配器的 `icons` 映射（普通对象，键即契约名；ES 模块命名空间属性不可枚举，禁止 `Object.entries(命名空间)`）。
- 标签 = 映射后的源库名：取各适配器的 `sourceNames`（契约名 → 源库名映射表，契约面一部分）；排序 = 契约顺序（默认适配器 `icons` 键序锚定），所有适配器同序。
- 数量一致性即验证信号：每个适配器必须导出**完全相同**的字形集合（默认面 37 项）——切到任一适配器网格数量与默认一致即通过，不一致即适配器面错误。
- 依赖：@tabler/icons-react 为根 dependencies（站点演示与适配器类型检查共用）；适配器文件经根 tsconfig 类型检查。
