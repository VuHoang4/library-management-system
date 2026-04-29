import { useState, useCallback } from "react";
import { getNotifications, markAllAsRead, markAsRead } from "../services/notificationApi";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // ================= FETCH =================
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ================= MARK 1 =================
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, unread: false } : n
        )
      );

    } catch (error) {
      console.error("Lỗi mark read:", error);
    }
  };

  // ================= MARK ALL =================
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, unread: false }))
      );

    } catch (error) {
      console.error("Lỗi mark all:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    handleMarkAllAsRead,
    handleMarkAsRead, 
  };
}