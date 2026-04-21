import { useState } from "react";
import { Input, Button } from "../../../components/ui";

function ChangePasswordForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Xóa lỗi khi gõ lại
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    
    onSubmit({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <Input 
        label="Mật khẩu hiện tại" 
        type="password" 
        name="currentPassword" 
        value={form.currentPassword} 
        onChange={handleChange} 
        required 
      />
      <Input 
        label="Mật khẩu mới" 
        type="password" 
        name="newPassword" 
        value={form.newPassword} 
        onChange={handleChange} 
        required 
      />
      <Input 
        label="Xác nhận mật khẩu mới" 
        type="password" 
        name="confirmPassword" 
        value={form.confirmPassword} 
        onChange={handleChange} 
        error={error && form.newPassword !== form.confirmPassword ? "Không khớp" : ""}
        required 
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="danger" isLoading={isLoading}>
          Đổi mật khẩu
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;