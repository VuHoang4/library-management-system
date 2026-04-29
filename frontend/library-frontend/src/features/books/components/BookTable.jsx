import { useState } from "react";
import { Pencil, Trash2, Image as ImageIcon, BookX } from "lucide-react";
import { Loading, Empty, ConfirmModal } from "../../../components/common";
import { Table, Button, Badge } from "../../../components/ui";

export function BookTable({ books, isLoading, onDelete, onEdit }) {
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      await onDelete(bookToDelete.id);
      setBookToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <Loading text="Đang đồng bộ dữ liệu..." />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="py-10">
        <Empty
          title="Kho sách trống"
          message="Chưa có dữ liệu hoặc không tìm thấy sách phù hợp."
          icon={<BookX size={48} strokeWidth={1.5} />}
        />
      </div>
    );
  }

  const headers = [
    "STT",
    "Thông tin sách",
    "Thể loại",
    "Nhà xuất bản",
    "Tổng số",
    "Có sẵn",
    "Thao tác"
  ];

  return (
    <>
      <Table headers={headers}>
        {books.map((book, index) => (
          <tr key={book.id} className="hover:bg-slate-50 transition-colors group border-b border-slate-100">
            
            <td className="px-6 py-4 text-center text-sm font-bold text-slate-500 w-16">
              {index + 1}
            </td>

            <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                {book.imageUrl ? (
                  <img 
                    src={book.imageUrl} 
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded-md shadow-sm border border-slate-200 shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-12 h-16 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200 text-slate-400 shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-800 text-sm truncate max-w-[200px]" title={book.title}>
                    {book.title}
                  </div>
                  <div className="text-slate-500 font-medium text-xs mt-1 truncate max-w-[200px]" title={book.authorName || book.author}>
                    {book.authorName || book.author}
                  </div>
                </div>
              </div>
            </td>

            <td className="px-6 py-4">
              <Badge variant="default">
                {book.categoryName || book.category || "Chưa phân loại"}
              </Badge>
            </td>

            <td className="px-6 py-4 text-sm font-medium text-slate-600">
              {book.publisherName || book.publisher || "Đang cập nhật"}
            </td>

            <td className="px-6 py-4 text-center text-sm font-bold text-slate-600">
              {book.quantity}
            </td>

            <td className="px-6 py-4 text-center">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                book.available > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}>
                {book.available}
              </span>
            </td>

            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onEdit(book)}
                  title="Sửa thông tin"
                  className="px-2 py-2"
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => setBookToDelete(book)}
                  title="Xóa sách"
                  className="px-2 py-2"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </td>

          </tr>
        ))}
      </Table>

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