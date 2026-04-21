import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { loginApi, registerApi } from "../services/authApi"; 

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Lấy hàm login và logout từ Kho tổng (AuthContext) của bạn
  const { login, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  // ==========================================
  // 1. HÀM XỬ LÝ ĐĂNG NHẬP
  // ==========================================
  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Gọi API đăng nhập từ trạm dịch vụ
      const response = await loginApi(credentials);
      
      // Truyền nguyên cục data (chứa user và token) vào AuthProvider
      // AuthProvider sẽ tự động lo việc lưu vào localStorage và set State
      login(response.data);

      // Điều hướng người dùng dựa theo Quyền (Role)
      const role = response.data.user.role;
      console.log("User role sau khi đăng nhập:", role); // Debug xem role là gì
      if (role === "ADMIN") {
        navigate("/admin"); // Chỉnh lại route đích nếu cần
      } else if (role === "LIBRARIAN") {
        navigate("/librarian");
      } else {
        console.warn("Role không xác định, đưa về trang chủ mặc định");
        navigate("/"); // Đưa Reader về trang chủ/dashboard
      }
      
    } catch (err) {
      // Bắt lỗi từ server trả về (VD: Sai pass, không tìm thấy user)
      const errorMessage = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu!";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 2. HÀM XỬ LÝ ĐĂNG KÝ
  // ==========================================
  const handleRegister = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerApi(userData);
      
      // Đăng ký thành công thì đẩy về trang login kèm theo state thông báo (nếu muốn)
      navigate("/login", { 
        state: { message: "Tạo tài khoản thành công! Vui lòng đăng nhập." } 
      });
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại. Email này có thể đã được sử dụng.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 3. HÀM XỬ LÝ ĐĂNG XUẤT
  // ==========================================
  const handleLogout = () => {
    // Gọi hàm logout của AuthProvider (nó sẽ tự xóa localStorage và set user thành null)
    logout();
    
    // Đẩy người dùng ra cửa
    navigate("/login");
  };

  // Trả ra các biến và hàm để Component giao diện (LoginForm, RegisterForm) sử dụng
  return { 
    isLoading, 
    error, 
    handleLogin, 
    handleRegister, 
    handleLogout 
  };
}