import { Link } from 'react-router-dom';
import { ChevronLeft, Search, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { gradebookData } from '../mockData';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Gradebook() {
  const handleExport = () => {
    toast.success('Đang xuất bảng điểm ra file Excel...');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header */}
      <div>
        <Link to="/classes" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-4">
          <ChevronLeft className="w-4 h-4" /> Quay lại danh sách lớp
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Bảng điểm lớp Toán 10A1</h2>
            <p className="text-sm text-slate-500 mt-1">Môn: Toán học • Học kỳ 1 (2026 - 2027)</p>
          </div>
          <button 
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-sm font-medium transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm tên học sinh..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Sĩ số: <strong className="text-slate-900">45</strong>
          </div>
        </div>

        {/* Bảng điểm */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-200 text-slate-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 font-semibold w-16 text-center">STT</th>
                <th className="px-6 py-4 font-semibold">Họ và tên</th>
                <th className="px-6 py-4 font-semibold text-center">Điểm Thường xuyên (HS 1)</th>
                <th className="px-6 py-4 font-semibold text-center">Điểm Giữa kỳ (HS 2)</th>
                <th className="px-6 py-4 font-semibold text-center bg-blue-50/50">ĐTB Môn</th>
                <th className="px-6 py-4 font-semibold">Tình trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {gradebookData.map((student, index) => {
                const isWarning = student.dtb < 5.0;
                
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center text-slate-400 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{student.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {student.hs1.map((score, i) => (
                          <span key={i} className="w-8 h-8 flex items-center justify-center bg-slate-50 border border-slate-200 rounded font-medium">{score}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {student.hs2.map((score, i) => (
                          <span key={i} className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-700 border border-indigo-100 rounded font-semibold">{score}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50/20">
                      <span className={cn(
                        "text-lg font-bold",
                        isWarning ? "text-red-500" : "text-blue-600"
                      )}>
                        {student.dtb.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isWarning ? (
                        <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> {student.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {student.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}