function MyBooksTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "borrowed", label: "Sách mượn" },
    { key: "reservation", label: "Đã đặt" }
  ];

  return (
    <div className="flex gap-4 border-b border-slate-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          // Thêm một chút transition để hiệu ứng gạch chân mượt mà hơn
          className={`pb-3 px-1 border-b-2 transition-all duration-200 font-medium ${
            activeTab === tab.key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default MyBooksTabs;