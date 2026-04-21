import { Search, X } from "lucide-react"; // 🌟 Import thêm icon X

export function BookFilterBar({ 
  searchTerm, 
  onSearchChange, 
  category, 
  onCategoryChange, 
  categoriesList = [] 
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
      
      {/* Ô Tìm kiếm */}
      <div className="flex-1 relative">
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên sách hoặc tác giả..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          // 🌟 Tăng pr-10 (padding-right) để chữ không bị đè lên nút X
          className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        {/* Icon Kính lúp (Bên trái) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </div>

        {/* 🌟 Nút Xóa nhanh (Bên phải) - Chỉ render khi searchTerm có độ dài > 0 */}
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-full transition-colors"
            title="Xóa từ khóa"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Dropdown Thể loại Động */}
      <select 
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 cursor-pointer min-w-[160px]"
      >
        <option value="all">Tất cả thể loại</option>
        {categoriesList.map((cat) => (
          <option key={cat._id || cat.id} value={cat._id || cat.id || cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      
    </div>
  );
}