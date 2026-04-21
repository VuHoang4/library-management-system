// import { useState, useEffect } from "react";
// import { Input, Button } from "../../../../components/ui";

// function BookForm({ initialData = null, onSubmit, onCancel, isLoading }) {
//   const [form, setForm] = useState({
//     title: "",
//     authorName: "",
//     isbn: "",
//     categoryName: "",
//     quantity: 1,
//     imageUrl: "",
//   });

//   // Nếu có initialData (Đang bấm nút Sửa), thì đổ dữ liệu cũ vào form
//   useEffect(() => {
//     if (initialData) {
//       setForm({
//         title: initialData.title || "",
//         authorName: initialData.authorName || initialData.author || "",
//         isbn: initialData.isbn || "",
//         categoryName: initialData.categoryName || "",
//         quantity: initialData.totalQuantity || initialData.quantity || 1,
//         imageUrl: initialData.imageUrl || "",
//       });
//     }
//   }, [initialData]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 mt-2">
//       <Input label="Tên sách" name="title" value={form.title} onChange={handleChange} required />
      
//       <div className="grid grid-cols-2 gap-4">
//         <Input label="Tác giả" name="authorName" value={form.authorName} onChange={handleChange} required />
//         <Input label="Thể loại" name="categoryName" value={form.categoryName} onChange={handleChange} required />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <Input label="Mã ISBN" name="isbn" value={form.isbn} onChange={handleChange} required />
//         <Input label="Số lượng tổng" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required />
//       </div>

//       <Input label="Link ảnh bìa (URL)" name="imageUrl" value={form.imageUrl} onChange={handleChange} />

//       <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
//         <Button type="button" variant="outline" onClick={onCancel}>Hủy bỏ</Button>
//         <Button type="submit" variant="primary" isLoading={isLoading}>
//           {initialData ? "Cập nhật sách" : "Thêm sách mới"}
//         </Button>
//       </div>
//     </form>
//   );
// }

// export default BookForm;