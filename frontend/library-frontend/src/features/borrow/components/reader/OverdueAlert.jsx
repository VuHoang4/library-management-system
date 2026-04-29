import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../../users/services/userApi";
import { Button } from "../../../../components/ui";

function OverdueAlert() {
  const navigate = useNavigate();
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getOverdueBooks()
      .then((res) => {
        setOverdueBooks(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !overdueBooks || overdueBooks.length === 0) return null;

  const totalFine = overdueBooks.reduce((sum, book) => sum + (book.fine || book.fineAmount || 0), 0);

  return (
    <div className="bg-rose-50 border border-rose-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shrink-0 shadow-sm border border-rose-200/50">
          <AlertTriangle size={24} strokeWidth={2} />
        </div>

        <div>
          <h3 className="font-bold text-rose-800 text-base">
            Bạn có {overdueBooks.length} sách trễ hạn
          </h3>

          {totalFine > 0 && (
            <p className="text-sm font-semibold text-rose-600 mt-0.5">
              Tổng tiền phạt: {totalFine.toLocaleString("vi-VN")} đ
            </p>
          )}
        </div>
      </div>

      <Button
        variant="danger"
        onClick={() => navigate("/payments")}
        className="w-full sm:w-auto shadow-sm px-6"
      >
        Xem chi tiết
      </Button>
    </div>
  );
}

export default OverdueAlert;