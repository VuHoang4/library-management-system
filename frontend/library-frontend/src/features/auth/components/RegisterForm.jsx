import { User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Input, Button } from "../../../components/ui";

function RegisterForm({ onSubmit, isLoading, apiError }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (localError) setLocalError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError("Mật khẩu xác nhận không khớp!");
      return;
    }
    onSubmit({ fullName: form.fullName, email: form.email, password: form.password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 text-center animate-in fade-in zoom-in-95">
          {apiError}
        </div>
      )}

      <Input
        label="Họ và tên"
        name="fullName"
        icon={User}
        placeholder="Nguyễn Văn A"
        value={form.fullName}
        onChange={handleChange}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        icon={Mail}
        placeholder="example@email.com"
        value={form.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Mật khẩu"
        type="password"
        name="password"
        icon={Lock}
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
        required
      />

      <Input
        label="Xác nhận mật khẩu"
        type="password"
        name="confirmPassword"
        icon={Lock}
        placeholder="••••••••"
        value={form.confirmPassword}
        onChange={handleChange}
        error={localError}
        required
      />

      <Button 
        type="submit" 
        className="w-full py-2.5 mt-2 text-base rounded-xl"
        isLoading={isLoading}
      >
        Tạo tài khoản
      </Button>
    </form>
  );
}

export default RegisterForm;