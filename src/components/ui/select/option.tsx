export type OptionProps = {
  value: string;
  label: string;
  disabled?: boolean;
} & React.ComponentProps<"option">;

export function Option({ label, ...props }: OptionProps) {
  return <option {...props}>{label}</option>;
}
