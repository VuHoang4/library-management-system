import { useState, useCallback } from "react";
import { reservationApi } from "../services/reservationApi";
import { mapReservationToCard } from "../../../utils/mapToBookCard";

export function useReservation() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reservationApi.getMyReservations();
      console.log("Dữ liệu đặt/giữ sách của tôi:", res.data);
      setBooks(res.data.map(mapReservationToCard));
    } catch (err) {
      console.error("Lỗi lấy reservations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { books, isLoading, fetchReservations };
}