import { Search, X } from "lucide-react";

export function BookFilterBar({ 
  searchTerm, 
  onSearchChange, 
  category, 
  onCategoryChange, 
  categoriesList = [] 
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </div>
        
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên sách hoặc tác giả..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium"
        />
        
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-200 rounded-full transition-colors"
            title="Xóa từ khóa"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <select 
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full md:w-auto border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-slate-100 focus:bg-white cursor-pointer min-w-[180px] text-sm font-medium transition-all"
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