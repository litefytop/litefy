import { useFormContext } from "react-hook-form";
import { Button, ButtonProps } from "@/components";

export function FormSubmit({ ...props }: ButtonProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button type="submit" loading={{ loading: isSubmitting }} {...props}>
      {props.children}
    </Button>
  );
}
