## 页面开发规则

### Title 与 Description

- 页面中 title 后紧跟的描述文本必须使用 Description 组件，而不是手动写 p 标签

### 避免冗余 div

- 禁止 div 直接嵌套 div 的写法
- 原因：减少 DOM 层级，提升渲染性能

**错误示例：**
```tsx
<div className="class1">
  <div className="class2">
    <element />
  </div>
</div>
```

**正确示例：**
```tsx
<div className="class1 class2">
  <element />
</div>
```

**除外情况（需要保留多层级）：**
- 父容器需要不同样式（如 border、padding、bg）
- 子元素需要不同样式（如 flex 布局、grid 布局）
- 多个子元素需要各自独立样式

```tsx
<div className="class0">
  <div className="class1">
    <element />
  </div>
  <div className="class2">
    <element />
  </div>
</div>
```
