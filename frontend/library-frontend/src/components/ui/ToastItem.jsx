import { CheckCircle, XCircle, Info } from "lucide-react";
function ToastItem({ message, type, onClose }) {
  const styles = {
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div
      className={`min-w-[300px] px-4 py-3 rounded-xl shadow-md border flex items-center justify-between animate-slide-in ${styles[type]}`}
    >
      <div className="flex items-center gap-2">
        <span>{icons[type]}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>

      <button
        onClick={onClose}
        className="ml-4 text-slate-400 hover:text-slate-600"
      >
        ✕
      </button>
    </div>
  );
}

export default ToastItem;