import React from "react";

// Glass Navigation Link Component
export function GlassNavLink({
  text,
  icon,
  onClick,
  active = false,
  customClass = "",
}: {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  customClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden ${
        active
          ? "text-white bg-blue-500/90 border border-blue-500/50 shadow-lg shadow-blue-500/30"
          : "text-slate-300 hover:text-white"
      } ${customClass}`}
      style={customClass === "dropdown-link" ? { margin: "2px 0" } : {}}
    >
      {/* Left-to-right fill animation */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-600/30 to-blue-500/30 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out ${customClass === "dropdown-link" ? "rounded-xl" : ""}`}
      ></div>
      {/* Subtle border on hover */}
      <div
        className={`absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/30 rounded-xl transition-all duration-300 ${customClass === "dropdown-link" ? "" : ""}`}
      ></div>
      {/* Content */}
      <div className="relative flex items-center space-x-2">
        {icon && icon}
        <span>{text}</span>
      </div>
      {/* Custom hover effect for dropdown */}
      {customClass === "dropdown-link" && (
        <style jsx>{`
          button.dropdown-link:hover {
            background: linear-gradient(
              90deg,
              rgba(59, 130, 246, 0.15) 0%,
              rgba(30, 64, 175, 0.12) 100%
            );
            color: #fff;
            transform: scale(1.04);
            box-shadow: 0 2px 12px 0 rgba(59, 130, 246, 0.1);
            border: 1px solid #3b82f6;
          }
        `}</style>
      )}
    </button>
  );
}

// Mobile Navigation Link Component
export function MobileNavLink({
  text,
  icon,
  onClick,
  active = false,
}: {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
        active
          ? "text-white bg-white/10 border border-white/20"
          : "text-slate-300 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon && icon}
      <span>{text}</span>
    </button>
  );
}

// GradientButton Component
export function GradientButton({
  children,
  onClick,
  variant = "filled",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "filled" | "outline";
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-5 py-2 font-semibold rounded-xl overflow-hidden transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        variant === "filled"
          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white border border-blue-500/30 shadow-lg hover:from-blue-500 hover:to-blue-600 hover:scale-105"
          : "bg-transparent border-2 border-blue-400 text-blue-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:border-blue-500"
      } ${className}`}
      {...props}
    >
      {/* Animated background for outline variant */}
      {variant === "outline" && (
        <span
          className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          aria-hidden="true"
        ></span>
      )}
      {/* Glow effect for filled variant on hover */}
      {variant === "filled" && (
        <span
          className="absolute inset-0 z-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm animate-pulse rounded-xl"
          aria-hidden="true"
        ></span>
      )}
      <span
        className={`relative z-10 transition-colors duration-300 ${variant === "outline" ? "group-hover:text-white" : ""}`}
      >
        {children}
      </span>
    </button>
  );
} 