import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PosHeader from "../../components/librarian/pos/PosHeader";
import PosReaderProfile from "../../components/librarian/pos/PosReaderProfile";
import PosReturnSection from "../../components/librarian/pos/PosReturnSection";
import PosCheckoutSection from "../../components/librarian/pos/PosCheckoutSection";
import { usePosLogic } from "../../hooks/usePosLogic";
import { ConfirmModal } from "../../../../components/common";

export default function PosCirculationPage() {
  const navigate = useNavigate();
  const posLogic = usePosLogic();

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null, 
  });

  const closeConfirm = () => setConfirmConfig((prev) => ({ ...prev, isOpen: false }));

  const handleConfirmAction = async () => {
    if (confirmConfig.action) {
      await confirmConfig.action();
    }
    closeConfirm();
  };

  const confirmPayFine = (fineId) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận thu tiền mặt",
      message: "Xác nhận đã nhận đủ tiền mặt đóng phạt từ Độc giả chưa?",
      action: () => posLogic.payFine(fineId),
    });
  };

  const confirmGiveHoldingBook = (bookId) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận giao sách Đặt trước",
      message: "Bạn có chắc chắn muốn giao cuốn sách này cho khách? Hệ thống sẽ tự động tạo Phiếu mượn.",
      action: () => posLogic.giveHoldingBook(bookId),
    });
  };

  const confirmReceiveReturn = (borrowId, title) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận nhận trả sách",
      message: `Nhận lại cuốn "${title}"? Vui lòng kiểm tra kỹ tình trạng vật lý của sách trước khi xác nhận.`,
      action: () => posLogic.receiveReturn(borrowId, title),
    });
  };

  const confirmCheckout = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận tạo Phiếu mượn",
      message: `Tạo phiếu mượn mới cho ${posLogic.cart.length} cuốn sách trong giỏ hàng?`,
      action: () => posLogic.checkoutCart(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PosHeader
        onBack={() => navigate("/librarian/circulation")}
        onSearch={posLogic.searchReader}
      />

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-73px)] overflow-hidden">
        
        <div className="w-full lg:w-1/3 overflow-y-auto custom-scrollbar pr-2">
          <PosReaderProfile
            reader={posLogic.reader}
            onPayFine={confirmPayFine}               
            onGiveHoldingBook={confirmGiveHoldingBook} 
          />
        </div>

        <div
          className={`w-full lg:w-2/3 flex flex-col gap-6 transition-opacity duration-300 ${
            !posLogic.reader ? "opacity-30 pointer-events-none grayscale" : "opacity-100"
          }`}
        >
          <PosReturnSection
            activeBorrows={posLogic.reader?.activeBorrows || []}
            onReturn={confirmReceiveReturn} 
          />

          <PosCheckoutSection
            cart={posLogic.cart}
            onAddBook={posLogic.addBookToCart} 
            onRemoveBook={posLogic.removeBookFromCart}
            onCheckout={confirmCheckout}     
            isBlocked={(posLogic.reader?.unpaidFine || 0) > 0}
          />
        </div>
      </main>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={handleConfirmAction}
        onClose={closeConfirm}
      />
    </div>
  );
}