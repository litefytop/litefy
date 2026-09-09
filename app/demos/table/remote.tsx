"use client";

import * as React from "react";
import { Table, useRemoteSort } from "@/ui";

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

export default function Demo() {
  const remote = useRemoteSort<keyof Product>({
    sortableKeys: ["name", "price", "stock"],
    onSortChange: (sort) => {
      // In production: refetch with ?sortKey=...&sortOrder=...
      console.log("query:", `?sortKey=${sort.key}&sortOrder=${sort.direction}`);
    },
  });

  const sorted = React.useMemo(() => {
    const active = remote.sort;
    if (!active) return allProducts;
    const { key, direction } = active;
    return [...allProducts].sort((a, b) => {
      const cmp = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
      return direction === "asc" ? cmp : -cmp;
    });
  }, [remote.sort]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <Table
        data={sorted}
        sort={remote.sort}
        onSortChange={remote.setSort}
        columns={[
          {
            key: "name",
            header: "Name",
            sortable: true,
            render: (row) => <span className="font-medium">{row.name}</span>,
          },
          { key: "category", header: "Category" },
          { key: "price", header: "Price", sortable: true, align: "right", render: (row) => `$${row.price}` },
          { key: "stock", header: "Stock", sortable: true, align: "right" },
        ]}
      />
      <p className="text-xs text-muted-foreground">
        Remote mode: sorting is delegated to the database via{" "}
        <code className="rounded bg-muted px-1">{remote.queryString || "(unsorted)"}</code>
      </p>
    </div>
  );
}
