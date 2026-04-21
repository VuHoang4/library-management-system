// src/components/common/Error.jsx

function Error({ 
  title = "Đã xảy ra sự cố!", 
  message = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.", 
  onRetry // Hàm gọi lại API
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-2xl border border-red-100 w-full">
      <div className="text-4xl mb-3">⚠️</div>
      
      <h3 className="text-lg font-bold text-red-700">{title}</h3>
      <p className="text-sm text-red-600/80 mt-1 mb-5 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Thử lại ngay
        </button>
      )}
    </div>
  );
}

export default Error;