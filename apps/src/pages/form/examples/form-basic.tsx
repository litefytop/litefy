import {
  Form,
  Input,
  Password,
  NumberField,
  DatePicker,
  Slider,
  Upload,
} from "@/component";

export default function FormBasic() {
  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    console.warn("Form submitted:", data);
    alert("Form submitted! Check console for data.");
    return true;
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Form.Field
        label="Username"
        name="username"
        description="Enter your username"
        validConfig={{
          trigger: "onBlur",
          validate: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.trim() === "") return "Please enter username";
          },
        }}
      >
        {(field) => <Input {...field} placeholder="Please enter username" />}
      </Form.Field>

      <Form.Field
        label="Email"
        name="email"
        description="Enter your email address"
        validConfig={{
          trigger: "onBlur",
          validate: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!event.target.value.trim().includes("@")) return "Please enter a valid email";
          },
        }}
      >
        {(field) => <Input {...field} type="email" placeholder="Please enter email" />}
      </Form.Field>

      <Form.Field
        label="Password"
        name="password"
        description="Enter your password"
        validConfig={{
          trigger: "onBlur",
          validate: (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.length < 6) return "Password must be at least 6 characters";
          },
        }}
      >
        {(field) => <Password {...field} placeholder="Please enter password" />}
      </Form.Field>

      <Form.Field
        label="Age"
        name="age"
        description="Enter your age"
        validConfig={{
          trigger: "onBlur",
          validate: (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseFloat(event.target.value);
            if (isNaN(value) || value < 18 || value > 100) return "Age must be between 18 and 100";
          },
        }}
      >
        {(field) => <NumberField {...field} min={0} max={150} placeholder="Please enter age" integer />}
      </Form.Field>

      <Form.Field
        label="Birthday"
        name="birthday"
        description="Select your birthday"
        validConfig={{
          trigger: "onBlur",
          validate: (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            if (!value) return "Birthday is required";
            const birthDate = new Date(value);
            if (isNaN(birthDate.getTime())) return "Invalid date";
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
            if (age < 18 || age > 100) return "Age must be between 18 and 100 years old";
          },
        }}
      >
        {(field) => <DatePicker {...field} type="date" placeholder="Please select birthday" />}
      </Form.Field>

      <Form.Field label="Experience" name="experience" description="Years of experience">
        {(field) => <Slider {...field} defaultValue={5} min={0} max={20} step={1} />}
      </Form.Field>

      <Form.Field
        label="Resume"
        name="resume"
        description="Upload your resume"
        validConfig={{
          trigger: "onChange",
          validate: (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return "Please select a file";
            if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB";
            const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!allowed.includes(file.type)) return "Only PDF, DOC, DOCX files are allowed";
          },
        }}
      >
        {(field) => <Upload {...field} accept=".pdf,.doc,.docx" />}
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  );
}
