import { useState, useMemo } from "react";
import { Input, Button } from "../../../components/ui";

function ProfileForm({ initialData, onSubmit, isLoading }) {

  // ✅ tạo default form từ initialData
  const defaultForm = useMemo(() => ({
    fullName: initialData?.fullName || initialData?.username || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || ""
  }), [initialData]);

  // ✅ state chỉ init 1 lần
  const [form, setForm] = useState(defaultForm);

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
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
          className="bg-slate-50 text-slate-500 cursor-not-allowed"
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

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Lưu thay đổi
        </Button>
      </div>

    </form>
  );
}

export default ProfileForm;