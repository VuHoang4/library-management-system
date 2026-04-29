import { Edit, Trash2, Image as ImageIcon, BookX } from "lucide-react";
import { Table, Badge, Button, Empty } from "../../../../components/common/index"; 

function BookTable({ books = [], onEdit, onDelete }) {
  const headers = ["STT", "Sách", "Tác giả", "Thể loại", "Số lượng", "Trạng thái", "Thao tác"];

  if (!books || books.length === 0) {
    return (
      <Empty 
        title="Không tìm thấy sách" 
        message="Chưa có cuốn sách nào trong kho hoặc không khớp với từ khóa tìm kiếm." 
        icon={<BookX size={48} strokeWidth={1.5} />} 
      />
    );
  }

  return (
    <Table headers={headers}>
      {books.map((book, index) => (
        <tr key={book.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
          <td className="px-6 py-4 text-center text-sm font-bold text-slate-500">
            {index + 1}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-4">
              {book.imageUrl ? (
                <img 
                  src={book.imageUrl} 
                  alt={book.title} 
                  className="w-10 h-14 object-cover rounded-md shadow-sm border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-10 h-14 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200 text-slate-400 shrink-0">
                  <ImageIcon size={20} />
                </div>
              )}
              
              <div>
                <p 
                  className="font-bold text-slate-800 line-clamp-1 max-w-[250px]" 
                  title={book.title} 
                >
                  {book.title}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  ISBN: {book.isbn || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </td>

          <td className="px-6 py-4 text-sm font-medium text-slate-700">
            {book.authorName || book.author || "-"}
          </td>
          
          <td className="px-6 py-4 text-sm text-slate-600">
            {book.categoryName || "-"}
          </td>
          
          <td className="px-6 py-4 text-sm font-bold">
            <span className="text-blue-600">{book.available}</span> 
            <span className="text-slate-400 font-normal mx-1">/</span> 
            <span className="text-slate-600">{book.totalQuantity || book.quantity}</span>
          </td>

          <td className="px-6 py-4">
            {book.available > 0 
              ? <Badge variant="success">Còn sách</Badge>
              : <Badge variant="danger">Hết sách</Badge>
            }
          </td>

          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEdit(book)}
                title="Chỉnh sửa thông tin"
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => onDelete(book.id)}
                title="Xóa cuốn sách này"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
}

export default BookTable;