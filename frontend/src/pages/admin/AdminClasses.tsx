import { useState, useEffect } from 'react';
import { Plus, Search, Users, MoreVertical, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import Button from '../../components/Button';
import { classService } from '../../services/class.service';
import toast from 'react-hot-toast';

export default function AdminClasses() {
  const [activeGrade, setActiveGrade] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const grades = [1, 2, 3, 4, 5];
  
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await classService.getAllClasses();
        const mapped = data.map((c: any) => ({
          id: c.lopHocId,
          name: c.tenLop,
          grade: c.khoiLop,
          teacherName: c.giaoVienChuNhiem?.hoTen || 'Chưa phân công',
          studentCount: `${c.siSoHienTai || 0}/${c.siSoToiDa}`,
          status: c.trangThai === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'
        }));
        setClasses(mapped);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách lớp học');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(c => 
    c.grade === activeGrade && 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Lớp học</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý danh sách lớp học theo từng khối và phân công GVCN.</p>
        </div>
        <Button 
          type="button" 
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Thêm lớp mới
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* CỘT TRÁI: DANH SÁCH KHỐI */}
        <div className="w-full md:w-64 shrink-0 flex flex-col space-y-2">
          <div className="font-bold text-slate-900 px-2 pb-2">Chọn Khối Lớp</div>
          {grades.map(grade => (
            <button
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={cn(
                "w-full px-4 py-3 rounded-xl text-left font-bold transition flex items-center justify-between group",
                activeGrade === grade 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-sm"
              )}
            >
              Khối {grade}
              {activeGrade === grade && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
            </button>
          ))}
        </div>

        {/* CỘT PHẢI: LƯỚI LỚP HỌC */}
        <div className="flex-1 bg-slate-50/50 border border-slate-200 rounded-2xl p-6 overflow-y-auto">
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-slate-900">Danh sách Khối {activeGrade}</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm lớp..." 
                className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map(c => (
              <Link to={`/admin/classes/${c.id}`} key={c.id} className="block bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-blue-300 transition group relative cursor-pointer hover:shadow-md">
                <button 
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigating when clicking the More icon
                  }}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{c.name}</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">GVCN:</span>
                    <span className="font-bold text-slate-800">{c.teacherName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Học sinh:</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {c.studentCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Trạng thái:</span>
                    <span className="font-medium text-emerald-600">{c.status}</span>
                  </div>
                </div>
              </Link>
            ))}

            {filteredClasses.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 border-dashed rounded-2xl">
                <p>Chưa có dữ liệu lớp học cho Khối {activeGrade}.</p>
                <button className="mt-3 text-sm font-bold text-blue-600 hover:underline cursor-pointer">Tạo lớp ngay</button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL THÊM LỚP MỚI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Thêm lớp học mới</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }} className="p-6 bg-slate-50/50 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tên lớp</label>
                <input 
                  type="text" 
                  placeholder="VD: 1A3"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Thuộc khối</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                  {grades.map(g => <option key={g} value={g}>Khối {g}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Giáo viên chủ nhiệm</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                  <option value="">-- Chọn giáo viên --</option>
                  <option value="1">Trần Lê A</option>
                  <option value="2">Phạm Văn D</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddModal(false)} 
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                >
                  Tạo lớp mới
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
