import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, contentClassName, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "glass-btn relative isolate cursor-pointer rounded-full group transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* Soft outer glow */}
        <span className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-[hsl(140,38%,38%)]/20" />

        {/* Border — gradient from light to dark green */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-[hsl(140,35%,55%)] via-[hsl(140,38%,40%)] to-[hsl(140,40%,30%)] p-[1.5px] rounded-full">
          <span className="block w-full h-full rounded-full bg-[hsl(140,36%,36%)]" />
        </span>

        {/* Glass layers */}
        <span className="absolute inset-[1.5px] rounded-full overflow-hidden">
          {/* Base gradient */}
          <span className="absolute inset-0 bg-gradient-to-b from-[hsl(140,32%,44%)] via-[hsl(140,36%,36%)] to-[hsl(140,40%,28%)] group-hover:from-[hsl(140,34%,48%)] group-hover:via-[hsl(140,38%,40%)] group-hover:to-[hsl(140,40%,32%)] transition-all duration-300" />

          {/* Top highlight — the key glass effect */}
          <span className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-white/30 via-white/10 to-transparent" />

          {/* Bottom subtle reflection */}
          <span className="absolute inset-x-[20%] bottom-[2px] h-[15%] bg-gradient-to-t from-white/8 to-transparent rounded-full blur-[1px]" />

          {/* Side light edges */}
          <span className="absolute inset-y-[10%] left-[1px] w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          <span className="absolute inset-y-[10%] right-[1px] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </span>

        {/* Inner shadow for 3D depth */}
        <span className="absolute inset-[1.5px] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.2)]" />

        {/* Text content */}
        <span
          className={cn(
            "relative z-10 block select-none tracking-tight text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] px-8 py-4",
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

export { GlassButton };
