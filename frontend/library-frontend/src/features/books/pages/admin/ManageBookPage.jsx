// import { useEffect, useState } from "react";
// import { Plus } from "lucide-react";
// import { Button, Modal } from "../../../../components/ui";
// import BookTable from "../../components/admin/BookTable";
// import BookForm from "../../components/admin/BookForm";
// import { useBooks } from "../../hooks/useBooks"; 

// function ManageBookPage() {
//   const { books, isLoading, fetchBooks, handleCreateBook } = useBooks(); // Lấy từ Hook bạn vừa tạo lúc nãy
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingBook, setEditingBook] = useState(null); // Lưu thông tin sách đang sửa (nếu có)
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Load danh sách sách khi vào trang
//   useEffect(() => {
//     fetchBooks();
//   }, [fetchBooks]);

//   // Bấm nút Thêm Mới
//   const openCreateModal = () => {
//     setEditingBook(null);
//     setIsModalOpen(true);
//   };

//   // Bấm nút Sửa (truyền từ BookTable lên)
//   const openEditModal = (book) => {
//     setEditingBook(book);
//     setIsModalOpen(true);
//   };

//   // Bấm nút Xóa (Tạm thời chỉ log ra, bạn có thể gọi hàm handleDeleteBook sau)
//   const handleDelete = (id) => {
//     if(window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) {
//       console.log("Xóa sách ID:", id);
//       // handleDeleteBook(id);
//     }
//   };

//   // Xử lý submit Form (Thêm hoặc Sửa)
//   const handleSubmitForm = async (formData) => {
//     setIsSubmitting(true);
//     try {
//       if (editingBook) {
//         console.log("Gọi API Update cho ID:", editingBook.id, formData);
//         // await updateBook(editingBook.id, formData);
//       } else {
//         console.log("Gọi API Create:", formData);
//         // await handleCreateBook(formData);
//       }
      
//       setIsModalOpen(false); // Đóng modal
//       fetchBooks(); // Tải lại danh sách
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
      
//       {/* HEADER TÌM KIẾM & NÚT THÊM */}
//       <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
//         <h1 className="text-xl font-bold text-slate-800">Quản lý kho sách</h1>
        
//         <Button variant="primary" onClick={openCreateModal} className="gap-2">
//           <Plus size={18} /> Thêm sách mới
//         </Button>
//       </div>

//       {/* BẢNG DỮ LIỆU */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//         {isLoading ? (
//           <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
//         ) : (
//           <BookTable 
//             books={books} 
//             onEdit={openEditModal} 
//             onDelete={handleDelete} 
//           />
//         )}
//       </div>

//       {/* MODAL THÊM/SỬA SÁCH */}
//       <Modal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         title={editingBook ? "Chỉnh sửa thông tin sách" : "Thêm sách mới"}
//         maxWidth="max-w-2xl"
//       >
//         <BookForm 
//           initialData={editingBook} 
//           onSubmit={handleSubmitForm} 
//           onCancel={() => setIsModalOpen(false)}
//           isLoading={isSubmitting}
//         />
//       </Modal>

//     </div>
//   );
// }

// export default ManageBookPage;