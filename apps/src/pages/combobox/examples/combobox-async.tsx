import { Combobox } from "@/component";

export default function ComboboxAsync() {
  return (
    <Combobox
      options={async (keyword) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return ["React", "Vue", "Angular", "Svelte"].filter((item) =>
          item.toLowerCase().includes(keyword.toLowerCase())
        );
      }}
    />
  );
}
