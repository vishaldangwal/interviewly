const CustomBadge = ({
  children,
  variant = "default",
  className = "",
  onClick,
  ...props
}: any) => {
  const variants = {
    default: "bg-blue-600/20 text-blue-300 border-blue-600/30",
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    warning: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
    danger: "bg-red-500/20 text-red-300 border-red-400/30",
    info: "bg-slate-500/20 text-slate-300 border-slate-400/30",
  };

  const Component = onClick ? "button" : "span";

  return (
    <Component
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default CustomBadge;
