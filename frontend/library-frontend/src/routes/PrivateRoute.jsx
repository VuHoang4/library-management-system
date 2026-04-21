import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
// Import component Loading của bạn (nếu có, không thì dùng div bình thường)
// import { Loading } from "../components/common"; 

function PrivateRoute({ children, roles }) {
  // Bổ sung thêm biến isLoading từ Context để biết React đang tải dữ liệu
  const { user, isLoading } = useContext(AuthContext);

  // 🛡️ LỚP GIÁP 1: Chống lỗi F5
  // Đợi AuthContext kiểm tra xong xuôi rồi mới quyết định
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
         Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  // 🔥 Chưa login -> Đá ra trang đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛡️ LỚP GIÁP 2: Chuẩn hóa Role (Chống lỗi chữ thường/chữ hoa/khoảng trắng)
  const userRole = String(user.role || "").toUpperCase().trim();

  // 🔥 Sai role -> Đá ra trang chủ
  if (roles && !roles.includes(userRole)) {
    console.log("🚫 TRUY CẬP TRÁI PHÉP");
    console.log(" - Quyền yêu cầu:", roles);
    console.log(" - Quyền hiện tại:", userRole);
    
    // Nếu là admin đi lạc vào trang thủ thư, đá về /admin cho hợp lý
    if (userRole === "ADMIN") return <Navigate to="/admin" replace />;
    if (userRole === "LIBRARIAN") return <Navigate to="/librarian" replace />;
    
    return <Navigate to="/" replace />;
  }

  // ✅ Vượt qua mọi trạm kiểm soát -> Cho phép vào trong
  return children;
}

export default PrivateRoute;