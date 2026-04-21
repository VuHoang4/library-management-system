import { useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import BookStatusCard from "./BookStatusCard";
import { useBorrow } from "../../hooks/useBorrow";
import { Loading, Empty } from "../../../../components/common"; // Import Vũ khí

function BorrowedTab() {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("ALL");
  
  const { books, isLoading, renewingId, fetchBorrowedBooks, handleRenew } = useBorrow();

  useEffect(() => {
    if (user) fetchBorrowedBooks();
  }, [user, fetchBorrowedBooks]);

  const isOverdue = (book) =>
    book.status === "BORROWED" &&
    !book.returnDate &&
    new Date(book.endDate) < new Date();

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filter === "ALL") return true;
      if (filter === "BORROWED") return book.status === "BORROWED" && !isOverdue(book);
      if (filter === "OVERDUE") return isOverdue(book);
      if (filter === "RETURNED") return book.status === "RETURNED";
      return true;
    });
  }, [books, filter]);

  if (isLoading && books.length === 0) {
    return <div className="py-16"><Loading text="Đang đồng bộ danh sách mượn sách..." /></div>;
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* FILTER UI */}
      <div className="flex gap-2 mb-6 flex-wrap border-b border-slate-100 pb-4">
        {[
          { key: "ALL", label: "Tất cả" },
          { key: "BORROWED", label: "Đang mượn" },
          { key: "OVERDUE", label: "Quá hạn" },
          { key: "RETURNED", label: "Đã trả" },
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
            title="Danh sách trống" 
            message="Không tìm thấy cuốn sách nào khớp với trạng thái bạn đang chọn." 
            icon="📚" 
          />
        ) : (
          filteredBooks.map((book) => (
            <BookStatusCard 
              key={book.id} 
              book={book} 
              onRenew={() => handleRenew(book.id)} 
              isRenewing={renewingId === book.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BorrowedTab;