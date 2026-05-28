import { Checkbox } from "@/component";

export default function CheckboxDisabled() {
  return (
    <div>
      <div>
        <label className="text-sm font-medium text-foreground">
          Checkbox Disabled
        </label>
        <Checkbox disabled options={[
          {
            value: "apple",
            label: "Apple",
          },
          {
            value: "banana",
            label: "Banana",
          },
          {
            value: "orange",
            label: "Orange",
          },
        ]}/>
          
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">
          Checkbox Item Disabled
        </label>
        <Checkbox  options={[
          {
            value: "apple",
            label: "Apple",
            disabled: true,
          },
          {
            value: "banana",
            label: "Banana",
          },
          {
            value: "orange",
            label: "Orange",
          },
        ]} />
         
      </div>
    </div>
  );
}
