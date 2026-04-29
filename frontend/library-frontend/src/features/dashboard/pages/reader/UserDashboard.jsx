import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";
import { BookOpen, Clock, CreditCard, Sparkles, BookHeart, Library } from "lucide-react"; 

import BookCard from "../../../books/components/reader/BookCard";
import OverdueAlert from "../../../borrow/components/reader/OverdueAlert";
import DueSoonSection from "../../../borrow/components/reader/DueSoonSection";

import { Loading, Empty } from "../../../../components/common";
import { StatCard, Button } from "../../../../components/ui";

function UserDashboardPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const { books, summary, isLoading } = useDashboard(user?.id);

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center">
        <Loading text="Đang đồng bộ bảng điều khiển..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 sm:p-10 rounded-3xl flex justify-between items-center shadow-lg shadow-blue-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Chào mừng trở lại, {user?.fullName || user?.name || "Độc giả"}!
          </h1>
          <p className="mt-3 text-blue-100 font-medium text-base md:text-lg">
            {summary.dueSoonCount > 0 
              ? `Bạn có ${summary.dueSoonCount} cuốn sách sắp đến hạn trả. Đừng quên mang sách đến thư viện nhé!` 
              : "Bạn không có cuốn sách nào sắp đến hạn. Khám phá thêm những cuốn sách mới ngay hôm nay!"}
          </p>
          
          <Button
            variant="secondary"
            className="mt-6 rounded-xl px-6 py-2.5 font-bold text-blue-700 shadow-sm hover:shadow-md transition-all active:scale-95 border-none"
            onClick={() => navigate("/my-books")}
          >
            Xem tủ sách của tôi
          </Button>
        </div>
        
        <div className="opacity-20 hidden lg:block relative z-10 select-none transform -rotate-12 hover:rotate-0 transition-transform duration-500 text-white">
          <Library size={120} strokeWidth={1} />
        </div>
      </div>

      {/* OVERDUE ALERT */}
      <OverdueAlert />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard 
          title="Sách đang mượn" 
          value={summary.borrowCount} 
          icon={<BookOpen size={24} strokeWidth={1.5} />} 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600" 
        />
        <StatCard 
          title="Sách đặt trước" 
          value={summary.reservationCount} 
          icon={<Clock size={24} strokeWidth={1.5} />} 
          iconBg="bg-amber-50" 
          iconColor="text-amber-600" 
        />
        <StatCard 
          title="Nợ phí thư viện" 
          value={`${summary.totalDebt.toLocaleString("vi-VN")} đ`} 
          icon={<CreditCard size={24} strokeWidth={1.5} />} 
          iconBg="bg-rose-50" 
          iconColor="text-rose-600" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
        {/* CỘT TRÁI (Rộng hơn): Sách nổi bật */}
        <div className="xl:col-span-2 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Sparkles size={22} className="text-amber-500" />
              Sách mới nổi bật
            </h2>
            <button 
              className="text-blue-600 text-sm font-bold hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors" 
              onClick={() => navigate("/books")}
            >
              Xem tất cả
            </button>
          </div>
          
          {books.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Empty 
                title="Chưa có sách mới" 
                message="Hệ thống đang cập nhật các đầu sách nổi bật. Vui lòng quay lại sau!" 
                icon={<BookHeart size={48} strokeWidth={1.5} />} 
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5">
              {books.slice(0, 6).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: Sắp đến hạn */}
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <DueSoonSection />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default UserDashboardPage;