import { useState, useEffect, useCallback } from "react";
import { bookApi } from "../../books/services/bookApi";
import { userApi } from "../../users/services/userApi"; 

export function useDashboard(userId) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    borrowCount: 0,
    reservationCount: 0,
    totalDebt: 0,
    dueSoonCount: 0
  });

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const [booksRes, summaryRes] = await Promise.all([
        bookApi.getBooks(),
        userApi.getDashboardSummary(userId)
      ]);
      
      setBooks(booksRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { books, summary, isLoading };
}