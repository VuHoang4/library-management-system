import { useState, useMemo, useEffect, useLayoutEffect, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { SearchContext } from "../../../../context/SearchContext";
import { useBooks } from "../../hooks/useBooks"; 
import { useCategories } from "../../../../hooks/useCategories";
import BookGrid from "../../components/reader/BookGrid";
import { Loading, Empty } from "../../../../components/common";

function BookListPage() {
  const { user } = useContext(AuthContext);
  const { search } = useContext(SearchContext);
  
  // Chỉ lấy đúng những gì cần thiết
  const { books, isLoading, fetchBooks } = useBooks();
  const { categories } = useCategories(); // Bỏ qua isCatLoading, để UI hiện tự nhiên

  const [category, setCategory] = useState(() => {
    return sessionStorage.getItem("bookCategory") || "all";
  });

  useEffect(() => {
    sessionStorage.setItem("bookCategory", category);
  }, [category]);

  useEffect(() => {
    fetchBooks(user?.id);
  }, [user, fetchBooks]);

  // 🔥 QUAY VỀ LOGIC SCROLL NGUYÊN BẢN (KHÔNG DÙNG SETTIMEOUT)
  useLayoutEffect(() => {
    if (!isLoading && (books || []).length > 0) {
      const lastViewedBookId = sessionStorage.getItem("lastViewedBook");
      
      if (lastViewedBookId) {
        const bookElement = document.getElementById(`book-${lastViewedBookId}`);
        if (bookElement) {
          bookElement.scrollIntoView({ behavior: "smooth", block: "center" });
          sessionStorage.removeItem("lastViewedBook"); 
        }
      }
    }
  }, [isLoading, books]); // Chỉ phụ thuộc vào sách tải xong

  const handleBookClick = (book) => {
    sessionStorage.setItem("lastViewedBook", book?.id);
  };

  // Logic lọc giữ nguyên tính an toàn
  const filteredBooks = useMemo(() => {
    let result = books || [];

    if (search) {
      result = result.filter((b) =>
        b?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      const selectedCat = (categories || []).find(c => c?.id?.toString() === category);
      result = result.filter((b) => {
        const bookCatName = b?.category || b?.categoryName; 
        return bookCatName === selectedCat?.name;
      });
    }

    return result;
  }, [books, search, category, categories]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER: Luôn hiện */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Khám phá sách</h1>
      </div>

      {/* FILTER BUTTONS: Luôn hiện ngay lập tức */}
      {/* Ban đầu nó sẽ hiện nút "Tất cả", tích tắc sau API về nó sẽ mọc thêm các nút khác cực mượt */}
      <div className="flex gap-3 flex-wrap">
        {(categories || []).map((c) => {
          const stringId = c?.id?.toString();
          if (!stringId) return null;

          return (
            <button
              key={stringId}
              onClick={() => {
                setCategory(stringId);
                sessionStorage.removeItem("lastViewedBook"); 
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === stringId
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* CHỈ CÓ KHU VỰC SÁCH LÀ HIỂN THỊ LOADING (Giống hệt bản cũ) */}
      {isLoading && (
        <div className="py-20">
          <Loading text="Đang tải danh mục sách..." />
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && filteredBooks.length === 0 && (
        <Empty 
          title="Không tìm thấy cuốn sách nào"
          message="Chưa có dữ liệu phù hợp với bộ lọc. Hãy thử chọn thể loại khác hoặc xóa từ khóa tìm kiếm nhé!"
          icon="🔍"
        />
      )}

      {/* LƯỚI SÁCH */}
      {!isLoading && filteredBooks.length > 0 && (
        <BookGrid
          books={filteredBooks}
          onBookClick={handleBookClick}
        />
      )}
      
    </div>
  );
}

export default BookListPage;