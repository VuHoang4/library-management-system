import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

export default function PosHeader({ onBack, onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("Vui lòng nhập SĐT hoặc ID để tìm kiếm!");
      return;
    }
    onSearch(keyword);
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-xl text-slate-800">Quầy Giao Dịch</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 w-[500px]">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-lg text-sm transition-all outline-none"
            placeholder="Nhập SĐT, Email hoặc ID Độc giả..."
            autoFocus
          />
        </div>
        <button type="submit" className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
          Tìm Độc Giả
        </button>
      </form>
    </header>
  );
}