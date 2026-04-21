import BookCard from "./BookCard";

// THÊM: prop onBookClick
function BookGrid({ books, onBookClick }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => onBookClick(book)} // THÊM: Truyền hàm xuống đây
        />
      ))}
    </div>
  );
}

export default BookGrid;