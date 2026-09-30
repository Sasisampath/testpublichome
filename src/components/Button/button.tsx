import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "vendor" | "partner";
  children: ReactNode;
};

const variantClasses = {
  vendor: "bg-[var(--cta-vendor)] text-white hover:bg-[var(--cta-vendor-hover)]",
  partner: "bg-[var(--cta-partner)] text-white hover:bg-[var(--cta-partner-hover)]",
  primary: "bg-[#E5484D] text-white hover:bg-[#d43d42]",
  secondary: "bg-[#111827] text-white hover:bg-[#1f2937]",
  outline: "border border-[#e6e8ea] bg-white text-[#374151] hover:bg-[#f9fafb]",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
