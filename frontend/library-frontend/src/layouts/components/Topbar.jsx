import { Menu, Search, Bell, X } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationDropdown from "../../components/common/NotificationDropdown";
import { useNotifications } from "../../hooks/useNotifications"; // Import Hook

function Topbar({ onToggleSidebar }) {
  const { search, setSearch } = useContext(SearchContext);
  const [openNotif, setOpenNotif] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. HÚT DỮ LIỆU TỪ HOOK
  const { notifications, unreadCount, isLoading, fetchNotifications, handleMarkAllAsRead } = useNotifications();

  // 2. GỌI API 1 LẦN KHI LOAD TRANG
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Chỉ chuyển trang nếu chưa ở /books
    if (location.pathname !== "/books" && value.trim() !== "") {
      navigate("/books");
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* TRÁI: Nút Menu + Thanh Tìm Kiếm */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>

        {/* Khung tìm kiếm có nút X xóa nhanh */}
        <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 w-full max-w-md border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả, thể loại..."
            className="bg-transparent ml-3 outline-none w-full text-sm text-slate-700 placeholder-slate-400"
            value={search}
            onChange={handleSearchChange}
          />
          {/* Chỉ hiện nút X khi có nội dung search */}
          {search && (
            <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* PHẢI: Chuông thông báo */}
      <div className="flex items-center justify-end relative">
        <button 
          className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none"
          onClick={() => setOpenNotif(!openNotif)}
        >
          <Bell size={22} />
          {/* 3. HIỂN THỊ SỐ LƯỢNG CHƯA ĐỌC LÊN CHUÔNG (Thay vì cái chấm tĩnh cũ) */}
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {openNotif && (
          <div className="absolute top-12 right-0">
            {/* 4. NÉM DỮ LIỆU VÀ HÀM XUỐNG CHO DROPDOWN */}
            <NotificationDropdown 
              notifications={notifications} 
              isLoading={isLoading} 
              onMarkAllRead={handleMarkAllAsRead} 
            />
          </div>
        )}
      </div>

    </div>
  );
}

export default Topbar;