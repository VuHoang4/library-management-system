import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Tag } from "lucide-react";
import { bookApi } from "../../services/bookApi";
import { Button, Badge } from "../../../../components/ui";
import { Loading, Empty } from "../../../../components/common";
import HoldModal from "../../../../components/common/HoldModal"; // Chú ý import HoldModal từ common

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);

  const fetchBookDetail = useCallback(async (isRefetching = false) => {
    if (isRefetching) {
      setIsLoading(true);
    }
    
    try {
      const res = await bookApi.getBookById(id);
      setBook(res.data);
    } catch (err) {
      console.error("Lỗi lấy chi tiết sách:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBookDetail(false);
  }, [fetchBookDetail]);

  // HIỂN THỊ TRẠNG THÁI LOADING
  if (isLoading) {
    return <Loading text="Đang tải thông tin chi tiết sách..." />;
  }

  // HIỂN THỊ TRẠNG THÁI KHÔNG TÌM THẤY SÁCH
  if (!book) {
    return (
      <Empty 
        title="Không tìm thấy sách" 
        message="Cuốn sách bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ khỏi thư viện." 
        icon="🚫"
        action={
          <Button variant="secondary" onClick={() => navigate(-1)} className="mt-4">
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  // Xác định trạng thái của sách
  const isAvailable = book.available > 0;
  const isBorrowedByUser = book.userBorrowStatus === "BORROWED";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* NÚT QUAY LẠI */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Quay lại danh sách
      </button>

      {/* KHUNG THÔNG TIN CHÍNH */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* CỘT TRÁI: ẢNH BÌA SÁCH */}
        <div className="md:w-1/3 bg-slate-50 p-8 flex justify-center items-start border-r border-slate-100 relative">
          <img 
            src={book.imageUrl || "https://via.placeholder.com/400x600"} 
            alt={book.title}
            className="w-full max-w-[240px] rounded-lg shadow-md object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* CỘT PHẢI: CHI TIẾT SÁCH */}
        <div className="md:w-2/3 p-8 flex flex-col">
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="info" className="gap-1 px-3 py-1"><Tag size={14}/> {book.categoryName}</Badge>
            {isBorrowedByUser ? (
               <Badge variant="warning" className="px-3 py-1">Bạn đang mượn</Badge>
            ) : isAvailable ? (
               <Badge variant="success" className="px-3 py-1">Có sẵn: {book.available} cuốn</Badge>
            ) : (
               <Badge variant="danger" className="px-3 py-1">Hết sách</Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold text-slate-800 leading-tight tracking-tight">{book.title}</h1>
          <p className="text-lg text-slate-600 mt-2 font-medium">Tác giả: {book.authorName || book.author}</p>
          
          <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-slate-500 border-y border-slate-100 py-4">
             <p className="flex items-center gap-1.5"><BookOpen size={16} className="text-slate-400"/> ISBN: {book.isbn}</p>
             <p className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400"/> Cập nhật mới nhất</p>
          </div>

          {/* MÔ TẢ SÁCH (DESCRIPTION) */}
          <div className="mt-6 flex-1">
            <h3 className="font-semibold text-slate-800 mb-2">Tóm tắt nội dung:</h3>
            <p className="text-slate-600 leading-relaxed text-justify">
              {book.description || "Cuốn sách này hiện chưa có bài tóm tắt nội dung. Vui lòng quay lại sau hoặc liên hệ thủ thư để biết thêm chi tiết."}
            </p>
          </div>

          {/* KHU VỰC NÚT BẤM MƯỢN SÁCH */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
            <Button 
              variant={isAvailable ? "primary" : "outline"} 
              size="lg"
              className="w-full md:w-auto font-semibold"
              disabled={isBorrowedByUser}
              onClick={() => setIsHoldModalOpen(true)}
            >
              {isBorrowedByUser ? "Bạn đang mượn sách này" : isAvailable ? "Đăng ký mượn ngay" : "Đặt trước (Vào hàng chờ)"}
            </Button>
          </div>

        </div>
      </div>

      {/* NHÚNG MODAL ĐẶT TRƯỚC VÀO ĐÂY */}
      {isHoldModalOpen && (
        <HoldModal 
          book={book} 
          onClose={() => setIsHoldModalOpen(false)} 
          onSuccess={() => fetchBookDetail(true)} 
        />
      )}

    </div>
  );
}

export default BookDetailPage;