"use client";

import { DualPicker } from "@/ui";

type Product = { name: string; emoji: string; price: number };

const products: Product[] = [
  { name: "Mechanical keyboard", emoji: "⌨️", price: 129 },
  { name: "Wireless mouse", emoji: "🖱️", price: 49 },
  { name: "4K monitor", emoji: "🖥️", price: 349 },
  { name: "USB-C hub", emoji: "🔌", price: 39 },
  { name: "Webcam", emoji: "📷", price: 89 },
];

export default function Demo() {
  return (
    <DualPicker<Product>
      className="w-full max-w-xl"
      mode="multiple"
      options={products.map((p) => ({ value: p.name, option: p }))}
      getLabel={(p) => `${p.emoji} ${p.name}`}
      renderOption={(product, { selected }) => (
        <span className="flex w-full items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <span aria-hidden>{product.emoji}</span>
            <span className="truncate">{product.name}</span>
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            ${product.price}
            {selected && " · selected"}
          </span>
        </span>
      )}
      renderSelected={(product, { onRemove }) => (
        <span className="flex w-full items-center justify-between gap-2">
          <span className="truncate">
            {product.emoji} {product.name}
          </span>
          <button
            type="button"
            className="shrink-0 text-xs text-muted-foreground underline hover:text-danger"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            remove
          </button>
        </span>
      )}
      onValueChange={(values) => console.log("selected:", values)}
    />
  );
}
