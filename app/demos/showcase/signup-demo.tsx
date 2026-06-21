import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { Input } from "@/ui/input";
import { Password } from "@/ui/password";

export default function SignupDemo() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <h2 className="text-xl font-semibold">Create your account</h2>
      <p className="mt-1 text-sm text-fd-muted-foreground">
        Start your free trial. No credit card required.
      </p>
      <form
        className="mt-5 flex flex-col gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input placeholder="Full name" />
        <Input type="email" placeholder="Email address" />
        <Password placeholder="Password" />
        <Checkbox>
          <span className="text-sm">
            I agree to the
            <span className="text-fd-primary underline-offset-4 hover:underline">
              terms of service
            </span>
          </span>
        </Checkbox>
        <Button className="mt-1 w-full">Create account</Button>
      </form>
      <p className="mt-4 text-center text-xs text-fd-muted-foreground">
        Already have an account?{" "}
        <span className="text-fd-primary underline-offset-4 hover:underline">
          Sign in
        </span>
      </p>
    </div>
  );
}
