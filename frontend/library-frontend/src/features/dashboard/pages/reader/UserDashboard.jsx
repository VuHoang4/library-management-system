import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";
import { BookOpen, Clock, CreditCard } from "lucide-react"; // Import Icon trực tiếp tại đây

import BookCard from "../../../books/components/reader/BookCard";
import OverdueAlert from "../../../borrow/components/reader/OverdueAlert";
import DueSoonSection from "../../../borrow/components/reader/DueSoonSection";

import { Loading } from "../../../../components/common";
import { StatCard, Button } from "../../../../components/ui";

function UserDashboardPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const { books, summary, isLoading } = useDashboard(user?.id);

  // 1. ÁP DỤNG TRẠNG THÁI LOADING CHUẨN
  if (isLoading) {
    return (
      <div className="py-32">
        <Loading text="Đang đồng bộ bảng điều khiển..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* BANNER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl flex justify-between items-center shadow-lg relative overflow-hidden">
        {/* Lớp nền mờ trang trí */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Chào mừng trở lại, {user?.fullName || user?.name || "bạn"}!
          </h1>
          <p className="mt-2 text-blue-100 font-medium">
            {summary.dueSoonCount > 0 
              ? `Bạn có ${summary.dueSoonCount} cuốn sách sắp đến hạn trả. Đừng quên nhé!` 
              : "Bạn không có cuốn sách nào sắp đến hạn. Tuyệt vời!"}
          </p>
          
          {/* 2. SỬ DỤNG COMPONENT BUTTON */}
          <Button
            variant="secondary"
            className="mt-5 rounded-full px-6 font-semibold text-blue-600 shadow-sm"
            onClick={() => navigate("/my-books")}
          >
            Xem tủ sách của tôi
          </Button>
        </div>
        
        <div className="text-7xl opacity-20 hidden md:block relative z-10 select-none">📖</div>
      </div>

      {/* OVERDUE ALERT */}
      <OverdueAlert />

      {/* STAT CARDS - 3. CẬP NHẬT TRUYỀN PROPS CHO DUMB COMPONENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard 
          title="Sách đang mượn" 
          value={summary.borrowCount} 
          icon={<BookOpen size={24} />} 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600" 
        />
        <StatCard 
          title="Sách đặt trước" 
          value={summary.reservationCount} 
          icon={<Clock size={24} />} 
          iconBg="bg-amber-50" 
          iconColor="text-amber-600" 
        />
        <StatCard 
          title="Nợ phí thư viện" 
          value={`${summary.totalDebt.toLocaleString()} đ`} 
          icon={<CreditCard size={24} />} 
          iconBg="bg-red-50" 
          iconColor="text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* CỘT TRÁI (Rộng hơn): Sách nổi bật */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sách mới nổi bật</h2>
            <button 
              className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline transition-colors" 
              onClick={() => navigate("/books")}
            >
              Xem tất cả
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {books.slice(0, 6).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: Sắp đến hạn */}
        <div className="lg:col-span-1">
           <DueSoonSection />
        </div>
      </div>
      
    </div>
  );
}

export default UserDashboardPage;