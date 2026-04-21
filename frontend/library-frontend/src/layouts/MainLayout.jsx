// src/layouts/MainLayout.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function MainLayout({ children, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        role={role}  
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        
        <Topbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Thêm relative và custom scrollbar để cuộn mượt hơn */}
        <main className="flex-1 p-6 overflow-y-auto relative custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;