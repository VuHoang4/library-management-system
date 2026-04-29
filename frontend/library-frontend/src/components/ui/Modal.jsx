import { X } from "lucide-react";
import { useEffect } from "react";

function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) {
  // Khóa cuộn màn hình nền khi bật Modal
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className={`bg-white rounded-2xl shadow-xl w-full animate-in zoom-in-95 duration-200 ${maxWidth}`}>
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-5">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Modal;