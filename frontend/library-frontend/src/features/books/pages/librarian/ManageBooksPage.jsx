import { useManageBooks } from "../../hooks/useManageBooks";
import { BookFilterBar } from "../../components/BookFilterBar";
import { BookTable } from "../../components/BookTable";
import { BookFormModal } from "../../components/librarian/BookFormModal";
import { Plus, BookOpen } from "lucide-react"; // 🌟 Import thêm icon

function ManageBooksPage() {
  const { 
    books, isLoading, 
    searchTerm, setSearchTerm, 
    category, setCategory,
    categoriesList,
    handleDeleteBook,
    isModalOpen, setIsModalOpen,    
    editingBook,                    
    handleOpenAdd,                  
    handleOpenEdit,                 
    handleSaveBook                  
  } = useManageBooks();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-10">
      
      {/* 🌟 HEADER NÂNG CẤP */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          {/* Biểu tượng trang trí bên cạnh tiêu đề */}
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl hidden sm:block">
            <BookOpen size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              Quản lý Kho Sách
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Thêm, sửa, xóa và theo dõi số lượng sách trong thư viện.
            </p>
          </div>
        </div>

        {/* Nút bấm chuẩn xịn (Có icon, bóng đổ, hiệu ứng click) */}
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-blue-200 hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
        >
          <Plus size={20} strokeWidth={2.5} />
          Thêm sách mới
        </button>
      </div>

      {/* 🌟 KHU VỰC DỮ LIỆU (Gom Filter và Table vào chung 1 luồng nhìn) */}
      <div className="space-y-4">
        <BookFilterBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          categoriesList={categoriesList}
        />

        <BookTable 
          books={books} 
          isLoading={isLoading} 
          onDelete={handleDeleteBook}
          onEdit={handleOpenEdit} 
        />
      </div>

      {/* MODAL */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveBook}               
        initialData={editingBook}             
        categoriesList={categoriesList}       
      />
    </div>
  );
}

export default ManageBooksPage;