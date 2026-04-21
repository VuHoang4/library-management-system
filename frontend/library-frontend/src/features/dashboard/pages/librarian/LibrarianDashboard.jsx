import { MOCK_STATS, MOCK_RECENT_BORROWS } from "../../../../utils/mockData";

function LibrarianDashboard() {
  // Hàm phụ trợ để render màu cho từng trạng thái mượn sách
  const getStatusBadge = (status) => {
    switch (status) {
      case "QUEUE":
        return <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Đang chờ duyệt</span>;
      case "HOLDING":
        return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Đang giữ sách</span>;
      case "BORROWED":
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Đang mượn</span>;
      case "OVERDUE":
        return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Quá hạn</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. KHU VỰC THỐNG KÊ (STAT CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Tổng số đầu sách</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{MOCK_STATS.totalBooks}</p>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Đang được mượn</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{MOCK_STATS.activeBorrows}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Sách quá hạn</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{MOCK_STATS.overdueBorrows}</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Độc giả hoạt động</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{MOCK_STATS.totalReaders}</p>
        </div>
      </div>

      {/* 2. KHU VỰC HOẠT ĐỘNG GẦN ĐÂY */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Hoạt động mượn sách gần đây</h3>
          <button className="text-sm font-medium text-blue-600 hover:underline">Xem tất cả</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Mã Phiếu</th>
                <th className="p-4 font-medium">Độc giả</th>
                <th className="p-4 font-medium">Cuốn sách</th>
                <th className="p-4 font-medium">Ngày tạo</th>
                <th className="p-4 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RECENT_BORROWS.map((borrow) => (
                <tr key={borrow.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-800">{borrow.id}</td>
                  <td className="p-4 text-sm text-slate-600">{borrow.readerName}</td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{borrow.bookTitle}</td>
                  <td className="p-4 text-sm text-slate-500">{borrow.date}</td>
                  <td className="p-4">{getStatusBadge(borrow.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default LibrarianDashboard;