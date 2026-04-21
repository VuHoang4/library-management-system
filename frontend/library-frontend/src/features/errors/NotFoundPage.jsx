import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-tight">404</h1>
      <p className="text-2xl font-semibold text-slate-800 mt-4">Trang không tồn tại</p>
      <p className="text-slate-500 mt-2 max-w-md">
        Có vẻ như bạn đã đi lạc hoặc đường dẫn này không còn tồn tại trong thư viện của chúng tôi.
      </p>
      <Link 
        to="/" 
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Trở về Trang chủ
      </Link>
    </div>
  );
}

export default NotFoundPage;