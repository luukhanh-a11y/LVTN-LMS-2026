import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Users, Plus, Search, MoreVertical, GraduationCap, X } from 'lucide-react';
import { classStudentsData } from '../../mockData';
import { cn } from '../../lib/utils';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

export default function AdminClassDetail() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [transferStudentId, setTransferStudentId] = useState<number | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);

  // Giả lập lấy thông tin lớp từ ID
  const classInfo = {
    name: `Lớp ${id || '1A1'}`,
    grade: 1,
    teacher: 'Trần Lê A',
    totalStudents: classStudentsData.length,
    status: 'Đang hoạt động'
  };

  const filteredStudents = classStudentsData.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      setTransferStudentId(null);
      toast.success('Chuyển lớp thành công!');
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col">
      
      {/* Header */}
      <div>
        <Link to="/admin/classes" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-4">
          <ChevronLeft className="w-4 h-4" /> Quay lại danh sách lớp
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              Chi tiết {classInfo.name}
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
                {classInfo.status}
              </span>
            </h2>
            <div className="text-sm text-slate-500 mt-2 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> GVCN: {classInfo.teacher}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Sĩ số: {classInfo.totalStudents} học sinh</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Thêm học sinh
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm học sinh..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Bảng Học sinh */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Mã HS</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Họ và tên</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Ngày sinh</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Giới tính</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">HS{1000 + student.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.dob}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{idx % 2 === 0 ? 'Nam' : 'Nữ'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setTransferStudentId(student.id)}
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg"
                      >
                        Chuyển lớp
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    Không tìm thấy học sinh nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* MODAL CHUYỂN LỚP */}
      {transferStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Chuyển lớp cho học sinh</h3>
              </div>
              <button 
                type="button" 
                onClick={() => !isTransferring && setTransferStudentId(null)} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
                disabled={isTransferring}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleTransfer} className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-2">
                <p className="text-sm text-slate-600">Đang chọn chuyển học sinh:</p>
                <p className="font-bold text-blue-800 text-lg">
                  {classStudentsData.find(s => s.id === transferStudentId)?.name || 'Học sinh'}
                </p>
                <p className="text-sm text-slate-500 mt-1">Lớp hiện tại: <span className="font-bold">{classInfo.name}</span></p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Chuyển đến lớp mới</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium">
                  <option value="">-- Chọn lớp đến --</option>
                  <option value="1">Lớp 1A2 (Sĩ số: 42)</option>
                  <option value="2">Lớp 1A3 (Sĩ số: 40)</option>
                  <option value="3">Lớp 1A4 (Sĩ số: 44)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setTransferStudentId(null)} 
                  disabled={isTransferring}
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isTransferring}
                >
                  {isTransferring ? 'Đang chuyển...' : 'Xác nhận chuyển'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
