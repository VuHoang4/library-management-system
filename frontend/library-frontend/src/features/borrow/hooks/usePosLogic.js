import { useState } from "react";
import { librarianApi } from "../services/librarianApi";
import { useToast } from "../../../hooks/useToast";

export const usePosLogic = () => {
  const toast = useToast(); 
  const [reader, setReader] = useState(null);
  const [cart, setCart] = useState([]);

  const searchReader = async (keyword) => {
    try {
      const res = await librarianApi.searchReader(keyword);
      setReader(res.data);
      setCart([]);
    } catch (error) {
      console.error(error);
      toast.error("Không tìm thấy độc giả");
    }
  };

  const reloadReader = async () => {
    if (!reader) return;
    await searchReader(reader.email || reader.phone);
  };

  const addBookToCart = async (keyword) => {
    try {
      const res = await librarianApi.searchBook(keyword);
      const book = res.data;

      if (cart.some((b) => b.id === book.id)) {
        toast.warning("Sách đã có trong danh sách");
        return;
      }

      setCart((prev) => [...prev, book]);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Không tìm thấy sách");
    }
  };

  const removeBookFromCart = (id) => {
    setCart((prev) => prev.filter((b) => b.id !== id));
  };

  const checkoutCart = async () => {
    try {
      if (!reader) {
        toast.error("Chưa chọn độc giả");
        return;
      }

      await librarianApi.checkout({
        userId: reader.id,
        bookIds: cart.map((b) => b.id),
      });

      toast.success("Mượn sách thành công");

      await reloadReader();
      setCart([]);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi mượn sách");
    }
  };

  const receiveReturn = async (borrowId, title) => {
    try {
      await librarianApi.returnBook(borrowId);
      toast.success(`Đã nhận trả: ${title}`);

      await reloadReader();

    } catch (error) {
      console.error(error);
      toast.error("Lỗi trả sách");
    }
  };

  const giveHoldingBook = async (bookId) => {
    try {
      await librarianApi.giveHolding({
        userId: reader.id,
        bookId,
      });

      toast.success("Đã giao sách giữ");
      await reloadReader();

    } catch (error) {
      console.error(error);
      toast.error("Lỗi giao sách");
    }
  };

  const payFine = async (fineId) => {
    try {
      if (!fineId) {
        toast.error("Không tìm thấy phiếu phạt");
        return;
      }

      await librarianApi.payFineCash(fineId);

      toast.success("Đã thu tiền thành công");

      await reloadReader();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi thanh toán");
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
    payFine, 
  };
};