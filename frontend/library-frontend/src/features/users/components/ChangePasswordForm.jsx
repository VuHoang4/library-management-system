import { useState } from "react";
import { Input, Button } from "../../../components/ui";

function ChangePasswordForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
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
    <form onSubmit={handleSubmit} className="space-y-5 mt-4 animate-in fade-in duration-300">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input 
          label="Mật khẩu hiện tại" 
          type={showPassword ? "text" : "password"} 
          name="currentPassword" 
          value={form.currentPassword} 
          onChange={handleChange} 
          required 
        />
        <Input 
          label="Mật khẩu mới" 
          type={showPassword ? "text" : "password"} 
          name="newPassword" 
          value={form.newPassword} 
          onChange={handleChange} 
          required 
        />
        <Input 
          label="Xác nhận mật khẩu mới" 
          type={showPassword ? "text" : "password"} 
          name="confirmPassword" 
          value={form.confirmPassword} 
          onChange={handleChange} 
          error={error && form.newPassword !== form.confirmPassword ? "Không khớp" : ""}
          required 
        />
      </div>

      <div className="flex items-center gap-2 px-1 pt-1">
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
        />
        <label 
          htmlFor="showPassword" 
          className="text-sm font-medium text-slate-600 cursor-pointer select-none"
        >
          Hiển thị mật khẩu
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="danger" isLoading={isLoading} className="w-full sm:w-auto shadow-sm font-bold">
          Đổi mật khẩu
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;