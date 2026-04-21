import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loading } from "../components/common";

function PublicRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  // Chờ check token xong mới render để tránh bị nháy màn hình
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loading text="Đang kiểm tra phiên đăng nhập..." />
      </div>
    );
  }

  // Nếu đã đăng nhập, tự động điều hướng về đúng "nhà" của từng role
  if (user) {
    if (user.roles?.includes("ADMIN")) return <Navigate to="/admin" replace />;
    if (user.roles?.includes("LIBRARIAN")) return <Navigate to="/librarian" replace />;
    return <Navigate to="/" replace />; // Mặc định là Reader
  }

  // Nếu chưa đăng nhập, cho phép vào trang Login/Register
  return children ? children : <Outlet />;
}

export default PublicRoute;