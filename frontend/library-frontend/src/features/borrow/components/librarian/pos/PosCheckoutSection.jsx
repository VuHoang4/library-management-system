import { useState } from "react";
import { BookOpen, Plus, Trash2, CheckCircle } from "lucide-react";

export default function PosCheckoutSection({
  cart,
  onAddBook,
  onRemoveBook,
  onCheckout,
  isBlocked,
}) {
  const [bookKeyword, setBookKeyword] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!bookKeyword.trim()) return;
    onAddBook(bookKeyword);
    setBookKeyword("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-1/2 overflow-hidden relative">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="font-bold text-slate-800 mb-3">Tạo phiếu mượn mới</h3>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={bookKeyword}
            onChange={(e) => setBookKeyword(e.target.value)}
            placeholder="Nhập ID hoặc Tên sách để cho mượn..."
            className="flex-1 text-sm px-4 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={16} /> Thêm sách
          </button>
        </form>
      </div>

      <div className="overflow-y-auto custom-scrollbar p-0 flex-1 pb-16">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-slate-50">
            {cart.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50">
                {/* STT */}
                <td className="p-4 text-slate-400 font-medium w-10">
                  {idx + 1}
                </td>

                {/* THÔNG TIN SÁCH */}
                <td className="p-4">
                  <p className="font-bold text-slate-800">{item.title}</p>

                  {/* NEW INFO */}
                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    {item.author && <p>Tác giả: {item.author}</p>}
                    {item.category && <p>Thể loại: {item.category}</p>}
                    {item.available !== undefined && (
                      <p
                        className={
                          item.available > 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }
                      >
                        Còn: {item.available}
                      </p>
                    )}
                  </div>
                </td>

                {/* ACTION */}
                <td className="p-4 text-right">
                  <button
                    onClick={() => onRemoveBook(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {cart.length === 0 && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-slate-400">
                  <BookOpen size={32} className="mx-auto opacity-20 mb-2" />
                  <p className="text-sm">
                    Chưa thêm cuốn sách nào vào phiếu mới.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          Tổng cộng: <b>{cart.length}</b> cuốn
        </span>
        <button
          onClick={onCheckout}
          disabled={cart.length === 0 || isBlocked}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${
            cart.length === 0 || isBlocked
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm active:scale-95"
          }`}
        >
          <CheckCircle size={18} /> Xác Nhận Cho Mượn
        </button>
      </div>
    </div>
  );
}
