import { Checkbox } from "@/component";

export default function CheckboxDisabled() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Item Disabled</p>
        <Checkbox disabled label="Disabled Checkbox" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Group Disabled</p>
        <Checkbox.Group disabled>
          <Checkbox value="apple" label="Apple" />
          <Checkbox value="banana" label="Banana" />
          <Checkbox value="orange" label="Orange" />
        </Checkbox.Group>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Group Disabled with Item Override
        </p>
        <Checkbox.Group disabled>
          <Checkbox value="apple" label="Apple" />
          <Checkbox value="banana" label="Banana (Still Disabled)" />
          <Checkbox value="orange" label="Orange" />
        </Checkbox.Group>
      </div>
    </div>
  );
}
