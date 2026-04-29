function Table({ headers, children }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm text-left whitespace-nowrap">
        
        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-3">{header}</th>
            ))}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {children}
        </tbody>
        
      </table>
    </div>
  );
}

export default Table;