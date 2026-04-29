import { Link } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout"; 
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const { handleRegister, isLoading, error } = useAuth();

  return (
    <AuthLayout title="Tạo tài khoản mới">
      
      <p className="text-center text-slate-500 -mt-4 mb-6 text-sm">
        Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng
      </p>

      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        apiError={error}
      />

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