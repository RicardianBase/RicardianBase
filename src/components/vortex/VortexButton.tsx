import React from "react";

type Variant = "primary" | "secondary" | "tertiary";

interface VortexButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
  onClick?: () => void;
}

const base = "px-7 py-3 rounded-full font-medium text-sm transition-colors whitespace-nowrap inline-flex items-center justify-center";

const variants: Record<Variant, string> = {
  primary: `${base} bg-[#051A24] text-white hover:bg-[#0D212C] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.15),0_8px_24px_rgba(0,0,0,0.1)]`,
  secondary: `${base} bg-white text-[#051A24] shadow-[0_1px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)]`,
  tertiary: `${base} bg-white text-[#051A24] shadow-[0_1px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] ring-1 ring-inset ring-black/5`,
};

const VortexButton: React.FC<VortexButtonProps> = ({ children, variant = "primary", href, className = "", onClick }) => {
  const cls = `${variants[variant]} ${className}`;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} className={cls}>{children}</button>;
};

export default VortexButton;
