"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IS_FIGMA_EXPORT } from "@/lib/figma-export";

// Gentle fade-up on first scroll into view. Content stays visible until JS
// arms the effect, and nothing animates under prefers-reduced-motion.
export function Reveal({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: "div" | "figure";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || IS_FIGMA_EXPORT || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    node.classList.add("dh-reveal--armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add("dh-reveal--in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`dh-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
