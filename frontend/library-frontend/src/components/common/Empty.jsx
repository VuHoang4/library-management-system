import { Inbox } from "lucide-react";

function Empty({ 
  title = "Không có dữ liệu", 
  message = "Hiện tại chưa có dữ liệu nào để hiển thị ở đây.", 
  icon, 
  action 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl w-full">
      
      <div className="mb-4 text-slate-400 bg-white p-4 rounded-full shadow-sm border border-slate-100">
        {icon || <Inbox size={48} strokeWidth={1.5} />}
      </div>
      
      <h3 className="text-lg font-bold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 mb-6 max-w-sm leading-relaxed">
        {message}
      </p>
      {action && <div>{action}</div>}
      
    </div>
  );
}

export default Empty;