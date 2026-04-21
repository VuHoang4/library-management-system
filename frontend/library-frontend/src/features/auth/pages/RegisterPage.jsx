import { Link } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout"; // Import Layout
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  // Lấy logic gọi API từ Custom Hook
  const { handleRegister, isLoading, error } = useAuth();

  return (
    <AuthLayout title="Tạo tài khoản mới">
      
      <p className="text-center text-slate-500 -mt-4 mb-6 text-sm">
        Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng
      </p>

      {/* NHÚNG FORM VÀO ĐÂY */}
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        apiError={error}
      />

      {/* LOGIN LINK */}
      <p className="text-center text-sm mt-6">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="text-blue-600 font-medium hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </p>

    </AuthLayout>
  );
}

export default RegisterPage;