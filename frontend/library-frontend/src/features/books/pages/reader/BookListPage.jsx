import { useState, useMemo, useEffect, useLayoutEffect, useContext, useRef } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { SearchContext } from "../../../../context/SearchContext";
import { useBooks } from "../../hooks/useBooks"; 
import { useCategories } from "../../../../hooks/useCategories";
import BookGrid from "../../components/reader/BookGrid";
import { Loading, Empty } from "../../../../components/common";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

function BookListPage() {
  const { user } = useContext(AuthContext);
  const { search } = useContext(SearchContext);
  
  const { books, isLoading, fetchBooks } = useBooks();
  const { categories } = useCategories(); 

  // Tham chiếu tới container cuộn danh mục
  const scrollContainerRef = useRef(null);

  const [category, setCategory] = useState(() => {
    return sessionStorage.getItem("bookCategory") || "all";
  });

  useEffect(() => {
    sessionStorage.setItem("bookCategory", category);
  }, [category]);

  useEffect(() => {
    fetchBooks(user?.id);
  }, [user, fetchBooks]);

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
  }, [isLoading, books]); 

  const handleBookClick = (book) => {
    sessionStorage.setItem("lastViewedBook", book?.id);
  };

  // Hàm xử lý click nút cuộn ngang
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Khoảng cách mỗi lần cuộn
      scrollContainerRef.current.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

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
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Khám phá sách</h1>
      </div>

      {/* KHU VỰC DANH MỤC ĐƯỢC NÂNG CẤP UI */}
      <div className="relative group flex items-center -mx-2 px-2">
        {/* Nút cuộn trái (Chỉ hiện trên màn hình lớn khi hover) */}
        <div className="absolute left-0 z-10 h-full hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gradient-to-r from-slate-50 via-slate-50 to-transparent pr-8 py-2 pl-2">
            <button 
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>

        {/* Container Categories (Ẩn thanh cuộn mặc định bằng Tailwind classes) */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth py-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
        >
          <button
            onClick={() => {
              setCategory("all");
              sessionStorage.removeItem("lastViewedBook"); 
            }}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
              category === "all"
                ? "bg-blue-600 text-white shadow-blue-200"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            Tất cả
          </button>

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
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  category === stringId
                    ? "bg-blue-600 text-white shadow-blue-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Nút cuộn phải (Chỉ hiện trên màn hình lớn khi hover) */}
        <div className="absolute right-0 z-10 h-full hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gradient-to-l from-slate-50 via-slate-50 to-transparent pl-8 py-2 pr-2">
            <button 
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="py-20">
          <Loading text="Đang tải danh mục sách..." />
        </div>
      )}

      {!isLoading && filteredBooks.length === 0 && (
        <Empty 
          title="Không tìm thấy cuốn sách nào"
          message="Chưa có dữ liệu phù hợp với bộ lọc. Hãy thử chọn thể loại khác hoặc xóa từ khóa tìm kiếm nhé!"
          icon={<Search size={48} strokeWidth={1.5} />}
        />
      )}

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