import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import BookStatusCard from "./BookStatusCard";
import { userApi } from "../../../users/services/userApi";

function DueSoonSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getDueSoonBooks()
      .then((res) => {
        setData(res.data);
        console.log("Due soon books:", res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data || data.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2.5 text-slate-800">
        <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg shadow-sm">
          <Clock size={18} strokeWidth={2.5} />
        </div>
        <h2 className="text-lg font-bold tracking-tight">
          Sắp đến hạn trả
        </h2>
      </div>

      <div className="space-y-3">
        {data.map((book) => (
          <BookStatusCard
            key={book.id}
            book={{ ...book, type: "borrow" }}
          />
        ))}
      </div>
    </div>
  );
}

export default DueSoonSection;