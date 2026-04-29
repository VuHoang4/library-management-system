import { User, Gift, UserX } from "lucide-react";
import { Button, Badge } from "../../../../../components/ui";
import { Empty } from "../../../../../components/common";

export default function PosReaderProfile({
  reader,
  onPayFine,
  onGiveHoldingBook,
}) {
  if (!reader) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 h-full flex flex-col items-center justify-center p-8">
        <Empty
          title="Chưa chọn Độc giả"
          message="Sử dụng thanh tìm kiếm phía trên để tải thông tin Độc giả."
          icon={<UserX size={48} strokeWidth={1.5} />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        {reader.avatarUrl ? (
          <img
            src={reader.avatarUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border border-slate-100 shrink-0"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
            <User size={24} />
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {reader.fullName}
          </h2>
          <p className="text-slate-500 font-medium text-sm mb-1.5">
            {reader.phone}
          </p>
          <Badge variant={reader.isActive ? "success" : "danger"}>
            {reader.isActive ? "THẺ HOẠT ĐỘNG" : "THẺ BỊ KHÓA"}
          </Badge>
        </div>
      </div>

      {(reader.fines?.length || 0) > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-rose-800 mb-3">
            Danh sách phí phạt
          </h3>

          <div className="space-y-2">
            {reader.fines.map((f) => (
              <div
                key={f.id}
                className="bg-white p-3 rounded-xl border border-rose-100 flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {f.reason}
                  </p>
                  <p className="text-sm text-rose-600 font-bold">
                    {f.amount.toLocaleString("vi-VN")} đ
                  </p>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onPayFine(f.id)}
                >
                  Thu tiền
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 text-right font-bold text-rose-700 text-lg border-t border-rose-200/50 pt-3">
            Tổng: {reader.unpaidFine?.toLocaleString("vi-VN")} đ
          </div>
        </div>
      )}

      {reader.holdingBooks?.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600 shrink-0 mt-0.5">
              <Gift size={20} />
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="font-bold text-blue-800">
                Sách Đặt Trước (Đang giữ)
              </h3>

              {reader.holdingBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-3 rounded-xl border border-blue-100 flex justify-between items-center shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {book.title}
                    </p>

                    {book.expireDate && (
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Hết hạn:{" "}
                        {new Date(book.expireDate).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onGiveHoldingBook(book.id)}
                  >
                    Giao sách
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}