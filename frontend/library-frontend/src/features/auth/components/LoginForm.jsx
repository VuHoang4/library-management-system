import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Input, Button } from "../../../components/ui"; 

function LoginForm({ onSubmit, isLoading, error }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 text-center animate-in fade-in zoom-in-95">
          {error}
        </div>
      )}

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

      <div>
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
        <p className="text-right text-sm text-blue-600 mt-1 cursor-pointer hover:underline font-medium">
          Quên mật khẩu?
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full py-2.5 mt-2 text-base rounded-xl"
        isLoading={isLoading}
      >
        Đăng nhập
      </Button>

    </form>
  );
}

export default LoginForm;