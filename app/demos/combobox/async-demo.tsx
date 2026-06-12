"use client";

import { Combobox } from "@/components/ui/combobox";

const fetchOptions = async (keyword: string): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const items = [
    `Result ${keyword} 1`,
    `Result ${keyword} 2`,
    `Result ${keyword} 3`,
    `Another ${keyword} item`,
    `Search ${keyword} result`,
  ];
  
  return items.filter((item) => 
    item.toLowerCase().includes(keyword.toLowerCase())
  );
};

export default function ComboboxAsyncDemo() {
  return (
    <div className="w-72">
      <Combobox 
        options={fetchOptions} 
        placeholder="Search..."
        debounceMs={200}
      />
    </div>
  );
}