import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "relative isolate cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(glassButtonVariants({ size }), "group", className)}
        {...props}
      >
        <span
          className={cn(
            "glass-button-inner absolute inset-0 rounded-full overflow-hidden",
            "before:absolute before:inset-0 before:rounded-full before:bg-[hsl(140,38%,38%)] before:transition-all before:duration-300",
            "after:absolute after:inset-[1px] after:rounded-full after:bg-[hsl(140,38%,38%)] after:transition-all after:duration-300",
          )}
        >
          <span
            className={cn(
              "absolute inset-[1px] rounded-full transition-all duration-300",
              "bg-gradient-to-b from-[hsl(140,38%,48%)] to-[hsl(140,38%,32%)]",
              "group-hover:from-[hsl(140,38%,52%)] group-hover:to-[hsl(140,38%,36%)]",
            )}
          />
          <span
            className={cn(
              "absolute inset-[1px] rounded-full opacity-50 transition-all duration-300",
              "bg-gradient-to-b from-white/20 to-transparent",
              "group-hover:opacity-70",
            )}
          />
        </span>
        <span
          className={cn(
            glassButtonTextVariants({ size }),
            "relative z-10 text-white drop-shadow-sm",
            contentClassName
          )}
        >
          {children}
        </span>
        <span
          className={cn(
            "absolute -inset-1 rounded-full opacity-0 blur-lg transition-all duration-300",
            "bg-[hsl(140,38%,38%)]/30 group-hover:opacity-100",
          )}
        />
      </button>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
