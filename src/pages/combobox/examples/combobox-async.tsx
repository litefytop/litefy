import { Combobox } from "@/component";

export default function ComboboxAsync() {
  const fetchOptions = async (input: string) => {
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
      "Brazil",
      "Mexico",
      "India",
      "South Korea",
      "Netherlands",
      "Sweden",
      "Norway",
      "Denmark",
      "Finland",
      "Poland",
    ];

    return allOptions.filter((opt) =>
      opt.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <div className="max-w-sm h-64 ">
      <Combobox
        options={fetchOptions}
        placeholder="Search countries (type to filter)..."
        debounceMs={500}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Type to search: China, USA, Japan, Germany, France, United Kingdom,
        Italy, Spain, Canada, Australia, Brazil, Mexico, India, South Korea,
        Netherlands, Sweden, Norway, Denmark, Finland, Poland
      </p>
    </div>
  );
}
