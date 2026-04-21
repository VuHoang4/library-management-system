export default function PosReturnSection({ activeBorrows = [], onReturn }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-1/2 overflow-hidden">
      
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="font-bold text-slate-800">
          Đang mượn chưa trả ({activeBorrows.length})
        </h3>
      </div>

      <div className="overflow-y-auto custom-scrollbar p-0 flex-1">
        <table className="w-full text-left border-collapse">

          <thead className="bg-white sticky top-0 shadow-sm">
            <tr className="text-slate-500 text-xs uppercase border-b border-slate-100">
              <th className="p-4 font-bold">Sách</th>
              <th className="p-4 font-bold">Ngày mượn</th>
              <th className="p-4 font-bold">Hạn trả</th>
              <th className="p-4 font-bold text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {activeBorrows.map(b => {

              const isOverdue = b.status === "OVERDUE";

              return (
                <tr key={b.id} className={`hover:bg-slate-50 ${isOverdue ? "bg-rose-50" : ""}`}>

                  {/* 📚 BOOK INFO */}
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{b.title}</p>

                    {/* NEW */}
                    {b.author && (
                      <p className="text-xs text-slate-500 mt-1">
                        {b.author}
                      </p>
                    )}
                  </td>

                  {/* 📅 BORROW DATE */}
                  <td className="p-4 text-sm text-slate-600">
                    {b.borrowDate
                      ? new Date(b.borrowDate).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>

                  {/* ⏰ DUE DATE */}
                  <td className="p-4">
                    <div className="flex flex-col text-sm">
                      <span
                        className={`font-bold ${
                          isOverdue ? "text-rose-600" : "text-slate-700"
                        }`}
                      >
                        {new Date(b.dueDate).toLocaleDateString("vi-VN")}
                      </span>

                      {/* NEW: overdue days */}
                      {isOverdue && b.overdueDays !== undefined && (
                        <span className="text-xs text-rose-500">
                          Trễ {b.overdueDays} ngày
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onReturn(b.id, b.title)}
                      className="text-sm bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-700 px-3 py-1.5 rounded transition-colors font-medium border border-slate-200 hover:border-emerald-500"
                    >
                      Nhận Trả
                    </button>
                  </td>

                </tr>
              );
            })}

            {activeBorrows.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-400 italic">
                  Không có sách đang mượn.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}