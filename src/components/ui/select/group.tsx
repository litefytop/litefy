export type OptionGroupProps = {
  label: string;
  items: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
} & React.ComponentProps<"optgroup">;

export function OptionGroup({ label, items }: OptionGroupProps) {
  return (
    <optgroup label={label}>
      {items.map((item) => (
        <option key={item.value} value={item.value} disabled={item.disabled}>
          {item.label}
        </option>
      ))}
    </optgroup>
  );
}
