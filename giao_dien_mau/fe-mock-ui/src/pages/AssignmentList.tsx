import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, CheckSquare, Clock } from 'lucide-react';
import { assignmentListData } from '../mockData';
import { cn } from '../lib/utils';

export default function AssignmentList() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Bài tập</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi tiến độ nộp bài của học sinh</p>
        </div>
        <Link 
          to="/assignments/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tạo bài tập mới
        </Link>
      </div>

      {/* Filters (Bộ lọc) */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full relative">
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Tìm kiếm</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Nhập tên bài tập..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="w-full md:w-48">
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Năm học</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
            <option>2026 - 2027</option>
            <option>2025 - 2026</option>
          </select>
        </div>

        <div className="w-full md:w-40">
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Học kỳ</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
            <option>Học kỳ 1</option>
            <option>Học kỳ 2</option>
          </select>
        </div>

        <div className="w-full md:w-40">
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Lớp học</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
            <option>Tất cả các lớp</option>
            <option>Toán 10A1</option>
            <option>Toán 10A2</option>
          </select>
        </div>

        <button type="button" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition flex items-center gap-2 border border-slate-200 h-[38px] cursor-pointer">
          <Filter className="w-4 h-4" /> Lọc
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Tên bài tập</th>
                <th className="px-6 py-4 font-semibold">Lớp</th>
                <th className="px-6 py-4 font-semibold">Hạn nộp</th>
                <th className="px-6 py-4 font-semibold">Tiến độ nộp</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {assignmentListData.map((assignment) => {
                const isClosed = assignment.status === 'DA_DONG';
                
                return (
                  <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{assignment.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{assignment.subject}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{assignment.className}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {assignment.deadlineText}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", isClosed ? "bg-slate-400" : "bg-blue-500")} 
                            style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {assignment.submitted}/{assignment.total}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                        isClosed 
                          ? "bg-slate-50 border-slate-200 text-slate-600" 
                          : "bg-green-50 border-green-100 text-green-700"
                      )}>
                        {isClosed ? 'Đã đóng' : 'Đang mở'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to="/grading" 
                          title="Chấm bài"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </Link>
                        <button type="button" title="Sửa" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition cursor-pointer">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" title="Xóa" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder (Tùy chọn) */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Hiển thị 1 - 4 trong số 4 bài tập</span>
          <div className="flex gap-1">
            <button type="button" className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Trước</button>
            <button type="button" className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Sau</button>
          </div>
        </div>
      </div>

    </div>
  );
}