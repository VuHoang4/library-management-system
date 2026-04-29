import { useEffect, useState, useContext, useMemo } from "react";
import { Bookmark } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext";
import BookStatusCard from "./BookStatusCard";
import { useReservation } from "../../../reservation/hooks/useReservation";
import { Loading, Empty } from "../../../../components/common";

function ReservationTab() {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("ALL");

  const { books, isLoading, fetchReservations } = useReservation();

  useEffect(() => {
    if (user) fetchReservations();
  }, [user, fetchReservations]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filter === "ALL") return true;
      if (filter === "HOLDING") return book.status === "HOLDING";
      if (filter === "PENDING") return book.status === "PENDING";
      if (filter === "COMPLETED") return book.status === "COMPLETED";
      if (filter === "EXPIRED") return book.status === "EXPIRED";
      return true;
    });
  }, [books, filter]);

  if (isLoading && books.length === 0) {
    return (
      <div className="py-16">
        <Loading text="Đang đồng bộ dữ liệu đặt trước..." />
      </div>
    );
  }

  const FILTER_LABELS = {
    ALL: "Tất cả",
    HOLDING: "Đang giữ",
    PENDING: "Đang chờ",
    COMPLETED: "Hoàn thành",
    EXPIRED: "Hết hạn"
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex gap-2 mb-6 overflow-x-auto custom-scrollbar border-b border-slate-100 pb-4">
        {Object.entries(FILTER_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-semibold transition-all ${
              filter === key
                ? "bg-slate-800 text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBooks.length === 0 ? (
          <div className="py-10">
            <Empty 
              title="Không có yêu cầu đặt trước" 
              message={`Bạn hiện không có cuốn sách nào ở trạng thái "${FILTER_LABELS[filter]}".`} 
              icon={<Bookmark size={48} strokeWidth={1.5} />} 
            />
          </div>
        ) : (
          filteredBooks.map((book) => (
            <BookStatusCard key={book.id} book={book} />
          ))
        )}
      </div>
    </div>
  );
}

export default ReservationTab;