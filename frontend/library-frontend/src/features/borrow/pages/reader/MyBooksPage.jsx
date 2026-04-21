// SỬA LẠI IMPORT VÀ TÊN COMPONENT
import { useState } from "react";
import MyBooksTabs from "../../components/reader/MyBooksTabs"; // Đổi tên import
import BorrowedTab from "../../components/reader/BorrowedTab";
import ReservationTab from "../../components/reader/ReservationTab";

function MyBooksPage() {
  const [activeTab, setActiveTab] = useState("borrowed");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Quản lý của tôi
      </h1>

      {/* Dùng đúng tên component */}
      <MyBooksTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "borrowed" && <BorrowedTab />}
      {activeTab === "reservation" && <ReservationTab />}
    </div>
  );
}

export default MyBooksPage;