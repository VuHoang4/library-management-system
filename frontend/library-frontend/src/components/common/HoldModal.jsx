import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // Sửa lại đường dẫn nếu cần
import { useToast } from "../../features/toast/useToast"; // Sửa lại đường dẫn nếu cần
import { reservationApi } from "../../features/reservation/services/reservationApi"; // Import API

function HoldModal({ book, onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const isAvailable = book.available > 0;

  const handleHold = async () => {
    try {
      setLoading(true);

      const res = await reservationApi.createReservation({
        bookId: book.id,
        userId: user.id,
      });

      toast.success(res.data.message || "Đăng ký thành công!");

      // Gọi callback để trang cha (BookList hoặc BookDetail) biết mà reload data
      if (onSuccess) onSuccess(); 
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi server! Không thể thực hiện yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200 p-4">
      {/* MODAL */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* LEFT IMAGE */}
        <div className="w-full md:w-5/12 h-[300px] md:h-[450px] bg-slate-100 relative">
          <img 
            src={book.imageUrl || "https://via.placeholder.com/400x600"} 
            alt={book.title}
            className="w-full h-full object-cover" 
          />
          {/* Overlay gradient cho đẹp */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="p-8 flex flex-col flex-1 bg-white">
          
          {/* BADGE TRẠNG THÁI */}
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider w-fit shadow-sm border ${
              isAvailable
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-orange-50 text-orange-600 border-orange-200"
            }`}
          >
            {isAvailable ? "Sách có sẵn" : "Hết sách trong kho"}
          </span>

          {/* TITLE & AUTHOR */}
          <h2 className="text-2xl font-extrabold text-slate-800 mt-4 leading-snug line-clamp-2">
            {book.title}
          </h2>
          <p className="text-base text-slate-500 font-medium mt-1">
            {book.authorName || book.author}
          </p>

          {/* THÔNG TIN CHI TIẾT */}
          <div className="mt-6 space-y-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã ISBN:</span>
              <span className="font-semibold text-slate-800">{book.isbn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thể loại:</span>
              <span className="font-semibold text-slate-800">{book.categoryName}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
              <span className="text-slate-500">Số lượng hiện tại:</span>
              <span className="font-bold text-blue-600">{book.available} cuốn</span>
            </div>
          </div>

          {/* MESSAGE BOX */}
          <div className={`mt-6 p-4 rounded-xl border text-sm font-medium ${
            isAvailable 
              ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
              : "bg-orange-50 border-orange-100 text-orange-700"
          }`}>
            {isAvailable 
              ? "Tuyệt vời! Bạn có thể đặt trước và đến thư viện nhận sách trong vòng 48 giờ." 
              : "Rất tiếc sách đã hết. Nhấn đặt trước để được đưa vào danh sách chờ."
            }
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-auto flex gap-3 pt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleHold}
              disabled={loading}
              className={`flex-1 py-3 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 ${
                isAvailable
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              } ${loading ? "opacity-70 cursor-wait" : ""}`}
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              {loading
                ? "Đang xử lý..."
                : isAvailable
                  ? "Xác nhận Đặt sách"
                  : "Vào danh sách chờ"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default HoldModal;