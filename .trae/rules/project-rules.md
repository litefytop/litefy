# 项目规则

## 项目结构
- `src/assets/` - 静态资源
- `src/component/` - 项目专用组件
- `src/component/ui/` - 通用 UI 组件
- `src/lib/` - 工具函数
- `src/pages/` - 页面组件

## 组件放置
- `component/` - 业务逻辑组件
- `component/ui/` - 纯视觉 UI 组件

## 文件命名
- 使用 Kabab-Case

## 导入规范
- 使用别名导出
- 禁止子路径导入
- 禁止文件后缀

## 懒加载
- pages 页面使用 React.lazy
- component 非页面组件不使用懒加载
