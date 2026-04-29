import { useManageBooks } from "../../hooks/useManageBooks";
import { BookFilterBar } from "../../components/BookFilterBar";
import { BookTable } from "../../components/BookTable";
import { BookFormModal } from "../../components/librarian/BookFormModal";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "../../../../components/ui";

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
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

        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="gap-2 shadow-sm hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={20} strokeWidth={2.5} />
          Thêm sách mới
        </Button>
      </div>

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