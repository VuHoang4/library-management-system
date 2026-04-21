import { Badge, Button } from "../../../../components/ui";

export default function BookStatusCard({
  book,
  onRenew,
  isRenewing,
  onCancelReservation,
  isCanceling,
}) {
  // 1. LẤY TYPE TỪ MAPPER CỦA BẠN CHUYỀN VÀO
  const isBorrow = book.type === "borrow";
  const isReservation = book.type === "reservation";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không có";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  // 2. TÍNH TOÁN QUÁ HẠN (Rất nhàn vì Mapper đã gom về chữ endDate)
  const isOverdue = (() => {
    if (!isBorrow || book.status === "RETURNED" || !book.endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(book.endDate);
    due.setHours(0, 0, 0, 0);
    return today > due;
  })();

  // 3. MAP TRẠNG THÁI
  const getStatus = () => {
    if (isBorrow) {
      if (book.status === "RETURNED")
        return { text: "Đã trả", variant: "success" };
      if (isOverdue) return { text: "Quá hạn", variant: "danger" };
      return { text: "Đang mượn", variant: "info" };
    }

    if (isReservation) {
      if (book.status === "HOLDING")
        return { text: "Đang giữ", variant: "info" };
      if (book.status === "PENDING" || book.status === "PRE_ORDER")
        return { text: "Đang chờ", variant: "warning" };
      if (book.status === "COMPLETED")
        return { text: "Hoàn thành", variant: "success" };
      if (book.status === "EXPIRED" || book.status === "CANCELLED")
        return { text: "Đã huỷ/Hết hạn", variant: "default" };
    }

    return { text: "Đang xử lý", variant: "default" };
  };

  const status = getStatus();

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-5 hover:shadow-md transition">
      {/* IMAGE */}
      <div className="relative flex-shrink-0 mx-auto sm:mx-0">
        <img
          src={book.imageUrl || "https://via.placeholder.com/150"}
          alt={book.title}
          className="w-24 h-32 sm:w-20 sm:h-28 object-cover rounded-lg shadow-sm border border-slate-100"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          {/* TITLE - Chữ book.title đã được Mapper đồng nhất */}
          <h3 className="text-base font-bold text-slate-800 line-clamp-2">
            {book.title}
          </h3>

          <Badge variant={status.variant} className="whitespace-nowrap w-fit">
            {status.text}
          </Badge>
        </div>

        {/* INFO */}
        <div className="mt-3 text-sm text-slate-500 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100 w-full sm:w-fit">
          {book.startDate && (
            <p className="flex items-center gap-2">
              <span className="w-[85px]">
                {isReservation ? "Ngày đặt:" : "Ngày mượn:"}
              </span>
              <span className="font-semibold text-slate-700">
                {formatDate(book.startDate)}
              </span>
            </p>
          )}

          {book.endDate && (
            <p
              className={`flex items-center gap-2 ${isOverdue ? "text-rose-600 font-bold" : ""}`}
            >
              <span className="w-[85px]">
                {isReservation ? "Hết hạn:" : "Hạn trả:"}
              </span>
              <span
                className={!isOverdue ? "font-semibold text-slate-700" : ""}
              >
                {formatDate(book.endDate)}
              </span>
            </p>
          )}

          {/* ✅ NEW: returnDate */}
          {book.returnDate && (
            <p className="flex items-center gap-2 text-emerald-600">
              <span className="w-[85px]">Ngày trả:</span>
              <span className="font-semibold">
                {formatDate(book.returnDate)}
              </span>
            </p>
          )}

          {isBorrow && book.renewCount > 0 && (
            <p className="flex items-center gap-2 text-blue-600">
              <span className="w-[85px]">Gia hạn:</span>
              <span className="font-semibold">{book.renewCount} lần</span>
            </p>
          )}
        </div>
        {/* ACTION BUTTONS */}
        <div className="mt-4 pt-3 flex flex-wrap justify-end gap-3 border-t border-slate-100">
          {isBorrow && book.status === "BORROWED" && !isOverdue && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRenew(book.id)}
              isLoading={isRenewing}
            >
              Gia hạn sách
            </Button>
          )}

          {isBorrow && isOverdue && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => console.log("Thanh toán phạt", book.id)}
            >
              Thanh toán phạt
            </Button>
          )}

          {/* Dùng status COMPLETED vì nãy BE của bạn trả về COMPLETED */}
          {isReservation &&
            (book.status === "PENDING" || book.status === "HOLDING") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelReservation(book.id)}
                isLoading={isCanceling}
              >
                Huỷ đặt trước
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
