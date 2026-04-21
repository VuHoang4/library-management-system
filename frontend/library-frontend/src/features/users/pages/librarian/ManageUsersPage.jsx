import { useState, useEffect } from "react";
import { Search, Plus, Users } from "lucide-react";
import { userApi } from "../../services/userApi";
import { toast } from "react-toastify";

function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleId: 3 // mặc định READER
  });

  // ================= FETCH USERS =================
  const fetchUsers = async (keyword) => {
    try {
      setIsLoading(true);

      const res = await userApi.getReaders(keyword);

      const data = res.data?.content || res.data || [];
      setUsers(data);

    } catch (err) {
      console.error("Lỗi fetch user:", err);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // ================= OPEN MODAL =================
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      roleId: 3
    });
    setIsModalOpen(true);
  };

  // ================= CREATE USER =================
  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast.warning("Vui lòng nhập đủ thông tin bắt buộc");
        return;
      }

      await userApi.createUser(formData);

      toast.success("Tạo độc giả thành công 🎉");

      setIsModalOpen(false);
      fetchUsers(searchTerm);

    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tạo user");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl hidden sm:block">
            <Users size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Quản lý Độc giả
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tạo, chỉnh sửa và quản lý tài khoản người dùng.
            </p>
          </div>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={20} />
          Thêm độc giả
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4">Độc giả</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">SĐT</th>
                <th className="p-4">Ngày tham gia</th>
                <th className="p-4">Trạng thái</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">
                    Đang tải...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">

                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">#{user.id}</p>
                      </div>
                    </td>

                    <td className="p-4 text-sm">{user.email}</td>

                    <td className="p-4 text-center text-sm">
                      {user.phone || "-"}
                    </td>

                    <td className="p-4 text-sm">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </td>

                    <td className="p-4">
                      {user.active ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                          Bị khóa
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] space-y-4 shadow-xl">
            
            <h2 className="text-lg font-bold">Tạo độc giả</h2>

            <input
              placeholder="Tên"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border p-2 rounded-lg"
            />

            <input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border p-2 rounded-lg"
            />

            <input
              placeholder="SĐT"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full border p-2 rounded-lg"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-200 rounded-lg"
              >
                Hủy
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Tạo
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsersPage;