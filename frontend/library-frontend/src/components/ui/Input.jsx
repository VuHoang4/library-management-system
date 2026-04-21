import { forwardRef } from "react";

const Input = forwardRef(({ label, error, icon: Icon, className = "", ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      
      {/* Wrapper chứa cả Icon và Input */}
      <div className={`flex items-center bg-slate-50 border rounded-xl transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${
        error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-slate-200"
      }`}>
        {/* Render Icon nếu được truyền vào */}
        {Icon && (
          <div className="pl-3 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          className={`flex-1 px-3 py-2.5 bg-transparent text-sm outline-none disabled:text-slate-500 ${className}`}
          {...props}
        />
      </div>
      
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;