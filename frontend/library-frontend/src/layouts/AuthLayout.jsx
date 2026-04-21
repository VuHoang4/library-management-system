// src/layouts/AuthLayout.jsx
import { Logo } from "../components/common";
function AuthLayout({ children, title = "Chào mừng bạn" }) {
  return (
    <div className="min-h-screen flex w-full font-sans bg-slate-50">
      
      {/* 🌟 CỘT TRÁI: Branding - Phong cách Modern SaaS (Chỉ hiện trên Desktop) */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between p-12 bg-slate-950 text-white overflow-hidden">
        
        {/* ---- HIỆU ỨNG BACKGROUND ---- */}
        {/* Nền xanh đen mờ */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 to-slate-950"></div>
        {/* Đốm sáng xanh dương góc trên */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        {/* Đốm sáng tím góc dưới */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Lưới Grid tinh tế (Tạo texture) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>

        {/* ---- NỘI DUNG CỘT TRÁI ---- */}
        {/* 1. Top Logo */}
       <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Nhúng Logo của bạn vào đây, ép màu text màu trắng để nổi trên nền đen */}
          <div className="text-white">
            <Logo size={40} textSize="text-3xl" />
          </div>
        </div>

        {/* 2. Middle Content (Slogan) */}
        <div className="relative z-10 max-w-lg animate-in fade-in slide-in-from-left-8 duration-1000 delay-150">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-[1.15]">
            Khám phá thế giới <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              tri thức vô tận.
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Hệ thống quản lý thư viện thông minh, giúp bạn dễ dàng tìm kiếm, mượn trả và đắm chìm vào hàng ngàn đầu sách chỉ với vài cú click.
          </p>
        </div>

        {/* 3. Bottom Trust Badge (Uy tín) */}
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md w-max shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {/* Các avatar giả */}
                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-blue-700">A</div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-emerald-700">B</div>
                <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-purple-700">C</div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-1 text-yellow-400 text-sm">
                  ★ ★ ★ ★ ★
                </div>
                <p className="text-sm text-slate-300 font-medium mt-0.5">
                  Được tin dùng bởi <span className="text-white font-bold">10,000+</span> độc giả
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 🌟 CỘT PHẢI: Khu vực Form Trắng tinh khôi */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 relative">
        
        {/* Nền trang trí nhẹ trên Mobile (Vì mobile ko có cột trái) */}
        <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent lg:hidden pointer-events-none"></div>

        {/* Khung Form (Bóng đổ cực xịn, viền siêu mỏng) */}
        <div className="relative z-10 w-full max-w-[420px] bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100 animate-in fade-in zoom-in-[0.98] duration-500">
          
          {/* Logo hiển thị riêng cho Mobile */}
          <div className="flex flex-col items-center justify-center mb-8 lg:hidden">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20 mb-3">
              📚
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Library Space</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center tracking-tight">
            {title}
          </h2>

          {/* CHÍNH LÀ NƠI CHỨA LOGIN FORM / REGISTER FORM CỦA BẠN */}
          <div className="mt-6">
            {children}
          </div>

        </div>

        {/* Footer nhỏ dưới Form */}
        <div className="mt-8 text-center text-xs text-slate-400 font-medium lg:absolute lg:bottom-8">
          © {new Date().getFullYear()} Library Space. Đã đăng ký bản quyền.
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;