import { AlertTriangle, RefreshCcw } from "lucide-react";

function Error({ 
  title = "Đã xảy ra sự cố!", 
  message = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.", 
  icon, 
  onRetry 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50 rounded-2xl border border-rose-100 w-full animate-in fade-in duration-300">
      
      <div className="mb-4 text-rose-500 bg-white p-4 rounded-full shadow-sm border border-rose-100">
        {icon || <AlertTriangle size={40} strokeWidth={1.5} />}
      </div>
      
      <h3 className="text-lg font-bold text-rose-800">{title}</h3>
      <p className="text-sm text-rose-600 mt-1 mb-5 max-w-md leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          <RefreshCcw size={16} />
          Thử lại ngay
        </button>
      )}
      
    </div>
  );
}

export default Error;