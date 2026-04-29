import BookCard from "./BookCard";

function BookGrid({ books, onBookClick }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => onBookClick(book)} 
        />
      ))}
    </div>
  );
}

export default BookGrid;