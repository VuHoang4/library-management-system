import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/common"; 

function PrivateRoute({ children, roles }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loading text="Đang kiểm tra quyền truy cập..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = String(user.role || "").toUpperCase().trim();

  if (roles && !roles.includes(userRole)) {
    if (userRole === "ADMIN") return <Navigate to="/admin" replace />;
    if (userRole === "LIBRARIAN") return <Navigate to="/librarian" replace />;
    
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;