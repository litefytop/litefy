import { InputOtp } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <InputOtp length={6} defaultValue="420720" disabled aria-label="Verification code" />
      </div>
    </div>
  );
}
