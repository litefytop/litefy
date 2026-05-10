# 示例文件说明

## examples/index.ts

批量导出所有示例：

```ts
export * from "./Example1";
export * from "./Example2";
```

## examples/Example1.tsx

示例组件文件：

```tsx
export default function Example1() {
  return (
    <div>
      {/* 演示代码 */}
    </div>
  );
}
```

## 使用方式

在 page.tsx 中导入示例：

```tsx
import Example1Raw from "./examples/Example1.tsx?raw";
import { Example1 } from "./examples";

// 渲染
<DemoSection
  id="basic"
  title={l.basic.title}
  code={Example1Raw}
>
  <Example1 />
</DemoSection>
```

- `Example1` - 渲染的组件
- `Example1Raw` - 源码（通过 `?raw` 获取字符串）
