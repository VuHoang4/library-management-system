import { useState } from "react";
import { librarianApi } from "../services/librarianApi";
import { toast } from "react-toastify";

export const usePosLogic = () => {
  const [reader, setReader] = useState(null);
  const [cart, setCart] = useState([]);

  // ================= SEARCH READER =================
  const searchReader = async (keyword) => {
    try {
      const res = await librarianApi.searchReader(keyword);
      console.log("Kết quả tìm kiếm độc giả:", res.data);
      setReader(res.data);
      setCart([]);
    } catch (err) {
      toast.error("Không tìm thấy độc giả");
    }
  };

  // ================= ADD BOOK =================
  const addBookToCart = async (keyword) => {
    try {
      const res = await librarianApi.searchBook(keyword);
      const book = res.data;

      //  tránh trùng
      if (cart.some((b) => b.id === book.id)) {
        toast.warning("Sách đã có trong danh sách");
        return;
      }

      setCart((prev) => [...prev, book]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không tìm thấy sách");
    }
  };

  // ================= REMOVE =================
  const removeBookFromCart = (id) => {
    setCart((prev) => prev.filter((b) => b.id !== id));
  };

  // ================= CHECKOUT =================
  const checkoutCart = async () => {
    try {
      await librarianApi.checkout({
        userId: reader.id,
        bookIds: cart.map((b) => b.id),
      });

      toast.success("Mượn sách thành công");

      //  reload lại reader
      searchReader(reader.email || reader.phone);

      setCart([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi mượn sách");
    }
  };

  // ================= RETURN =================
  const receiveReturn = async (borrowId, title) => {
    try {
      await librarianApi.returnBook(borrowId);
      toast.success(`Đã nhận trả: ${title}`);

      searchReader(reader.email || reader.phone);
    } catch (err) {
      toast.error("Lỗi trả sách");
    }
  };

  // ================= GIVE HOLDING =================
  const giveHoldingBook = async () => {
    try {
      await librarianApi.giveHolding({
        userId: reader.id,
        bookId: reader.holdingBook.id,
      });

      toast.success("Đã giao sách giữ");

      searchReader(reader.email || reader.phone);
    } catch (err) {
      toast.error("Lỗi giao sách");
    }
  };

  return {
    reader,
    cart,
    searchReader,
    addBookToCart,
    removeBookFromCart,
    checkoutCart,
    receiveReturn,
    giveHoldingBook,
  };
};
