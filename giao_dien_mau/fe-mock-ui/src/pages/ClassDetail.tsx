import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckSquare, Users, Award, ShieldAlert, AlertCircle, Info } from 'lucide-react';
import { classStudentsData } from '../mockData';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function ClassDetail() {
  const [activeTab, setActiveTab] = useState('tong-quan'); // Đổi tab mặc định thành tổng quan
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // LẤY TRẠNG THÁI TỪ ROUTER ĐỂ KIỂM TRA PHÂN QUYỀN
  const location = useLocation();
  const isHomeroomTeacher = location.state?.isHomeroom || false;
  const className = location.state?.className || 'Tên lớp';

  // Giả lập hệ thống đang mở đợt đánh giá
  const isSystemEvaluationOpen = true; 

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedStudents(classStudentsData.map(s => s.id));
    else setSelectedStudents([]);
  };

  const handleSelectOne = (id: number) => {
    if (selectedStudents.includes(id)) setSelectedStudents(selectedStudents.filter(studentId => studentId !== id));
    else setSelectedStudents([...selectedStudents, id]);
  };

  const handleBulkApprove = () => {
    if (selectedStudents.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 học sinh để duyệt!');
      return;
    }
    toast.success(`Đã duyệt kết quả cuối năm cho ${selectedStudents.length} học sinh!`);
    setSelectedStudents([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Banner thông báo - CHỈ HIỆN CHO GVCN */}
      {isSystemEvaluationOpen && isHomeroomTeacher && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Hệ thống đang mở đợt Đánh giá cuối năm!</p>
            <p className="text-sm mt-0.5">Bạn là Giáo viên chủ nhiệm của lớp này. Vui lòng kiểm tra và duyệt kết quả xếp loại học sinh.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <Link to="/classes" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-4">
          <ChevronLeft className="w-4 h-4" /> Quay lại danh sách lớp
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              {className}
              {isHomeroomTeacher ? (
                <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md border border-orange-200">
                  Lớp Chủ Nhiệm
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md border border-slate-200">
                  Lớp Bộ Môn
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Năm học: 2026 - 2027 • Sĩ số: 45 học sinh</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('tong-quan')}
          className={cn("pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer", activeTab === 'tong-quan' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          Tổng quan lớp
        </button>
        <button 
          onClick={() => setActiveTab('bang-diem')}
          className={cn("pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer", activeTab === 'bang-diem' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          Bảng điểm môn
        </button>
        
        {/* TAB ĐÁNH GIÁ CUỐI NĂM - CHỈ GVCN MỚI THẤY */}
        {isHomeroomTeacher && (
          <button 
            onClick={() => setActiveTab('danh-gia')}
            className={cn("pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2", activeTab === 'danh-gia' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            <Award className="w-4 h-4" /> Đánh giá cuối năm
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Tab Nội dung Đánh giá (Chỉ render nếu là GVCN và đang chọn tab này) */}
        {activeTab === 'danh-gia' && isHomeroomTeacher && (
          <>
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">
                  Đã chọn: <strong className="text-blue-600">{selectedStudents.length}</strong> học sinh
                </span>
                {selectedStudents.length > 0 && (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200 border-l border-slate-300 pl-4">
                    <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option>Đồng loạt Hạnh kiểm: Tốt</option>
                      <option>Đồng loạt Hạnh kiểm: Khá</option>
                    </select>
                    <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option>Quyết định: Lên lớp</option>
                      <option>Quyết định: Ở lại lớp</option>
                    </select>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleBulkApprove}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm",
                  selectedStudents.length > 0 ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                <CheckSquare className="w-4 h-4" /> Duyệt kết quả ({selectedStudents.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-slate-200 text-slate-600 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 w-12">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={selectedStudents.length === classStudentsData.length && classStudentsData.length > 0}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 font-semibold">Họ và tên</th>
                    <th className="px-6 py-4 font-semibold text-center">ĐTB Cả năm</th>
                    <th className="px-6 py-4 font-semibold">Học lực</th>
                    <th className="px-6 py-4 font-semibold">Hạnh kiểm</th>
                    <th className="px-6 py-4 font-semibold">Quyết định</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {classStudentsData.map((student) => {
                    const isSelected = selectedStudents.includes(student.id);
                    const isPassed = student.result === 'LEN_LOP';
                    
                    return (
                      <tr key={student.id} className={cn("transition-colors", isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/50")}>
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleSelectOne(student.id)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{student.name}</p>
                          <p className="text-xs text-slate-500">NS: {student.dob}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn("font-bold text-lg", student.avgScore >= 8.0 ? "text-blue-600" : student.avgScore >= 5.0 ? "text-slate-700" : "text-red-500")}>
                            {student.avgScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">{student.academic}</td>
                        <td className="px-6 py-4">
                          <select className="px-2 py-1.5 border border-transparent hover:border-slate-200 rounded text-sm bg-transparent hover:bg-white transition cursor-pointer">
                            <option selected={student.conduct === 'Tốt'}>Tốt</option>
                            <option selected={student.conduct === 'Khá'}>Khá</option>
                            <option selected={student.conduct === 'Trung bình'}>Trung bình</option>
                            <option selected={student.conduct === 'Yếu'}>Yếu</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 w-max", isPassed ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200")}>
                            {isPassed ? <CheckSquare className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                            {isPassed ? 'Lên lớp' : 'Ở lại lớp'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Placeholder cho các Tab khác */}
        {activeTab !== 'danh-gia' && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <Users className="w-16 h-16 mb-4 text-slate-200" />
            <p>Dữ liệu {activeTab === 'tong-quan' ? 'tổng quan' : 'bảng điểm'} đang được cập nhật...</p>
          </div>
        )}
      </div>

    </div>
  );
}