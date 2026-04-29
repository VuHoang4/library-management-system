import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { loginApi, registerApi } from "../services/authApi"; 

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginApi(credentials);
      
      login(response.data);

      const role = response.data.user.role;
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "LIBRARIAN") {
        navigate("/librarian");
      } else {
        navigate("/"); 
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerApi(userData);
      
      navigate("/login", { 
        state: { message: "Tạo tài khoản thành công! Vui lòng đăng nhập." } 
      });
      
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại. Email này có thể đã được sử dụng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return { 
    isLoading, 
    error, 
    handleLogin, 
    handleRegister, 
    handleLogout 
  };
}