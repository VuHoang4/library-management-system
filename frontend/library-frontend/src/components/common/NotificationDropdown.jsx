import { Bell, CheckCircle, AlertCircle, BellOff } from "lucide-react";
import { Loading, Empty } from "./index";

function NotificationDropdown({
  notifications = [],
  isLoading,
  onMarkAllRead,
  onMarkRead,
}) {
  const getIcon = (type) => {
    if (type === "WARNING") return <AlertCircle className="text-orange-500" size={18} />;
    if (type === "SUCCESS") return <CheckCircle className="text-emerald-500" size={18} />;
    return <Bell className="text-blue-500" size={18} />;
  };

  return (
    <div className="w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Thông báo</h3>

        {notifications.some(n => n.unread) && (
          <button
            onClick={onMarkAllRead}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="py-10">
            <Loading text="Đang tải thông báo..." />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4">
            <Empty 
              title="Trống" 
              message="Bạn không có thông báo nào." 
              icon={<BellOff size={48} strokeWidth={1.5} />} 
            />
          </div>
        ) : (
          notifications.map((n) => {
            const unread = n.unread;

            return (
              <div
                key={n.id}
                onClick={() => unread && onMarkRead(n.id)}
                className={`flex gap-3 p-4 border-b hover:bg-slate-50 transition cursor-pointer
                  ${unread ? "bg-blue-50/40" : "opacity-70"}
                `}
              >
                <div className="mt-1 flex-shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate 
                    ${unread ? "text-slate-900" : "text-slate-600"}
                  `}>
                    {n.title}
                  </p>

                  <p className="text-sm text-slate-600 line-clamp-2 mt-0.5">
                    {n.content}
                  </p>

                  <p className="text-xs text-slate-400 mt-1.5">
                    {n.createdAt}
                  </p>
                </div>

                {unread && (
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2"></span>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 text-center text-blue-600 text-sm font-medium cursor-pointer hover:bg-slate-50 border-t">
        Xem tất cả thông báo
      </div>
    </div>
  );
}

export default NotificationDropdown;