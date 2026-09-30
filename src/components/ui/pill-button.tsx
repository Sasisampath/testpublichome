type PillButtonProps = {
  children: React.ReactNode;
  variant?: "dark" | "outline";
  className?: string;
};

export function PillButton({
  children,
  variant = "dark",
  className = "",
}: PillButtonProps) {
  const styles =
    variant === "dark"
      ? "bg-[var(--button-dark)] text-white"
      : "border border-[rgba(19,19,21,0.4)] bg-white text-[#242424]";

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90 ${styles} ${className}`}
    >
      {children}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
        →
      </span>
    </button>
  );
}
