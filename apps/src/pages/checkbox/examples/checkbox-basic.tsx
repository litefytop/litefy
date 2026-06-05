import { useState } from "react";
import { Checkbox } from "@/component";

export default function CheckboxBasic() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Uncontrolled</p>
        <Checkbox label="I agree to the terms" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Controlled</p>
        <Checkbox
          checked={checked}
          onValueChange={setChecked}
          label={`Controlled: ${checked ? "Checked" : "Unchecked"}`}
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Group</p>
        <Checkbox.Group
          defaultValue={["apple"]}
          onValueChange={(values) => console.log(values)}
        >
          <Checkbox value="apple" label="Apple" />
          <Checkbox value="banana" label="Banana" />
          <Checkbox value="orange" label="Orange" />
        </Checkbox.Group>
      </div>
    </div>
  );
}
