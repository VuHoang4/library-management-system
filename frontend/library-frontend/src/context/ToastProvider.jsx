import { useState, useCallback, useMemo } from "react";
import { ToastContext } from "./ToastContext";
import ToastItem from "../components/ui/ToastItem";

let globalId = 0; 

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, type = "info") => {
    const newToast = { id: globalId++, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => remove(newToast.id), 3000);
  }, [remove]);

  const success = useCallback((msg) => show(msg, "success"), [show]);
  const error = useCallback((msg) => show(msg, "error"), [show]);
  const info = useCallback((msg) => show(msg, "info"), [show]);

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