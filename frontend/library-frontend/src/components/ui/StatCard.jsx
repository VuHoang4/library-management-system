// src/components/ui/StatCard.jsx
function StatCard({ title, value, icon, iconBg = "bg-blue-50", iconColor = "text-blue-600", className = "", ...props }) {
  return (
    <div 
      className={`bg-white p-5 rounded-2xl shadow hover:shadow-md transition flex justify-between items-center ${className}`}
      {...props}
    >
      <div>
        <p className="text-sm text-slate-500 font-medium">
          {title}
        </p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900">
          {value}
        </h3>
      </div>

      <div className={`p-3 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        {icon}
      </div>
    </div>
  );
}

export default StatCard;