import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Input, Button } from "../../../../../components/ui";
import { useToast } from "../../../../../hooks/useToast";

export default function PosHeader({ onBack, onSearch }) {
  const [keyword, setKeyword] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error("Vui lòng nhập SĐT, Email hoặc ID để tìm kiếm!");
      return;
    }
    onSearch(keyword);
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          title="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-xl text-slate-800">Quầy Giao Dịch</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 w-[500px] items-start">
        <div className="flex-1">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Nhập SĐT, Email hoặc ID Độc giả..."
            icon={Search}
            autoFocus
          />
        </div>
        <Button 
          type="submit" 
          className="py-2.5 !bg-slate-800 hover:!bg-slate-900 text-white border-none shadow-sm"
        >
          Tìm Độc Giả
        </Button>
      </form>
    </header>
  );
}