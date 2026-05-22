import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement>;

export function Section({ className, ...props }: SectionProps) {
  return (
    <section
      className={cn("scroll-mt-28 py-20 sm:py-24 lg:py-28", className)}
      {...props}
    />
  );
}
