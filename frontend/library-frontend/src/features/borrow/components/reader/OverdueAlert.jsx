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
      .catch((err) => console.error("Lỗi lấy sách quá hạn:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || overdueBooks.length === 0) return null;

  // Tính tổng tiền phạt. 
  // Lưu ý: Đảm bảo Backend trả về field 'fine' (hoặc 'fineAmount') cho mỗi phần tử trong mảng overdueBooks
  const totalFine = overdueBooks.reduce((sum, book) => sum + (book.fine || 0), 0);

  return (
    <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-4">
        <AlertTriangle className="text-red-500" />

        <div>
          <h3 className="font-semibold text-red-600">
            Bạn có {overdueBooks.length} sách trễ hạn
          </h3>

          {totalFine > 0 && (
            <p className="text-sm text-red-500">
              Tổng tiền phạt: {totalFine.toLocaleString()}đ
            </p>
          )}
        </div>
      </div>

      {/* Thay vì dùng thẻ <button> cũ */}
      <Button
        variant="danger"
        onClick={() => navigate("/payments")}
        className="shadow-sm"
      >
        Xem ngay
      </Button>
    </div>
  );
}

export default OverdueAlert;