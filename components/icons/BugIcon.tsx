export default function BugIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="8" y="7" width="8" height="12" rx="4" />
      <path d="M12 7V4.5M6.5 8.5l2 1M17.5 8.5l-2 1M4.5 14H8M16 14h3.5M6 19.5l2.4-1.7M18 19.5l-2.4-1.7" />
    </svg>
  );
}
