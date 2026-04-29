import { useState, useCallback } from "react";
import { bookApi } from "../services/bookApi";

let globalBooksCache = null;

export function useBooks() {
  const [books, setBooks] = useState(globalBooksCache || []);
  const [isLoading, setIsLoading] = useState(!globalBooksCache); 
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    if (!globalBooksCache) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = await bookApi.getBooks();
      globalBooksCache = res.data; 
      setBooks(res.data); 
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sách.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { books, isLoading, error, fetchBooks };
}