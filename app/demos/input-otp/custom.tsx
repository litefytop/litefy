"use client";

import { useRef, useState } from "react";
import { InputOtpGroup, InputOtpSlot } from "@/ui";

const LENGTH = 6;

export default function Demo() {
  const [value, setValue] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  const focusInput = (index: number) => {
    const input = inputsRef.current[Math.min(LENGTH - 1, Math.max(0, index))];
    input?.focus();
    input?.select();
  };

  const setChar = (index: number, char: string) => {
    const next = [...chars];
    next[index] = char;
    setValue(next.join(""));
    return next;
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-2">
        {[0, 1].map((group) => (
          <div key={group} className="flex items-center gap-2">
            {group === 1 && <span className="text-sm text-muted-foreground">-</span>}
            <InputOtpGroup>
              {chars.slice(group * 3, group * 3 + 3).map((char, i) => {
                const index = group * 3 + i;
                return (
                  <InputOtpSlot
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    value={char}
                    inputMode="numeric"
                    aria-label={`Digit ${index + 1}`}
                    className="size-10 rounded-full"
                    onChange={(e) => {
                      const next = setChar(index, e.target.value.slice(-1));
                      if (next[index]) focusInput(index + 1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        focusInput(index - 1);
                      } else if (e.key === "ArrowRight") {
                        e.preventDefault();
                        focusInput(index + 1);
                      } else if (e.key === "Backspace" && !chars[index] && index > 0) {
                        e.preventDefault();
                        setChar(index - 1, "");
                        focusInput(index - 1);
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text").trim();
                      if (!text) return;
                      const next = [...chars];
                      for (let i = 0; i < text.length && index + i < LENGTH; i++) {
                        next[index + i] = text[i];
                      }
                      setValue(next.join(""));
                      focusInput(index + text.length);
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                );
              })}
            </InputOtpGroup>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Value: {value || "-"}</p>
    </div>
  );
}
