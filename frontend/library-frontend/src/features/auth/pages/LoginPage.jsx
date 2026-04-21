import { Link } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout"; // Import Layout
import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  // Lấy logic gọi API từ Custom Hook
  const { handleLogin, isLoading, error } = useAuth();

  return (
    <AuthLayout title="Chào mừng trở lại">
      
      <p className="text-center text-slate-500 -mt-4 mb-6 text-sm">
        Vui lòng đăng nhập để tiếp tục khám phá thư viện
      </p>

      {/* NHÚNG FORM VÀO ĐÂY */}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

      {/* REGISTER LINK */}
      <p className="text-center text-sm mt-6">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-medium hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>

    </AuthLayout>
  );
}

export default LoginPage;