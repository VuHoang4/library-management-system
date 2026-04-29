import { Menu, Search, Bell, X } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationDropdown from "../../components/common/NotificationDropdown";
import { useNotifications } from "../../hooks/useNotifications";

function Topbar({ onToggleSidebar }) {
  const { search, setSearch } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const [openNotif, setOpenNotif] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    handleMarkAllAsRead,
    handleMarkAsRead,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (location.pathname !== "/books" && value.trim() !== "") {
      navigate("/books");
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  const role = user?.role?.toLowerCase() || "reader";
  const showSearch = role !== "admin" && role !== "librarian";

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-6 sticky top-0 z-30">
      
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>

        {showSearch && (
          <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 w-full max-w-md transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white border border-transparent focus-within:border-blue-200">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-transparent ml-3 outline-none w-full text-sm text-slate-700"
              value={search}
              onChange={handleSearchChange}
            />
            {search && (
              <button 
                onClick={clearSearch}
                className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded-full hover:bg-rose-50"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="relative flex items-center">
        <button
          className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          onClick={() => setOpenNotif(prev => !prev)}
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {openNotif && (
          <div className="absolute top-12 right-0 z-50">
            <NotificationDropdown
              notifications={notifications}
              isLoading={isLoading}
              onMarkAllRead={handleMarkAllAsRead}
              onMarkRead={handleMarkAsRead}
            />
          </div>
        )}
      </div>
      
    </div>
  );
}

export default Topbar;