export function HorseIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2c0 0-3 4.5-3 8a3 3 0 1 0 6 0c0-3.5-3-8-3-8Z"/>
      <path d="M9 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
      <path d="M15 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
      <path d="M9 10c0-2 1-3 2-3s2 1 2 3c0 1-1 2-2 3"/>
      <path d="M12 22c3-2 6-7 6-12 0-2-1.5-4-3-6"/>
      <path d="M6 22c-3-2-6-7-6-12 0-2 1.5-4 3-6"/>
    </svg>
  );
}
