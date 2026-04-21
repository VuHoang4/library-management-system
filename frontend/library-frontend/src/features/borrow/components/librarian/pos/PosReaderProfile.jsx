import { User, AlertCircle, Gift } from "lucide-react";

export default function PosReaderProfile({ reader, onPayFine, onGiveHoldingBook }) {
  if (!reader) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <User size={64} className="opacity-20 mb-4" />
        <p className="font-semibold text-lg text-slate-600">Chưa chọn Độc giả</p>
        <p className="text-sm mt-1">Sử dụng thanh tìm kiếm phía trên để tải thông tin Độc giả.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Thẻ Thông Tin */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <img src={reader.avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover border border-slate-100" />
        <div>
          <h2 className="text-xl font-bold text-slate-800">{reader.fullName}</h2>
          <p className="text-slate-500 font-medium text-sm mb-1">{reader.phone}</p>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${reader.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {reader.isActive ? 'THẺ HOẠT ĐỘNG' : 'THẺ BỊ KHÓA'}
          </span>
        </div>
      </div>

      {/* Cảnh báo Nợ Phạt */}
      {reader.unpaidFine > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-rose-600 shrink-0" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-rose-800">Đang nợ phí phạt</h3>
              <p className="text-rose-600 text-xl font-black my-1">{reader.unpaidFine.toLocaleString('vi-VN')} đ</p>
              <button onClick={onPayFine} className="mt-2 text-sm bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-bold transition-all w-full">
                Xác nhận đã thu tiền
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sách chờ lấy */}
      {reader.holdingBook && (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl shadow-sm">
          <div className="flex items-start gap-3">
            <Gift className="text-blue-600 shrink-0" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-blue-800">Sách Đặt Trước (Đang giữ)</h3>
              <p className="font-bold text-slate-800 mt-1">{reader.holdingBook.title}</p>
              <button onClick={onGiveHoldingBook} className="mt-3 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all w-full">
                Xác nhận giao sách này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}