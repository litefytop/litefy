# Field 皮肤常量（app/ui/skins/field.tsx）

- 职责：字段 chrome 共用类常量 `fieldChromeClasses`（root / label / required / description / error），由 Input / Password / NumberInput / Select 等控件皮肤经 `fieldClassNames` 透传给内部 Field 机制；无常量组件、无皮肤组件导出。

1. root：`[&>*+*]:mt-1` 行节奏——label → 控件 → 提示；字段间距归外层 wrapper。
2. label：块级 + `ps-2` 缩进，`text-sm` + `control-label`；必填星号 `text-danger`。
3. 提示行：固定 `h-5` + `ps-2`，`text-sm` + `font-field` + `foreground`——替换描述文字时行节奏不跳。
4. 错误面：`absolute inset-0` + `rounded-md` + `border-frame border-danger` + `bg-surface-raised` 凸起档不透明底（错误条盖在字段上，与字段同档才不显二层）+ `text-danger` + 字段同款内边距与字号；`opacity-0 → 100` 淡入（`duration-sm`），文字由骨架驱动上下滚（`duration-sm ease-frame`）。
5. 专属令牌：无。
