"use client";

import { Checkbox, Form, Input, Password, Radio, Select } from "@/ui";

const countryOptions = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
  { label: "Australia", value: "au" },
  { label: "Japan", value: "jp" },
];

export default function FormBasicDemo() {
  return (
    <Form
      className="w-sm space-y-4"
      onSubmit={async () => {
        await new Promise((r) => setTimeout(r, 800));
        return true;
      }}
    >
      <Form.Field name="name" label="Name">
        {(field) => <Input {...field} placeholder="Enter your name" />}
      </Form.Field>

      <Form.Field
        name="email"
        label="Email"
        description="We'll never share your email."
      >
        {(field) => (
          <Input {...field} type="email" placeholder="you@example.com" />
        )}
      </Form.Field>

      <Form.Field
        name="password"
        label="Password"
        description="At least 8 characters."
      >
        {(field) => <Password {...field} placeholder="••••••••" />}
      </Form.Field>

      <Form.Field name="country" label="Country">
        {(field) => (
          <Select
            id={field.id}
            name={field.name}
            invalid={field.invalid}
            onChange={(e) => field.onChange(e)}
            onBlur={(e) => field.onBlur(e)}
            options={countryOptions}
            placeholder="Select a country"
          />
        )}
      </Form.Field>

      <Form.Field name="gender" label="Gender">
        {(field) => (
          <Radio.Group
            name={field.name}
            invalid={field.invalid}
            defaultValue="male"
            variant="segment"
          >
            <Radio value="male" variant="segment" className="rounded-l-full">
              Male
            </Radio>
            <Radio value="female" variant="segment">
              Female
            </Radio>
            <Radio value="other" variant="segment" className="rounded-r-full">
              Other
            </Radio>
          </Radio.Group>
        )}
      </Form.Field>

      <Form.Field
        name="interests"
        label="Interests"
        description="Select all that apply."
      >
        {(field) => (
          <Checkbox.Group
            name={field.name}
            invalid={field.invalid}
            defaultValue={["frontend"]}
          >
            <Checkbox
              value="frontend"
              variant="toggle"
              className="rounded-l-full"
            >
              Frontend
            </Checkbox>
            <Checkbox value="backend" variant="toggle">
              Backend
            </Checkbox>
            <Checkbox
              value="devops"
              variant="toggle"
              className="rounded-r-full"
            >
              DevOps
            </Checkbox>
          </Checkbox.Group>
        )}
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  );
}
