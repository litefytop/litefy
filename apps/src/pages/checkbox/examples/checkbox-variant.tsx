import { useState } from "react";
import { Checkbox } from "@/component";

export default function CheckboxVariant() {
  const [toggleChecked, setToggleChecked] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Checkbox (default)
        </p>
        <Checkbox.Group defaultValue={["a"]}>
          <Checkbox value="a" label="Option A" />
          <Checkbox value="b" label="Option B" />
          <Checkbox value="c" label="Option C" />
        </Checkbox.Group>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Toggle</p>
        <Checkbox
          variant="toggle"
          checked={toggleChecked}
          onValueChange={setToggleChecked}
          label={`Toggle: ${toggleChecked ? "On" : "Off"}`}
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Toggle Group</p>
        <Checkbox.Group defaultValue={["wifi"]}>
          <Checkbox
            variant="toggle"
            value="wifi"
            label="WiFi"
          />
          <Checkbox
            variant="toggle"
            value="bluetooth"
            label="Bluetooth"
          />
          <Checkbox
            variant="toggle"
            value="airplane"
            label="Airplane Mode"
          />
        </Checkbox.Group>
      </div>
    </div>
  );
}
