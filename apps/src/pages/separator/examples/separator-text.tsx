import { Separator } from "@/component";

export default function SeparatorWithText() {
  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-lg font-medium">Join our community</h3>
        <p className="text-muted-foreground">Sign up to get the latest updates.</p>
      </div>
      <Separator>OR</Separator>
      <div>
        <h3 className="text-lg font-medium">Continue with</h3>
        <p className="text-muted-foreground">Use your social account to login.</p>
      </div>
    </div>
  );
}
