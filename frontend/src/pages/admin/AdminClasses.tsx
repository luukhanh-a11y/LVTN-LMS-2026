import { useState, useEffect } from 'react';
import { Plus, Search, Users, MoreVertical, X, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import Button from '../../components/Button';
import { classService } from '../../services/class.service';
import { adminService } from '../../services/admin.service';
import { academicService, type CauHinhHeThong } from '../../services/academic.service';
import { useAcademicStore } from '../../stores/useAcademicStore';
import toast from 'react-hot-toast';

export default function AdminClasses({ isInsideTab = false }: { isInsideTab?: boolean }) {
  const { selectedNamHocId } = useAcademicStore();
  const [activeGrade, setActiveGrade] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const grades = [1, 2, 3, 4, 5];
  
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [cauHinh, setCauHinh] = useState<CauHinhHeThong | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClass, setEditingClass] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const mapClass = (c: any) => ({
    id: c.lopHocId,
    name: c.tenLop,
    grade: c.khoiLop,
    teacherId: c.giaoVienChuNhiem?.giaoVienId ?? null,
    teacherName: c.giaoVienChuNhiem?.hoTen || 'Chưa phân công',
    siSoToiDa: c.siSoToiDa,
    studentCount: `${c.siSoHienTai || 0}/${c.siSoToiDa}`,
    trangThai: c.trangThai,
    status: c.trangThai === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'
  });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await classService.getAllClasses();
      setClasses(data.map(mapClass));
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [teachersData, cauHinhData] = await Promise.all([
          adminService.searchUsers({ role: 'GIAO_VIEN', size: 1000 }),
          academicService.getCauHinhHeThong()
        ]);
        setTeachers(teachersData.content || teachersData || []);
        setCauHinh(cauHinhData);
      } catch (error) {
        console.error('Lỗi tải dữ liệu phụ trợ', error);
      }
    };
    fetchClasses();
    fetchDependencies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNamHocId]);

  const handleCreateClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cauHinh?.hocKyHienTaiId) {
      toast.error('Hệ thống chưa được cấu hình năm học, không thể tạo lớp!');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      tenLop: formData.get('tenLop') as string,
      khoiLop: Number(formData.get('khoiLop')),
      giaoVienChuNhiemId: formData.get('giaoVienChuNhiemId') ? Number(formData.get('giaoVienChuNhiemId')) : null,
      siSoToiDa: Number(formData.get('siSoToiDa')) || 40,
      trangThai: formData.get('trangThai') === 'on' ? 'ACTIVE' : 'DONG_BANG',
      namHocId: selectedNamHocId || 1
    };

    if (!payload.tenLop) {
      toast.error('Vui lòng nhập tên lớp');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingClass) {
        await classService.updateClass(editingClass.id, payload);
        toast.success('Cập nhật lớp học thành công!');
      } else {
        await classService.createClass(payload);
        toast.success('Tạo lớp học thành công!');
      }
      setShowAddModal(false);
      setEditingClass(null);
      fetchClasses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || (editingClass ? 'Có lỗi khi cập nhật lớp' : 'Có lỗi khi tạo lớp'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (cls: any) => {
    setOpenMenuId(null);
    if (!window.confirm(`Xoá lớp "${cls.name}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await classService.deleteClass(cls.id);
      toast.success('Đã xoá lớp học');
      fetchClasses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi xoá lớp');
    }
  };

  const [namHocList, setNamHocList] = useState<any[]>([]);
  useEffect(() => {
    academicService.getNamHocs().then(setNamHocList).catch(console.error);
  }, []);

  const filteredClasses = classes.filter(c => 
    c.grade === activeGrade && 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("max-w-6xl mx-auto space-y-6 h-full flex flex-col", !isInsideTab && "animate-in fade-in")}>
      {!isInsideTab && (
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
      )}

      {isInsideTab && (
        <div className="flex justify-end mb-2">
          <Button 
            type="button" 
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Thêm lớp mới
          </Button>
        </div>
      )}

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
                <div className="absolute top-4 right-4">
                  <button
                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === c.id ? null : c.id);
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openMenuId === c.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(null); }} />
                      <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenMenuId(null);
                            setEditingClass(c);
                            setShowAddModal(true);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClass(c);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xoá
                        </button>
                      </div>
                    </>
                  )}
                </div>

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

      {/* MODAL THÊM / SỬA LỚP */}
      {showAddModal && (
        <CreateClassModal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); setEditingClass(null); }}
          activeGrade={activeGrade}
          grades={grades}
          teachers={teachers}
          namHocList={namHocList}
          selectedNamHocId={selectedNamHocId}
          onSubmit={handleCreateClass}
          isSubmitting={isSubmitting}
          editingClass={editingClass}
        />
      )}
    </div>
  );
}

function CreateClassModal({ isOpen, onClose, activeGrade, grades, teachers, namHocList, selectedNamHocId, onSubmit, isSubmitting, editingClass }: any) {
  const isEdit = !!editingClass;
  const [trangThai, setTrangThai] = useState(editingClass?.trangThai === 'DONG_BANG' ? 'DONG_BANG' : 'ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(editingClass?.teacherId ? String(editingClass.teacherId) : '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{isEdit ? `Sửa Lớp ${editingClass.name}` : 'Thêm Lớp Học Mới'}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 bg-slate-50/50 space-y-5 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tên lớp <span className="text-red-500">*</span></label>
              <input type="text" name="tenLop" required defaultValue={editingClass?.name} placeholder="VD: 1A3" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Khối lớp</label>
              <select name="khoiLop" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" defaultValue={editingClass?.grade ?? activeGrade}>
                {grades.map((g: any) => <option key={g} value={g}>Khối {g}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Năm học</label>
            <select name="namHocId" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-100 text-slate-600" value={selectedNamHocId || ''} readOnly>
              {namHocList.map((nh: any) => <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>)}
              {!selectedNamHocId && <option value="">Chưa chọn năm học</option>}
            </select>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700">Giáo viên chủ nhiệm</label>
            <input type="hidden" name="giaoVienChuNhiemId" value={selectedTeacherId} />
            <div 
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl cursor-text flex items-center bg-white"
              onClick={() => setIsTeacherDropdownOpen(true)}
            >
              {selectedTeacherId ? (
                <div className="flex-1">
                  {teachers.find((t: any) => String(t.giaoVienId || t.id) === selectedTeacherId)?.hoTen}
                  <span className="text-slate-400 text-xs ml-2">({teachers.find((t: any) => String(t.giaoVienId || t.id) === selectedTeacherId)?.maGiaoVien})</span>
                </div>
              ) : (
                <span className="text-slate-400 flex-1 text-sm">-- Tìm kiếm giáo viên --</span>
              )}
            </div>

            {isTeacherDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-2 border-b border-slate-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Tìm theo tên hoặc mã GV..." className="w-full text-sm outline-none py-1" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <div className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 cursor-pointer italic" onClick={() => { setSelectedTeacherId(''); setIsTeacherDropdownOpen(false); }}>-- Bỏ chọn --</div>
                  {teachers.filter((t: any) => t.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) || t.maGiaoVien?.toLowerCase().includes(searchTerm.toLowerCase())).map((t: any) => (
                    <div 
                      key={t.giaoVienId || t.id} 
                      className={`px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer ${String(t.giaoVienId || t.id) === selectedTeacherId ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                      onClick={() => { setSelectedTeacherId(String(t.giaoVienId || t.id)); setIsTeacherDropdownOpen(false); }}
                    >
                      {t.hoTen} <span className="text-xs text-slate-400 ml-1">({t.maGiaoVien})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Overlay to close dropdown */}
            {isTeacherDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsTeacherDropdownOpen(false)}></div>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Sĩ số tối đa</label>
              <input type="number" name="siSoToiDa" defaultValue={editingClass?.siSoToiDa ?? 40} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Sĩ số hiện tại</label>
              <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 font-medium flex items-center justify-between cursor-not-allowed">
                <span>{isEdit ? editingClass.studentCount.split('/')[0] : 0} học sinh</span>
                {!isEdit && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">Mới tạo</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-2">
            <label className="text-sm font-bold text-slate-700">Trạng thái lớp</label>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="trangThai" className="sr-only" checked={trangThai === 'ACTIVE'} onChange={(e) => setTrangThai(e.target.checked ? 'ACTIVE' : 'DONG_BANG')} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${trangThai === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${trangThai === 'ACTIVE' ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-slate-600 w-24">{trangThai === 'ACTIVE' ? 'Đang mở' : 'Đã khóa'}</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Hủy bỏ</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEdit ? 'Đang lưu...' : 'Đang tạo...') : (isEdit ? 'Lưu thay đổi' : 'Tạo lớp mới')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
