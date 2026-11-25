"use client";

import * as React from "react";
import { useRemoteSort } from "@/ui";
import { Table } from "@/ui/skins";

interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
}

const allProducts: Product[] = [
  { name: "Mechanical keyboard", category: "Peripherals", price: 129, stock: 42 },
  { name: "Wireless mouse", category: "Peripherals", price: 49, stock: 120 },
  { name: "4K monitor", category: "Displays", price: 349, stock: 18 },
  { name: "USB-C hub", category: "Accessories", price: 39, stock: 200 },
  { name: "Laptop stand", category: "Accessories", price: 29, stock: 75 },
];

function renderName(row: Product) {
  return <span>{row.name}</span>;
}

export default function Demo() {
  const remote = useRemoteSort<keyof Product>({
    sortableKeys: ["name", "price", "stock"],
  });

  const sorted = React.useMemo(() => {
    const active = remote.sort;
    if (!active) return allProducts;
    const { key, direction } = active;
    return [...allProducts].toSorted((a, b) => {
      const cmp = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
      return direction === "asc" ? cmp : -cmp;
    });
  }, [remote.sort]);

  return (
    <Table
      data={sorted}
      sort={remote.sort}
      onSortChange={remote.setSort}
      columns={[
        {
          key: "name",
          header: "Name",
          sortable: true,
          span: 3,
          render: renderName,
        },
        { key: "category", header: "Category", span: 2 },
        { key: "price", header: "Price", sortable: true, render: (row) => `$${row.price}` },
        { key: "stock", header: "Stock", sortable: true },
      ]}
    />
  );
}
