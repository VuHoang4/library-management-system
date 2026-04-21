// src/components/common/NotificationDropdown.jsx
import { Bell, CheckCircle, AlertCircle } from "lucide-react";
import { Loading, Empty } from "./index"; // Import vũ khí từ thư mục common

function NotificationDropdown({ notifications, isLoading, onMarkAllRead }) {

  const getIcon = (type) => {
    // Lưu ý: Type này phải khớp với chuỗi mà Backend trả về nhé
    if (type === "WARNING" || type === "warning") return <AlertCircle className="text-orange-500" size={18} />;
    if (type === "SUCCESS" || type === "success") return <CheckCircle className="text-emerald-500" size={18} />;
    return <Bell className="text-blue-500" size={18} />;
  };

  return (
    <div className="w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

      {/* HEADER */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Thông báo</h3>
        {notifications.length > 0 && (
          <button 
            onClick={onMarkAllRead}
            className="text-blue-600 text-sm font-medium hover:underline transition-colors"
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        
        {isLoading ? (
          <div className="py-10"><Loading text="Đang tải thông báo..." /></div>
        ) : notifications.length === 0 ? (
          <div className="p-4"><Empty title="Trống" message="Bạn không có thông báo nào mới." icon="🔕" /></div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors relative cursor-pointer
                ${n.unread ? "bg-blue-50/30" : "opacity-70"}
              `}
            >
              {/* ICON */}
              <div className="mt-1 flex-shrink-0">{getIcon(n.type)}</div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${n.unread ? "text-slate-900" : "text-slate-700"}`}>
                  {n.title}
                </p>
                <p className="text-sm text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                  {n.content}
                </p>
                {/* Nên dùng thư viện như date-fns hoặc dayjs để format time Ago nếu lấy từ DB lên */}
                <p className="text-xs text-slate-400 mt-1.5 font-medium">
                  {n.time || n.createdAt} 
                </p>
              </div>

              {/* UNREAD DOT */}
              {n.unread && (
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
              )}
            </div>
          ))
        )}

      </div>

      {/* FOOTER */}
      <div className="p-3 text-center text-blue-600 text-sm font-medium cursor-pointer hover:bg-slate-50 border-t border-slate-100 transition-colors">
        Xem tất cả thông báo
      </div>

    </div>
  );
}

export default NotificationDropdown;