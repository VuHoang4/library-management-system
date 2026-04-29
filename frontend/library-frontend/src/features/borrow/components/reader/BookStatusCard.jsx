import { Badge, Button } from "../../../../components/ui";
import { Image as ImageIcon, Calendar, Clock, AlertCircle, CheckCircle, RefreshCcw, XCircle } from "lucide-react";

export default function BookStatusCard({
  book,
  onRenew,
  isRenewing,
  onCancelReservation,
  isCanceling,
}) {
  const isBorrow = book.type === "borrow";
  const isReservation = book.type === "reservation";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không có";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const isOverdue = (() => {
    if (!isBorrow || book.status === "RETURNED" || !book.endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(book.endDate);
    due.setHours(0, 0, 0, 0);
    return today > due;
  })();

  const getStatus = () => {
    if (isBorrow) {
      if (book.status === "RETURNED") return { text: "Đã trả", variant: "success" };
      if (isOverdue) return { text: "Quá hạn", variant: "danger" };
      return { text: "Đang mượn", variant: "info" };
    }

    if (isReservation) {
      if (book.status === "HOLDING") return { text: "Đang giữ", variant: "info" };
      if (book.status === "PENDING" || book.status === "PRE_ORDER") return { text: "Đang chờ", variant: "warning" };
      if (book.status === "COMPLETED") return { text: "Hoàn thành", variant: "success" };
      if (book.status === "EXPIRED" || book.status === "CANCELLED") return { text: "Đã huỷ/Hết hạn", variant: "default" };
    }

    return { text: "Đang xử lý", variant: "default" };
  };

  const status = getStatus();

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
      
      <div className="relative flex-shrink-0 mx-auto sm:mx-0">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-24 h-32 sm:w-20 sm:h-28 object-cover rounded-xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-24 h-32 sm:w-20 sm:h-28 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-300">
            <ImageIcon size={32} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-snug">
            {book.title}
          </h3>
          <Badge variant={status.variant} className="whitespace-nowrap shrink-0 shadow-sm">
            {status.text}
          </Badge>
        </div>

        <div className="mt-4 text-sm text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          {book.startDate && (
            <p className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <span className="w-20 text-slate-500">{isReservation ? "Ngày đặt:" : "Ngày mượn:"}</span>
              <span className="font-semibold text-slate-700">{formatDate(book.startDate)}</span>
            </p>
          )}

          {book.endDate && (
            <p className={`flex items-center gap-2 ${isOverdue ? "text-rose-600 font-bold" : ""}`}>
              {isOverdue ? (
                <AlertCircle size={16} className="shrink-0" />
              ) : (
                <Clock size={16} className="text-slate-400 shrink-0" />
              )}
              <span className="w-20 text-slate-500">{isReservation ? "Hết hạn:" : "Hạn trả:"}</span>
              <span className={!isOverdue ? "font-semibold text-slate-700" : ""}>
                {formatDate(book.endDate)}
              </span>
            </p>
          )}

          {book.returnDate && (
            <p className="flex items-center gap-2 text-emerald-600">
              <CheckCircle size={16} className="shrink-0" />
              <span className="w-20">Ngày trả:</span>
              <span className="font-semibold">{formatDate(book.returnDate)}</span>
            </p>
          )}

          {isBorrow && book.renewCount > 0 && (
            <p className="flex items-center gap-2 text-blue-600">
              <RefreshCcw size={16} className="shrink-0" />
              <span className="w-20">Gia hạn:</span>
              <span className="font-semibold">{book.renewCount} lần</span>
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          {isBorrow && book.status === "BORROWED" && !isOverdue && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRenew(book.id)}
              isLoading={isRenewing}
              className="gap-2 px-4 shadow-sm"
            >
              <RefreshCcw size={16} />
              Gia hạn sách
            </Button>
          )}

          {isBorrow && isOverdue && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => console.log("Thanh toán phạt", book.id)}
              className="gap-2 px-4 shadow-sm"
            >
              <AlertCircle size={16} />
              Thanh toán phạt
            </Button>
          )}

          {isReservation && (book.status === "PENDING" || book.status === "HOLDING") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelReservation(book.id)}
              isLoading={isCanceling}
              className="gap-2 px-4 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
            >
              <XCircle size={16} />
              Huỷ đặt trước
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}