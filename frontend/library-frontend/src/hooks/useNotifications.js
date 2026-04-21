import { useState, useCallback } from "react";
import { getNotifications, markAllAsRead } from "../services/notificationApi";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tính số lượng chưa đọc
  const unreadCount = notifications.filter((n) => n.unread).length;

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications();
      // Đảm bảo data trả về là mảng
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Sau khi gọi API thành công, cập nhật state ở local để UI đổi ngay lập tức
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    handleMarkAllAsRead,
  };
}