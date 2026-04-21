import { useEffect, useState } from "react";
import BookStatusCard from "./BookStatusCard";
import { userApi } from "../../../users/services/userApi";

function DueSoonSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getDueSoonBooks()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Lỗi lấy sách sắp đến hạn:", err))
      .finally(() => setLoading(false));
  }, []);

  // Nếu đang tải hoặc không có sách nào thì không render gì cả (ẩn component)
  if (loading || data.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Sắp đến hạn trả
      </h2>

      <div className="space-y-3">
        {data.map((book) => (
          <BookStatusCard
            key={book.id}
            book={book}
            type="borrowed"
          />
        ))}
      </div>
    </div>
  );
}

export default DueSoonSection;