"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DropdownTrigger, DropdownContent, DropdownItem } from "@/ui";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: rect.left,
    });
  };

  const toggle = () => {
    if (!open) calculatePosition();
    setOpen(!open);
  };

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <DropdownTrigger ref={triggerRef} onClick={toggle}>
        Open Custom Menu
      </DropdownTrigger>

      {open &&
        position &&
        createPortal(
          <DropdownContent
            ref={panelRef}
            className="fixed z-50 bg-white rounded-md border shadow-lg min-w-32 p-1 list-none m-0"
            style={{ top: position.top, left: position.left }}
          >
            <DropdownItem className="not-last:border-b">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={close}>
                Profile
              </button>
            </DropdownItem>
            <DropdownItem className="not-last:border-b">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={close}>
                Settings
              </button>
            </DropdownItem>
            <DropdownItem>
              <button
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                onClick={close}
              >
                Logout
              </button>
            </DropdownItem>
          </DropdownContent>,
          document.body,
        )}
    </>
  );
}
