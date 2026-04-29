import { useState, useEffect } from "react";
import { Type, Users, Building2, Layers, Hash, Calendar, Image as ImageIcon, AlignLeft, BookOpen } from "lucide-react";
import { authorApi } from "../../../../services/authorApi"; 
import { publisherApi } from "../../../../services/publisherApi";
import { Modal, Input, Button } from "../../../../components/ui/index";

export function BookFormModal({ isOpen, onClose, onSave, initialData, categoriesList }) {
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

  const fetchAuthorsAndPublishers = async () => {
    try {
      const [authorRes, pubRes] = await Promise.all([
        authorApi.getAuthors(),
        publisherApi.getPublishers()
      ]);
      
      setAuthors(authorRes.data?.content || authorRes.data?.data || authorRes.data || []);
      setPublishers(pubRes.data?.content || pubRes.data?.data || pubRes.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAuthorsAndPublishers();

      if (initialData) {
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
      await onSave(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Cập nhật thông tin sách" : "Thêm sách mới"}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <Input
          label="Tên sách (*)"
          name="title"
          icon={BookOpen}
          placeholder="Nhập tên sách..."
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Tác giả (*)</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <div className="pl-3 text-slate-400">
                <Users size={18} />
              </div>
              <select 
                required 
                name="authorId" 
                value={formData.authorId} 
                onChange={handleChange} 
                className="flex-1 px-3 py-2.5 bg-transparent text-sm outline-none cursor-pointer"
              >
                <option value="">-- Chọn tác giả --</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Nhà xuất bản (*)</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <div className="pl-3 text-slate-400">
                <Building2 size={18} />
              </div>
              <select 
                required 
                name="publisherId" 
                value={formData.publisherId} 
                onChange={handleChange} 
                className="flex-1 px-3 py-2.5 bg-transparent text-sm outline-none cursor-pointer"
              >
                <option value="">-- Chọn nhà xuất bản --</option>
                {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Thể loại (*)</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <div className="pl-3 text-slate-400">
                <Layers size={18} />
              </div>
              <select 
                required 
                name="categoryId" 
                value={formData.categoryId} 
                onChange={handleChange} 
                className="flex-1 px-3 py-2.5 bg-transparent text-sm outline-none cursor-pointer"
              >
                <option value="">-- Chọn thể loại --</option>
                {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <Input
            label="Số lượng kho (*)"
            type="number"
            min="0"
            name="quantity"
            icon={Hash}
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Mã ISBN"
            name="isbn"
            icon={Type}
            placeholder="Ví dụ: 978-3-16-148410-0"
            value={formData.isbn}
            onChange={handleChange}
          />
          <Input
            label="Năm xuất bản"
            type="number"
            name="publishedYear"
            icon={Calendar}
            value={formData.publishedYear}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Link ảnh bìa (URL)</label>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <div className="pl-3 text-slate-400">
                <ImageIcon size={18} />
              </div>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                className="flex-1 px-3 py-2.5 bg-transparent text-sm outline-none"
              />
            </div>
            <div className="w-11 h-11 shrink-0 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">Trống</span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Mô tả tóm tắt</label>
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl transition-all focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <div className="pl-3 pt-3 text-slate-400">
              <AlignLeft size={18} />
            </div>
            <textarea
              name="description"
              rows="4"
              placeholder="Nhập tóm tắt nội dung sách..."
              value={formData.description}
              onChange={handleChange}
              className="flex-1 px-3 py-2.5 bg-transparent text-sm outline-none resize-none custom-scrollbar"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {initialData ? "Lưu thay đổi" : "Lưu sách"}
          </Button>
        </div>

      </form>
    </Modal>
  );
}