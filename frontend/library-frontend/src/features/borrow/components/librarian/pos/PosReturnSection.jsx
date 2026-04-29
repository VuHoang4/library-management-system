import { BookCheck } from "lucide-react";
import { Button, Table } from "../../../../../components/ui";
import { Empty } from "../../../../../components/common";

export default function PosReturnSection({ activeBorrows = [], onReturn }) {
  const headers = ["Sách", "Ngày mượn", "Hạn trả", "Thao tác"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-1/2 overflow-hidden">
      
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h3 className="font-bold text-slate-800">
          Đang mượn chưa trả ({activeBorrows.length})
        </h3>
      </div>

      <div className="overflow-y-auto custom-scrollbar p-0 flex-1">
        {activeBorrows.length === 0 ? (
          <div className="p-8 h-full flex items-center justify-center">
            <Empty
              title="Trống"
              message="Độc giả này không có cuốn sách nào đang mượn."
              icon={<BookCheck size={48} strokeWidth={1.5} />}
            />
          </div>
        ) : (
          <Table headers={headers}>
            {activeBorrows.map(b => {
              const isOverdue = b.status === "OVERDUE";

              return (
                <tr key={b.id} className={`hover:bg-slate-50 border-b border-slate-100 transition-colors ${isOverdue ? "bg-rose-50/40" : ""}`}>
                  
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{b.title}</p>
                    {b.author && (
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        {b.author}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {b.borrowDate
                      ? new Date(b.borrowDate).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-bold ${
                          isOverdue ? "text-rose-600" : "text-slate-700"
                        }`}
                      >
                        {new Date(b.dueDate).toLocaleDateString("vi-VN")}
                      </span>
                      {isOverdue && b.overdueDays !== undefined && (
                        <span className="text-xs font-semibold text-rose-500 mt-0.5">
                          Trễ {b.overdueDays} ngày
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Button
                      variant={isOverdue ? "danger" : "secondary"}
                      size="sm"
                      onClick={() => onReturn(b.id, b.title)}
                      className={!isOverdue ? "hover:!bg-emerald-500 hover:!text-white hover:!border-emerald-500 shadow-sm" : "shadow-sm"}
                    >
                      Nhận Trả
                    </Button>
                  </td>

                </tr>
              );
            })}
          </Table>
        )}
      </div>
    </div>
  );
}