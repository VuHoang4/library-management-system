import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4 relative overflow-hidden font-sans">
      
      {/* Lớp nền mờ trang trí (Blobs) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
        
        {/* Icon trang trí */}
        <div className="w-24 h-24 bg-white text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm border border-slate-200 rotate-12 hover:rotate-0 transition-transform duration-500">
          <Compass size={48} strokeWidth={1.5} />
        </div>

        {/* Text nội dung */}
        <h1 className="text-8xl md:text-9xl font-black text-slate-800 tracking-tight drop-shadow-sm">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mt-4">
          Trang không tồn tại
        </h2>
        <p className="text-slate-500 mt-3 max-w-md text-base md:text-lg font-medium">
          Có vẻ như bạn đã đi lạc hoặc đường dẫn này không còn tồn tại trong hệ thống thư viện của chúng tôi.
        </p>

        {/* Nút điều hướng (Dùng Link thay vì Button để tốt cho SEO & Accessibility) */}
        <Link 
          to="/" 
          className="mt-8 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Home size={20} strokeWidth={2} />
          Trở về Trang chủ
        </Link>
        
      </div>
    </div>
  );
}

export default NotFoundPage;