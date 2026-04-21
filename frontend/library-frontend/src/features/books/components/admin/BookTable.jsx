import { Edit, Trash2 } from "lucide-react";
import { Table, Badge, Button } from "../../../../components/ui";

function BookTable({ books, onEdit, onDelete }) {
  const headers = ["Sách", "Tác giả", "Thể loại", "Số lượng", "Trạng thái", "Thao tác"];

  return (
    <Table headers={headers}>
      {books.map((book) => (
        <tr key={book.id} className="hover:bg-slate-50 transition-colors">
          {/* Cột Sách (Có hình ảnh nhỏ) */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <img 
                src={book.imageUrl || "https://via.placeholder.com/40"} 
                alt={book.title} 
                className="w-10 h-14 object-cover rounded shadow-sm"
              />
              <div>
                <p className="font-semibold text-slate-800 line-clamp-1">{book.title}</p>
                <p className="text-xs text-slate-500">ISBN: {book.isbn}</p>
              </div>
            </div>
          </td>

          <td className="px-6 py-4 text-slate-600">{book.authorName || book.author}</td>
          <td className="px-6 py-4 text-slate-600">{book.categoryName}</td>
          
          <td className="px-6 py-4 font-medium">
            {book.available} / {book.totalQuantity || book.quantity}
          </td>

          <td className="px-6 py-4">
            {book.available > 0 
              ? <Badge variant="success">Còn sách</Badge>
              : <Badge variant="danger">Hết sách</Badge>
            }
          </td>

          {/* Cột Thao tác */}
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => onEdit(book)}>
                <Edit size={16} />
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(book.id)}>
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