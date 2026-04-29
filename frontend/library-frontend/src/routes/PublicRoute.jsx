import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loading } from "../components/common";

function PublicRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loading text="Đang kiểm tra phiên đăng nhập..." />
      </div>
    );
  }

  if (user) {
    const userRole = String(user.role || "").toUpperCase().trim();
    
    if (userRole === "ADMIN") return <Navigate to="/admin" replace />;
    if (userRole === "LIBRARIAN") return <Navigate to="/librarian" replace />;
    
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}

export default PublicRoute;