import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Users, X } from "lucide-react";
import { userApi } from "../../services/userApi";
import { useToast } from "../../../../hooks/useToast";
import { Loading, Empty } from "../../../../components/common";
import { Button, Input, Table, Badge } from "../../../../components/ui";

const CreateReaderModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleId: 3, 
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", email: "", phone: "", password: "", roleId: 3 });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast.warning("Vui lòng nhập đủ thông tin bắt buộc (*)");
        return;
      }

      setIsSubmitting(true);
      await userApi.createUser(formData);
      toast.success("Tạo Độc giả thành công 🎉");
      onSuccess(); 
      onClose();   
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tạo người dùng");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" /> Tạo Độc giả mới
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Họ và Tên *"
            placeholder="Nhập họ tên..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <Input
            type="email"
            label="Email *"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          
          <Input
            label="Số điện thoại"
            placeholder="09xx xxx xxx"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          
          <Input
            type="password"
            label="Mật khẩu *"
            placeholder="Nhập mật khẩu..."
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Xác nhận Tạo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

function ManageUsersPage() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useCallback(async (keyword) => {
    try {
      setIsLoading(true);
      const res = await userApi.getUsers({
        keyword: keyword,
        role: "READER",
      });

      const data = res.data?.content || res.data || [];
      setUsers(data);
    } catch (err) {
      console.error("Lỗi fetch user:", err);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, fetchUsers]);

  const tableHeaders = ["Độc giả", "Email", "SĐT", "Ngày tham gia", "Trạng thái"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-800 text-white rounded-xl hidden sm:block shadow-sm">
            <Users size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              Quản lý Độc giả
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tra cứu danh sách và cấp mới tài khoản cho Độc giả.
            </p>
          </div>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="gap-2 shadow-sm"
        >
          <Plus size={20} /> Thêm độc giả
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="max-w-md">
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20">
            <Loading text="Đang tải danh sách độc giả..." />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16">
            <Empty title="Không có dữ liệu" message="Không tìm thấy độc giả nào khớp với tìm kiếm." />
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <Table headers={tableHeaders}>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 border border-blue-200 shadow-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                      <p className="text-xs font-medium text-slate-400">#{user.id}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {user.phone || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    {user.active ? (
                      <Badge variant="success">Hoạt động</Badge>
                    ) : (
                      <Badge variant="danger">Bị khóa</Badge>
                    )}
                  </td>

                </tr>
              ))}
            </Table>
          </div>
        )}
      </div>

      <CreateReaderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchUsers(searchTerm)} 
      />

    </div>
  );
}

export default ManageUsersPage;