import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, BookOpen, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';
import { classService, type ClassRoom } from '../../services/class.service';
import { useAcademicStore } from '../../stores/useAcademicStore';
import Button from '../../components/Button';
import { Modal } from '../../components/ui/Modal';

export default function TeachingAssignments() {
  const { selectedNamHocId, currentHocKyId } = useAcademicStore();
  
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Data for form
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    giaoVienId: '',
    monHocId: '',
  });
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchTeachersAndSubjects();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchAssignments(Number(selectedClassId));
    } else {
      setAssignments([]);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const data = await classService.getAllClasses(selectedNamHocId || undefined);
      setClasses(data);
    } catch (e) {
      console.error('Lỗi khi tải danh sách lớp học', e);
    }
  };

  const fetchTeachersAndSubjects = async () => {
    try {
      const [tchRes, subRes] = await Promise.all([
        adminService.getTeachers(),
        adminService.getMonHocList()
      ]);
      setTeachers(tchRes);
      setSubjects(subRes);
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu GV/Môn', e);
    }
  };

  const fetchAssignments = async (lopHocId: number) => {
    setLoading(true);
    try {
      const data = await adminService.getPhanCongByLop(lopHocId, currentHocKyId || undefined);
      setAssignments(data);
    } catch (e) {
      console.error('Lỗi khi tải phân công', e);
      toast.error('Không thể tải danh sách phân công');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !formData.giaoVienId || !formData.monHocId) {
      toast.error('Vui lòng chọn đầy đủ thông tin');
      return;
    }
    
    if (!currentHocKyId) {
      toast.error('Chưa có cấu hình Học kỳ hiện tại, không thể phân công!');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminService.createPhanCong({
        giaoVienId: Number(formData.giaoVienId),
        lopHocId: Number(selectedClassId),
        monHocId: Number(formData.monHocId),
        hocKyId: currentHocKyId
      });
      toast.success('Thêm phân công thành công');
      setIsModalOpen(false);
      setFormData({ giaoVienId: '', monHocId: '' });
      setTeacherSearchTerm('');
      fetchAssignments(Number(selectedClassId));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi phân công');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phân công này?')) return;
    try {
      await adminService.deletePhanCong(id);
      toast.success('Đã xóa phân công');
      fetchAssignments(Number(selectedClassId));
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi xóa');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Phân công Giảng dạy</h2>
          <p className="text-slate-500 mt-1">Quản lý và phân công giáo viên giảng dạy các môn học cho từng lớp</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-semibold text-slate-700">Chọn Lớp học</label>
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">-- Vui lòng chọn lớp học --</option>
              {classes.map(c => (
                <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop} (Khối {c.khoiLop})</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)} 
            disabled={!selectedClassId}
            className="w-full sm:w-auto h-[42px] shrink-0 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm Phân công
          </Button>
        </div>

        {selectedClassId ? (
          loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : assignments.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                    <th className="px-4 py-3 font-semibold w-[150px]">Mã phân công</th>
                    <th className="px-4 py-3 font-semibold">Môn học</th>
                    <th className="px-4 py-3 font-semibold">Giáo viên phụ trách</th>
                    <th className="px-4 py-3 font-semibold">Ngày phân công</th>
                    <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments.map((item) => (
                    <tr key={item.phanCongId || item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">
                        #{item.phanCongId || item.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{item.tenMonHoc || item.monHoc?.tenMonHoc || item.maMon}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Mã: {item.maMon || item.monHoc?.maMon || '---'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {(item.tenGiaoVien || item.giaoVien?.hoTen || 'G').charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{item.tenGiaoVien || item.giaoVien?.hoTen || 'Chưa rõ'}</div>
                            <div className="text-xs text-slate-500">Mã: {item.maGiaoVien || item.giaoVien?.maGiaoVien || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {item.ngayPhanCong ? new Date(item.ngayPhanCong).toLocaleDateString('vi-VN') : '---'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDeleteAssignment(item.phanCongId || item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                          title="Xóa phân công"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Chưa có phân công nào</h3>
                <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">Lớp này hiện chưa được phân công giáo viên giảng dạy môn nào trong học kỳ này.</p>
             </div>
          )
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm">
            Vui lòng chọn một lớp học ở trên để xem danh sách phân công.
          </div>
        )}
      </div>

      {/* Modal Thêm phân công */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm Phân công Giảng dạy">
        <form onSubmit={handleAddAssignment} className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
            <div className="flex items-start gap-2 text-blue-800 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Chi tiết phân công</p>
            </div>
            <div className="pl-7 text-sm text-blue-900/80 grid grid-cols-2 gap-2 mt-2">
              <div><span className="text-blue-900/50">Học kỳ:</span> {currentHocKyId || '---'}</div>
              <div><span className="text-blue-900/50">Năm học:</span> {selectedNamHocId || '---'}</div>
              <div className="col-span-2"><span className="text-blue-900/50">Lớp học:</span> <strong className="text-blue-900">{classes.find(c => c.lopHocId === Number(selectedClassId))?.tenLop}</strong></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Môn học</label>
            <select 
              required
              value={formData.monHocId}
              onChange={e => setFormData({ ...formData, monHocId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map(s => (
                <option key={s.monHocId || s.maMon} value={s.monHocId}>{s.maMon} - {s.tenMonHoc || s.tenMon}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-slate-700">Giáo viên phụ trách</label>
            <div 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl cursor-text flex items-center bg-white"
              onClick={() => setIsTeacherDropdownOpen(true)}
            >
              {formData.giaoVienId ? (
                <div className="flex-1">
                  {teachers.find(t => String(t.giaoVienId || t.id) === formData.giaoVienId)?.hoTen}
                  <span className="text-slate-400 text-xs ml-2">
                    ({teachers.find(t => String(t.giaoVienId || t.id) === formData.giaoVienId)?.maGiaoVien})
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 flex-1">-- Chọn giáo viên --</span>
              )}
            </div>

            {isTeacherDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-2 border-b border-slate-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm theo tên hoặc mã GV..." 
                    className="w-full text-sm outline-none"
                    value={teacherSearchTerm}
                    onChange={e => setTeacherSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {teachers.filter(t => 
                    t.hoTen?.toLowerCase().includes(teacherSearchTerm.toLowerCase()) || 
                    t.maGiaoVien?.toLowerCase().includes(teacherSearchTerm.toLowerCase())
                  ).map(t => (
                    <div 
                      key={t.giaoVienId || t.id} 
                      className={`px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer ${String(t.giaoVienId || t.id) === formData.giaoVienId ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                      onClick={() => {
                        setFormData({ ...formData, giaoVienId: String(t.giaoVienId || t.id) });
                        setIsTeacherDropdownOpen(false);
                      }}
                    >
                      {t.hoTen} <span className="text-slate-400 text-xs ml-1">({t.maGiaoVien})</span>
                    </div>
                  ))}
                  {teachers.filter(t => t.hoTen?.toLowerCase().includes(teacherSearchTerm.toLowerCase())).length === 0 && (
                    <div className="p-3 text-center text-sm text-slate-500">Không tìm thấy giáo viên</div>
                  )}
                </div>
              </div>
            )}
            {/* Overlay to close dropdown */}
            {isTeacherDropdownOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsTeacherDropdownOpen(false)}></div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu phân công'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
