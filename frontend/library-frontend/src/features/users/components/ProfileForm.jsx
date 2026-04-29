import { useState } from "react";
import { Input, Button } from "../../../components/ui";

function ProfileForm({ initialData, onSubmit, isLoading }) {
  const [prevEmail, setPrevEmail] = useState(initialData?.email);
  const [form, setForm] = useState({
    fullName: initialData?.fullName || initialData?.username || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || ""
  });

  if (initialData?.email !== prevEmail) {
    setPrevEmail(initialData?.email);
    setForm({
      fullName: initialData?.fullName || initialData?.username || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || ""
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input 
          label="Họ và tên"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <Input 
          label="Email (Không thể thay đổi)"
          name="email"
          value={form.email}
          disabled
          className="bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
        />

        <Input 
          label="Số điện thoại"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Ví dụ: 0912345678"
        />

        <Input 
          label="Địa chỉ"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Thành phố Hồ Chí Minh"
        />
      </div>

      <div className="flex justify-end pt-2 border-t border-slate-100">
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isLoading}
          className="w-full sm:w-auto px-8 font-bold shadow-sm"
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}

export default ProfileForm;