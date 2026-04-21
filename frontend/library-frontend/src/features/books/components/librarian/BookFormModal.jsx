import { useState, useEffect } from "react";
// Đảm bảo import đúng đường dẫn API của bạn nhé
import { authorApi } from "../../../../services/authorApi"; 
import { publisherApi } from "../../../../services/publisherApi";

export function BookFormModal({ isOpen, onClose, onSave, initialData, categoriesList }) {
  // State chứa dữ liệu form (Khớp với BookRequest DTO ở Backend)
  const [formData, setFormData] = useState({
    title: "", 
    isbn: "", 
    quantity: 0, 
    imageUrl: "", 
    description: "",
    publishedYear: new Date().getFullYear(),
    authorId: "", 
    categoryId: "", 
    publisherId: ""
  });

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌟 Hàm gọi API lấy Tác giả và NXB cùng lúc
  const fetchAuthorsAndPublishers = async () => {
    try {
      const [authorRes, pubRes] = await Promise.all([
        authorApi.getAuthors(),       // Gọi API lấy tác giả
        publisherApi.getPublishers()  // Gọi API lấy nhà xuất bản
      ]);
      
      // Xử lý lấy data (phòng hờ BE trả về Page hoặc List)
      setAuthors(authorRes.data?.content || authorRes.data?.data || authorRes.data || []);
      setPublishers(pubRes.data?.content || pubRes.data?.data || pubRes.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách Tác giả / NXB:", error);
    }
  };

  console.log("initialData:", initialData);
  // Khi Modal mở lên -> Đổ dữ liệu vào Form
  useEffect(() => {
    if (isOpen) {
      // 1. Tải danh sách dropdown
      fetchAuthorsAndPublishers();

      // 2. Set dữ liệu form
      if (initialData) {
        // CHẾ ĐỘ SỬA: Đổ data cũ vào
        setFormData({
          title: initialData.title || "",
          isbn: initialData.isbn || "",
          quantity: initialData.quantity || 0,
          imageUrl: initialData.imageUrl || "",
          description: initialData.description || "",
          publishedYear: initialData.publishedYear || "",
          authorId: initialData.authorId || "",
          categoryId: initialData.categoryId || "",
          publisherId: initialData.publisherId || ""
        });
      } else {
        // CHẾ ĐỘ THÊM: Trắng form
        setFormData({
          title: "", isbn: "", quantity: 0, imageUrl: "", description: "",
          publishedYear: new Date().getFullYear(),
          authorId: "", categoryId: "", publisherId: ""
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData); // Gọi hàm handleSaveBook truyền từ Page vào
    } catch (error) {
      // Lỗi thì giữ modal mở để user sửa
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center p-6 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? "Cập nhật thông tin sách" : "Thêm sách mới"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 text-3xl leading-none">&times;</button>
        </div>

        {/* BODY MODAL (Cuộn được nếu form dài) */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="book-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Hàng 1: Tên sách (Full width) */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Tên sách <span className="text-red-500">*</span></label>
              <input required name="title" value={formData.title} onChange={handleChange} 
                     placeholder="Nhập tên sách..."
                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>

            {/* Hàng 2: Tác giả & Nhà xuất bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Tác giả <span className="text-red-500">*</span></label>
                <select required name="authorId" value={formData.authorId} onChange={handleChange} 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Nhà xuất bản <span className="text-red-500">*</span></label>
                <select required name="publisherId" value={formData.publisherId} onChange={handleChange} 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">-- Chọn nhà xuất bản --</option>
                  {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* Hàng 3: Thể loại & Số lượng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Thể loại <span className="text-red-500">*</span></label>
                <select required name="categoryId" value={formData.categoryId} onChange={handleChange} 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">-- Chọn thể loại --</option>
                  {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Số lượng kho <span className="text-red-500">*</span></label>
                <input required type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} 
                       className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Hàng 4: ISBN & Năm xuất bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Mã ISBN</label>
                <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="Ví dụ: 978-3-16-148410-0"
                       className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Năm xuất bản</label>
                <input type="number" name="publishedYear" value={formData.publishedYear} onChange={handleChange} 
                       className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Hàng 5: Link ảnh bìa (Full width) */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Link ảnh bìa (URL)</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg"
                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Hàng 6: Mô tả sách (Textarea) */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Mô tả tóm tắt</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                        placeholder="Nhập tóm tắt nội dung sách..."
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
            </div>

          </form>
        </div>

        {/* FOOTER MODAL (Cố định ở dưới cùng) */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button type="button" onClick={onClose} 
                  className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Hủy bỏ
          </button>
          {/* Nút submit liên kết với form qua thuộc tính form="book-form" */}
          <button type="submit" form="book-form" disabled={isSubmitting} 
                  className="px-5 py-2.5 font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            {isSubmitting ? "Đang lưu..." : "Lưu sách"}
          </button>
        </div>
        
      </div>
    </div>
  );
}