import { useNavigate } from "react-router-dom";
import PosHeader from "../../components/librarian/pos/PosHeader";
import PosReaderProfile from "../../components/librarian/pos/PosReaderProfile";
import PosReturnSection from "../../components/librarian/pos/PosReturnSection";
import PosCheckoutSection from "../../components/librarian/pos/PosCheckoutSection";
import { usePosLogic } from "../../hooks/usePosLogic";

export default function PosCirculationPage() {
  const navigate = useNavigate();
  const posLogic = usePosLogic();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER TÌM KIẾM */}
      <PosHeader
        onBack={() => navigate("/librarian/circulation")}
        onSearch={posLogic.searchReader}
      />

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-73px)] overflow-hidden">
        {/* CỘT TRÁI: PROFILE ĐỘC GIẢ */}
        <div className="w-full lg:w-1/3 overflow-y-auto custom-scrollbar pr-2">
          <PosReaderProfile
            reader={posLogic.reader}
            onPayFine={posLogic.payFine}
            onGiveHoldingBook={posLogic.giveHoldingBook}
          />
        </div>

        {/* CỘT PHẢI: XỬ LÝ SÁCH MƯỢN / TRẢ */}
        <div
          className={`w-full lg:w-2/3 flex flex-col gap-6 transition-opacity duration-300 ${!posLogic.reader ? "opacity-30 pointer-events-none grayscale" : "opacity-100"}`}
        >
          <PosReturnSection
            activeBorrows={posLogic.reader?.activeBorrows || []}
            onReturn={posLogic.receiveReturn}
          />

          <PosCheckoutSection
            cart={posLogic.cart}
            onAddBook={posLogic.addBookToCart}
            onRemoveBook={posLogic.removeBookFromCart}
            onCheckout={posLogic.checkoutCart}
            isBlocked={(posLogic.reader?.unpaidFine || 0) > 0}
          />
        </div>
      </main>
    </div>
  );
}
