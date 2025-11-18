const CustomCard = ({ children, className = "", ...props }: any) => (
  <div
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-blue-600/20 shadow-2xl shadow-blue-600/10 transition-all duration-500 hover:scale-[1.02] hover:border-blue-600/40 group h-[500px] flex flex-col ${className}`}
    {...props}
  >
    {/* Animated border gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
    <div className="absolute inset-[1px] bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-2xl" />

    <div className="relative z-10 p-6 flex flex-col h-full justify-between">
      {children}
    </div>
  </div>
);

export default CustomCard;
