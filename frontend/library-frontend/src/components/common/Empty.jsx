// src/components/common/Empty.jsx

function Empty({ 
  title = "Không có dữ liệu", 
  message = "Hiện tại chưa có dữ liệu nào để hiển thị ở đây.", 
  icon = "📭", 
  action // Dùng để truyền một nút bấm (Ví dụ: Nút "Khám phá sách")
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl w-full">
      <div className="text-5xl mb-4 opacity-60 grayscale">{icon}</div>
      
      <h3 className="text-lg font-bold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 mb-6 max-w-sm leading-relaxed">
        {message}
      </p>
      
      {/* Nếu Component cha truyền nút bấm vào, nó sẽ hiện ở đây */}
      {action && <div>{action}</div>}
    </div>
  );
}

export default Empty;