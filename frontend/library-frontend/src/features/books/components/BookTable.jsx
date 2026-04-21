import { useState } from "react";
import { Loading, Empty } from "../../../components/common";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmModal } from "../../../components/common/index";

export function BookTable({ books, isLoading, onDelete, onEdit }) {
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      await onDelete(bookToDelete.id);
      setBookToDelete(null);
    }
  };

  if (isLoading)
    return (
      <div className="py-16">
        <Loading text="Đang đồng bộ dữ liệu..." />
      </div>
    );

  if (books.length === 0)
    return (
      <div className="py-10">
        <Empty
          title="Kho sách trống"
          message="Chưa có dữ liệu hoặc không tìm thấy sách phù hợp."
        />
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold w-20">STT</th>
                <th className="px-6 py-4 font-bold">Thông tin sách</th>
                <th className="px-6 py-4 font-bold">Thể loại</th>
                {/* 🌟 THÊM CỘT NHÀ XUẤT BẢN */}
                <th className="px-6 py-4 font-bold">Nhà xuất bản</th>
                <th className="px-6 py-4 font-bold text-center">Tổng số</th>
                <th className="px-6 py-4 font-bold text-center">Có sẵn</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {books.map((book, index) => (
                <tr key={book.id} className="hover:bg-blue-50/40 transition-colors group">
                  {/* STT */}
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                    {index + 1}
                  </td>

                  {/* 🌟 CẬP NHẬT: THÔNG TIN SÁCH (CÓ ẢNH BÌA) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {/* Ảnh thumbnail */}
                      <div className="w-12 h-16 shrink-0 bg-slate-100 rounded-md overflow-hidden border border-slate-200 shadow-sm">
                        <img 
                          src={book.imageUrl || "https://via.placeholder.com/150x200?text=No+Image"} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150x200?text=Error" }} // Phòng hờ link ảnh die
                        />
                      </div>
                      
                      {/* Text Tên & Tác giả */}
                      <div>
                        <div className="font-semibold text-slate-800 text-sm truncate max-w-[200px]" title={book.title}>
                          {book.title}
                        </div>
                        <div className="text-slate-500 text-xs mt-1 truncate max-w-[200px]" title={book.author}>
                          {book.author}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Thể loại */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {book.category || "Chưa phân loại"}
                    </span>
                  </td>

                  {/* 🌟 THÊM: NHÀ XUẤT BẢN */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {book.publisher || "Đang cập nhật"}
                  </td>

                  {/* Tổng số */}
                  <td className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                    {book.quantity}
                  </td>

                  {/* Có sẵn */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        book.available > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      }`}>
                      {book.available}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onEdit(book)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa thông tin"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setBookToDelete(book)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa sách"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa sách khỏi hệ thống?"
        message={
          <span>
            Bạn có chắc chắn muốn xóa cuốn sách <strong className="text-slate-800">"{bookToDelete?.title}"</strong> không? Hành động này không thể hoàn tác.
          </span>
        }
        confirmText="Vâng, xóa sách"
      />
    </>
  );
}