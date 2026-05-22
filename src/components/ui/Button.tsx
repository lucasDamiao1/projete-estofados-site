import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium tracking-[0.08em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary px-6 py-3 text-background shadow-soft hover:-translate-y-0.5 hover:bg-dark hover:shadow-lift",
        secondary:
          "border border-primary/20 bg-background/80 px-6 py-3 text-primary hover:-translate-y-0.5 hover:border-accent hover:bg-white/70",
        accent:
          "bg-accent px-6 py-3 text-background shadow-soft hover:-translate-y-0.5 hover:bg-[#a55f45] hover:shadow-lift",
        ghost:
          "px-3 py-2 text-primary/80 hover:text-primary",
      },
      size: {
        default: "min-h-11",
        sm: "min-h-10 px-4 text-xs",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
