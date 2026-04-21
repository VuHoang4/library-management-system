import { useState } from "react";
import { BookOpen, Clock, MonitorSmartphone } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import AdminReservationTab from "../../components/librarian/AdminReservationTab";
import AdminBorrowTab from "../../components/librarian/AdminBorrowTab";       

function ManageCirculationPage() {
  const [activeMainTab, setActiveMainTab] = useState("reservation");
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER: Phân định rõ đây là không gian Giám Sát (Back-office) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Trung tâm Giám sát Luân chuyển</h1>
          <p className="text-sm text-slate-500 mt-1">
            Không gian Back-office: Theo dõi hàng đợi tự động, báo cáo sách mượn và xử lý ngoại lệ.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Nút chuyển Tab */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveMainTab("reservation")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeMainTab === "reservation" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <Clock size={16} />
              Hàng Đợi & Giữ Sách
            </button>
            <button
              onClick={() => setActiveMainTab("borrowed")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeMainTab === "borrowed" 
                  ? "bg-white text-emerald-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              <BookOpen size={16} />
              Báo cáo Phiếu Mượn
            </button>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
          
          {/* NÚT ĐI TỚI QUẦY POS */}
          <button 
            onClick={() => navigate("/librarian/pos")} 
            className="flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-md active:scale-95 w-full sm:w-auto"
          >
            <MonitorSmartphone size={18} className="text-emerald-400" />
            Vào Quầy Giao Dịch
          </button>
        </div>
      </div>

      {/* RENDER CONTENT */}
      {activeMainTab === "reservation" && <AdminReservationTab />}
      {activeMainTab === "borrowed" && <AdminBorrowTab />}
      
    </div>
  );
}

export default ManageCirculationPage;