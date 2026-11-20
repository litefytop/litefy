# FloatingToc 骨架（app/ui/components/floating-toc.tsx）

- 职责：视口侧缘的浮动目录——纯展示的开合容器；不追踪滚动、不做锚点跳转，活跃状态由外部传入。

## 行为 / 状态

- 导出 `FloatingToc` / `FloatingTocTrigger` / `FloatingTocBar` / `FloatingTocContent` / `FloatingTocItem`，组合使用：

  ```tsx
  <FloatingToc>
    <FloatingTocTrigger>
      <FloatingTocBar active level={1} />
    </FloatingTocTrigger>
    <FloatingTocContent>
      <FloatingTocItem active level={1}>…</FloatingTocItem>
    </FloatingTocContent>
  </FloatingToc>
  ```

- `FloatingToc` 根：只管开合状态与上下文，不渲染 DOM；props `placement`（`right` 默认 / `left`）、`triggerMode`（`hover` 默认 / `press`）、`open` / `defaultOpen` / `onOpenChange`（受控/非受控）、`openDelay`（默认 200）/ `closeDelay`（默认 300）；内部跑 `usePopoverTrigger`（hover→mode hover、press→click），上下文下发 `{ placement, open, onOpenChange, triggerProps, contentProps, anchorName, panelId, mode }`
- `FloatingTocTrigger`：`<button>` 包裹横条，应用上下文 `triggerProps`，`aria-controls` 指面板、`aria-label` 可配（兜底 "Table of contents"），带 `data-placement` + `data-open`；支持原生 button 属性
- `FloatingTocBar`：`<span aria-hidden>`；props `active?: boolean`、`level?: number`（1 为顶层，默认 1）；带 `data-active` + `data-depth={level}` + `data-placement`（读上下文，决定生长原点）
- `FloatingTocContent`：复用 `PopoverContent`；props `offset`（默认 8，映射 placement gap）、`placement` 可覆盖默认推导（根 right → `{ side: left, align: center }`，left 反向）；hover 模式 `autofocus` 关闭；支持原生 div 属性
- `FloatingTocItem`：`<button type="button">`；props `active?: boolean`、`level?: number`；带 `data-active` + `data-depth={level}`；点击先调用户 `onClick` 再收起面板；支持原生 button 属性
- 各部件各自收 `className`，皮肤按部件合并
