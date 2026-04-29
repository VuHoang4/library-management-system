import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";
import { Badge } from "../../../../components/ui"; 

function BookCard({ book, onClick }) { 
  const getStatus = () => {
    if (book.userBorrowStatus === "BORROWED") return { text: "Đang mượn", variant: "info" };
    if (book.userReservationStatus === "HOLDING") return { text: "Đang giữ", variant: "info" };
    if (book.userReservationStatus === "PENDING") return { text: "Đang chờ", variant: "warning" };
    if (book.userReservationStatus === "EXPIRED") return { text: "Hết hạn giữ", variant: "default" };
    if (book.available > 0) return { text: "Có sẵn", variant: "success" };
    return { text: "Hết sách", variant: "danger" };
  };

  const status = getStatus();

  return (
    <Link
      id={`book-${book.id}`}
      to={`/books/${book.id}`}
      onClick={onClick}
      className={`block bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden border border-slate-100 ${
        book.userBorrowStatus === "BORROWED" ? "ring-2 ring-blue-500/30" : ""
      }`}
    >
      <div className="relative">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-56 object-cover" 
          />
        ) : (
          <div className="w-full h-56 bg-slate-100 flex items-center justify-center text-slate-400">
            <ImageIcon size={40} strokeWidth={1.5} />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Badge variant={status.variant} className="shadow-sm backdrop-blur-sm bg-white/95">
            {status.text}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-1.5">
        <p className="text-xs text-blue-600 font-semibold tracking-wide uppercase truncate">
          {book.categoryName || book.category}
        </p>
        <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug">
          {book.title}
        </h3>
        <p className="text-sm text-slate-500 truncate">
          {book.authorName || book.author}
        </p>
        <div className="pt-2 flex items-center justify-between border-t border-slate-50 mt-2">
          <p className="text-xs text-slate-500">
            Còn lại: <span className="font-bold text-slate-700">{book.available}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;