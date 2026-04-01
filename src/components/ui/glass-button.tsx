import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "relative isolate cursor-pointer rounded-full transition-all duration-300 group",
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

const sizeMap = {
  default: "px-6 py-3.5",
  sm: "px-4 py-2",
  lg: "px-8 py-4",
  icon: "flex h-10 w-10 items-center justify-center",
};

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size = "default", contentClassName, ...props }, ref) => {
    const paddingClass = sizeMap[size || "default"];

    return (
      <button
        ref={ref}
        className={cn(glassButtonVariants({ size }), className)}
        {...props}
      >
        {/* Outer glow on hover */}
        <span className="absolute -inset-0.5 rounded-full bg-[hsl(140,38%,38%)] opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-80" />

        {/* Outer border ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-[hsl(140,30%,50%)] to-[hsl(140,40%,28%)]" />

        {/* Inner fill */}
        <span className="absolute inset-[1.5px] rounded-full bg-gradient-to-b from-[hsl(140,35%,42%)] to-[hsl(140,40%,30%)] transition-all duration-300 group-hover:from-[hsl(140,38%,46%)] group-hover:to-[hsl(140,40%,34%)]" />

        {/* Glass highlight — top half shine */}
        <span className="absolute inset-[1.5px] rounded-full overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
        </span>

        {/* Inner shadow for depth */}
        <span className="absolute inset-[1.5px] rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.15)]" />

        {/* Text */}
        <span
          className={cn(
            "relative z-10 block select-none tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]",
            paddingClass,
            contentClassName
          )}
        >
          {children}
        </span>
      </button>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
