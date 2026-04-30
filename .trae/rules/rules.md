# 项目规则

## 文件命名

- 文件命名始终使用 Kabab-Case

## 代码结构

- 项目始终使用别名导出而不是相对路径

## 样式组织

- 组件样式使用对象管理，需要选择的样式（variant/size等）放在对象中导出，不需要选择的样式（base）直接写在组件里
- 示例：buttonClass = { base: "...", variant: {...}, size: {...} }，组件中使用 checkboxClass.variant[variant]

## 组件属性组织

- 组件需要支持子元素属性透传时，必须使用统一的 itemProps 对象结构
- itemProps 必须是对象类型，包含所有需要透传的子元素属性
- 示例：itemProps = { trigger: {...}, title: {...}, content: {...}, nav: {...} }
- 禁止将子元素属性作为组件的顶级属性单独暴露
- 每个子元素属性必须使用对应的 HTML 元素类型进行类型约束
- 必须排除组件内部已处理的属性（如 href、onClick 等）

