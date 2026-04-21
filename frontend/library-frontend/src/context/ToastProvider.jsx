import { useState, useCallback, useMemo } from "react";
import { ToastContext } from "./ToastContext";
import ToastItem from "../components/ui/ToastItem";

// Đổi tên thành globalId cho dễ phân biệt với id của toast
let globalId = 0; 

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // 1. Đóng băng hàm remove
  const remove = useCallback((id) => {
    // Dùng callback (prev =>) nên không cần đưa toasts vào mảng dependency
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 2. Đóng băng hàm show
  const show = useCallback((message, type = "info") => {
    const newToast = { id: globalId++, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => remove(newToast.id), 3000);
  }, [remove]);

  // 3. Đóng băng các hàm con
  const success = useCallback((msg) => show(msg, "success"), [show]);
  const error = useCallback((msg) => show(msg, "error"), [show]);
  const info = useCallback((msg) => show(msg, "info"), [show]);

  // 🌟 NƠI QUAN TRỌNG NHẤT: Đóng băng cái Object value truyền đi
  // Giờ đây value sẽ không bao giờ bị tạo mới trừ khi các hàm trên thay đổi
  const value = useMemo(() => ({
    success,
    error,
    info,
  }), [success, error, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-5 right-5 z-50 space-y-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;