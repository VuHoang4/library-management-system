import { useEffect, useState, useContext, useMemo } from "react";
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

  // 1. CẬP NHẬT LOGIC LỌC
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filter === "ALL") return true;
      if (filter === "HOLDING") return book.status === "HOLDING";
      if (filter === "PENDING") return book.status === "PENDING";
      if (filter === "COMPLETED") return book.status === "COMPLETED"; // 🌟 THÊM DÒNG NÀY
      if (filter === "EXPIRED") return book.status === "EXPIRED";
      return true;
    });
  }, [books, filter]);

  if (isLoading && books.length === 0) {
    return <div className="py-16"><Loading text="Đang đồng bộ dữ liệu đặt trước..." /></div>;
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* FILTER UI */}
      <div className="flex gap-2 mb-6 flex-wrap border-b border-slate-100 pb-4">
        {/* 2. CẬP NHẬT DANH SÁCH NÚT BẤM */}
        {[
          { key: "ALL", label: "Tất cả" },
          { key: "HOLDING", label: "Đang giữ" },
          { key: "PENDING", label: "Đang chờ" },
          { key: "COMPLETED", label: "Hoàn thành" }, // 🌟 THÊM NÚT NÀY
          { key: "EXPIRED", label: "Hết hạn" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`text-sm px-4 py-2 rounded-full font-semibold transition-all ${
              filter === item.key
                ? "bg-slate-800 text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredBooks.length === 0 ? (
          <Empty 
            title="Không có yêu cầu đặt trước" 
            message={`Bạn hiện không có cuốn sách nào ở trạng thái "${
              { ALL: "Tất cả", HOLDING: "Đang giữ", PENDING: "Đang chờ", COMPLETED: "Hoàn thành", EXPIRED: "Hết hạn" }[filter]
            }".`} // 🌟 Làm cho câu thông báo xịn hơn 1 chút
            icon="🔖" 
          />
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