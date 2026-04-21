import {
  BookOpen,
  LayoutDashboard,
  Book,
  CreditCard,
  LogOut,
  Compass,
  Library,
  User ,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import Logo from "../../components/common/Logo";
import { ConfirmModal } from "../../components/common"; // Lấy vũ khí ra xài

function Sidebar({ isSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  // State quản lý hộp thoại đăng xuất
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Lấy role từ user thật, fallback là 'reader'
  const role = user?.role?.toLowerCase() || 'reader';

  // MENU THEO ROLE (Đã đổi 'user' thành 'reader' và thêm 'profile')
  const menus = {
    reader: [
      { label: "Trang chủ", path: "/", icon: <LayoutDashboard size={20} /> },
      { label: "Khám phá", path: "/books", icon: <Compass size={20} /> },
      { label: "Tủ sách", path: "/my-books", icon: <Library size={20} /> },
      { label: "Phí & thanh toán", path: "/payments", icon: <CreditCard size={20} /> },
      { label: "Hồ sơ cá nhân", path: "/profile", icon: <User size={20} /> },
    ],
    admin: [
      { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
      { label: "Quản lý sách", path: "/admin/books", icon: <Book size={20} /> },
      { label: "Thanh toán", path: "/admin/payments", icon: <CreditCard size={20} /> },
    ],
    librarian: [
      { label: "Tổng quan", path: "/librarian", icon: <LayoutDashboard size={20} /> },
      { label: "POS", path: "/librarian/pos", icon: <Compass size={20} /> }, // Trang khám phá chung cho tất cả
      { label: "Quản lý sách", path: "/librarian/books", icon: <Library size={20} /> },
      { label: "Mượn trả", path: "/librarian/borrows", icon: <Book size={20} /> },
      { label: "Độc giả", path: "/librarian/users", icon: <Users size={20} /> },
      { label: "Thanh toán", path: "/librarian/payments", icon: <CreditCard size={20} /> },
    ],
  };

  const menuItems = menus[role] || [];

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <>
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-slate-200 h-screen fixed left-0 top-0 transition-all duration-300 z-40 flex flex-col`}
      >
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className={`flex items-center ${
            isSidebarOpen ? "px-6 justify-start" : "justify-center"
          } border-b border-slate-100 h-16 cursor-pointer flex-shrink-0 hover:bg-slate-50 transition-colors`}
        >
          <Logo
            size={28}
            textSize="text-xl"
            showText={isSidebarOpen}
          />
        </div>

       {/* MENU ITEMS */}
        <div className="py-6 flex-1 overflow-y-auto overflow-x-hidden space-y-1.5 custom-scrollbar">
          {menuItems.map((item) => {
            
            // 🌟 SỬA Ở ĐÂY: Khai báo danh sách các trang "gốc" không được dùng startWith
            const isBaseRoute = item.path === '/' || item.path === '/admin' || item.path === '/librarian';
            
            // Nếu là trang gốc -> Bắt buộc phải giống hệt 100%
            // Nếu là trang con -> Chỉ cần URL bắt đầu bằng path là được sáng đèn
            const isActive = location.pathname === item.path || (!isBaseRoute && location.pathname.startsWith(item.path));

            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 py-3 cursor-pointer transition-all relative group
                  ${isSidebarOpen ? "px-6 mx-3 rounded-xl" : "justify-center mx-2 rounded-xl"}
                  ${isActive 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }
                `}
                title={!isSidebarOpen ? item.label : ""} // Hiện tooltip khi thu gọn
              >
                {/* Thanh kẻ dọc bên trái khi Active (Chỉ hiện khi mở sidebar) */}
                {isActive && isSidebarOpen && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
                )}
                
                <div className={`${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} transition-colors`}>
                  {item.icon}
                </div>
                
                {/* Dùng whitespace-nowrap để text không bị rớt dòng khi thu gọn */}
                <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* FOOTER (Tự động đẩy xuống đáy nhờ flex-1 của Menu phía trên) */}
        <div className="border-t border-slate-100 p-4 flex-shrink-0 bg-slate-50/50">
          
          {/* USER INFO */}
          <div 
            className={`flex items-center gap-3 mb-3 ${!isSidebarOpen && "justify-center"} cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={() => navigate("/profile")}
            title={!isSidebarOpen ? "Hồ sơ của tôi" : ""}
          >
            {/* AVATAR */}
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold shadow-sm flex-shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-semibold text-sm text-slate-800 truncate">
                  {user?.fullName || user?.name || "User"}
                </p>
                <p className="text-xs text-blue-600 font-medium truncate mt-0.5">
                  {user?.role === 'READER' ? 'Độc giả' : user?.role || 'Khách'}
                </p>
              </div>
            )}
          </div>

          {/* LOGOUT */}
          <div
            onClick={() => setIsLogoutModalOpen(true)} // Mở Dialog thay vì gọi logout luôn
            className={`flex items-center gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer py-2.5 rounded-xl transition-colors
              ${isSidebarOpen ? "px-4" : "justify-center"}
            `}
            title={!isSidebarOpen ? "Đăng xuất" : ""}
          >
            <LogOut size={20} />
            <span className={`whitespace-nowrap font-medium ${!isSidebarOpen && "hidden"}`}>
              Đăng xuất
            </span>
          </div>
        </div>
      </div>

      {/* HỘP THOẠI XÁC NHẬN ĐĂNG XUẤT */}
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Đăng xuất khỏi hệ thống"
        message="Bạn có chắc chắn muốn đăng xuất? Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng thư viện."
        confirmText="Đăng xuất"
        cancelText="Hủy"
        isDanger={true} // Nút Đăng xuất sẽ có màu đỏ
      />
    </>
  );
}

export default Sidebar;