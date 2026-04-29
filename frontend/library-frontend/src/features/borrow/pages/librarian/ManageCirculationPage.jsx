import { useState } from "react";
import { BookOpen, Clock, MonitorSmartphone } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import AdminReservationTab from "../../components/librarian/AdminReservationTab";
import AdminBorrowTab from "../../components/librarian/AdminBorrowTab";
import { Button } from "../../../../components/ui";

function ManageCirculationPage() {
  const [activeMainTab, setActiveMainTab] = useState("reservation");
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Trung tâm Giám sát Luân chuyển
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Không gian Back-office: Theo dõi hàng đợi tự động, báo cáo sách mượn và xử lý ngoại lệ.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto shadow-inner border border-slate-200/60">
            <button
              onClick={() => setActiveMainTab("reservation")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeMainTab === "reservation" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <Clock size={18} />
              Hàng Đợi & Giữ Sách
            </button>
            <button
              onClick={() => setActiveMainTab("borrowed")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeMainTab === "borrowed" 
                  ? "bg-white text-emerald-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <BookOpen size={18} />
              Báo cáo Phiếu Mượn
            </button>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
          
          <Button 
            onClick={() => navigate("/librarian/pos")} 
            className="w-full sm:w-auto gap-2 !bg-slate-800 hover:!bg-slate-900 text-white shadow-md border-none px-6 py-2.5"
          >
            <MonitorSmartphone size={18} className="text-emerald-400" />
            Vào Quầy Giao Dịch
          </Button>
        </div>
      </div>

      {activeMainTab === "reservation" && <AdminReservationTab />}
      {activeMainTab === "borrowed" && <AdminBorrowTab />}
      
    </div>
  );
}

export default ManageCirculationPage;