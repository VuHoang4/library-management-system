import { useState } from "react";
import { BookOpen, Plus, Trash2, CheckCircle, BookX } from "lucide-react";
import { Button, Input, Table } from "../../../../../components/ui";
import { Empty } from "../../../../../components/common";

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

  const headers = ["STT", "Thông tin sách", "Thao tác"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-1/2 overflow-hidden relative">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="font-bold text-slate-800 mb-3">Tạo phiếu mượn mới</h3>
        <form onSubmit={handleAdd} className="flex gap-2 items-start">
          <div className="flex-1">
            <Input
              value={bookKeyword}
              onChange={(e) => setBookKeyword(e.target.value)}
              placeholder="Nhập ID hoặc Tên sách để cho mượn..."
              icon={BookOpen}
            />
          </div>
          <Button type="submit" className="py-2.5 gap-2">
            <Plus size={18} strokeWidth={2.5} />
            Thêm sách
          </Button>
        </form>
      </div>

      <div className="overflow-y-auto custom-scrollbar p-0 flex-1 pb-16">
        {cart.length === 0 ? (
          <div className="p-8">
            <Empty
              title="Chưa có sách"
              message="Chưa thêm cuốn sách nào vào phiếu mới."
              icon={<BookX size={48} strokeWidth={1.5} />}
            />
          </div>
        ) : (
          <Table headers={headers}>
            {cart.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                <td className="px-6 py-4 text-center text-sm font-bold text-slate-500 w-12">
                  {idx + 1}
                </td>

                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{item.title}</p>
                  <div className="text-xs text-slate-500 mt-1 space-y-0.5 font-medium">
                    {item.author && <p>Tác giả: {item.author}</p>}
                    {item.category && <p>Thể loại: {item.category}</p>}
                    {item.available !== undefined && (
                      <p className={item.available > 0 ? "text-emerald-600" : "text-rose-600"}>
                        Còn: {item.available}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onRemoveBook(item.id)}
                    className="px-2 py-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <span className="text-sm font-medium text-slate-600 pl-2">
          Tổng cộng: <b className="text-blue-600 text-base">{cart.length}</b> cuốn
        </span>
        <Button
          onClick={onCheckout}
          disabled={cart.length === 0 || isBlocked}
          className={`gap-2 px-6 ${
            cart.length > 0 && !isBlocked 
              ? "!bg-emerald-500 hover:!bg-emerald-600 border-none shadow-sm" 
              : ""
          }`}
        >
          <CheckCircle size={18} /> Xác Nhận Cho Mượn
        </Button>
      </div>
    </div>
  );
}