import { Combobox } from "@/component";

export default function ComboboxAsync() {
  const fetchOptions = async (input: string) => {
    // Simulate API call with Promise
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const allOptions = [
      "China",
      "USA",
      "Japan",
      "Germany",
      "France",
      "United Kingdom",
      "Italy",
      "Spain",
      "Canada",
      "Australia",
    ];

    return allOptions.filter((opt) =>
      opt.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <div className="max-w-sm h-64">
      <Combobox
        fetchOptions={fetchOptions}
        placeholder="Search countries..."
        debounceMs={500}
      />
    </div>
  );
}
