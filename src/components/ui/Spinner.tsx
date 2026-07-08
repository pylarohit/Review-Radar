type SpinnerProps = {
  className?: string;
};

export default function Spinner({ className = "h-5 w-5" }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M22 12a10 10 0 0 0-10-10V0a12 12 0 0 1 12 12h-2Z"
      />
    </svg>
  );
}
