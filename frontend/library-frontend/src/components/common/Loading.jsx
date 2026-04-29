function Loading({ text = "Đang tải dữ liệu...", fullScreen = false }) {
  return (
    <div 
      className={`flex flex-col justify-center items-center text-slate-500 
      ${fullScreen ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50" : "p-10 w-full"}`}
    >
      {/* Vòng tròn xoay */}
      <div className="animate-spin border-4 border-slate-200 border-t-blue-600 rounded-full w-10 h-10 mb-4"></div>
      
      {/* Chữ hiển thị */}
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
}

export default Loading;