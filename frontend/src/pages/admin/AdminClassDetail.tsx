import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Users, Plus, Search, MoreVertical, GraduationCap, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { classService } from '../../services/class.service';
import { adminService } from '../../services/admin.service';
import { AssignTeacherModal } from './components/AssignTeacherModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ChangeTeacherModal } from './components/ChangeTeacherModal';

export default function AdminClassDetail() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [transferStudentId, setTransferStudentId] = useState<number | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);

  const [classInfo, setClassInfo] = useState<any>({
    name: `Lớp...`,
    grade: '',
    teacher: 'Đang tải...',
    totalStudents: 0,
    status: 'Đang tải...',
    id: null
  });
  const [students, setStudents] = useState<any[]>([]);
  const [targetClasses, setTargetClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchClassDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const classData = await classService.getClassById(Number(id));
      const studentsData = await classService.getStudentsByClass(Number(id));
      
      setClassInfo({
        name: classData.tenLop || `Lớp ${id}`,
        grade: classData.khoiLop,
        teacher: classData.giaoVienChuNhiem?.hoTen || 'Chưa phân công',
        totalStudents: studentsData.length,
        status: classData.trangThai === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa',
        id: classData.lopHocId,
        rawClassData: classData // Store for updating later if needed
      });

      const mapped = studentsData.map((s: any) => ({
        id: s.id,
        hsId: s.hocSinhId,
        maHs: s.maHocSinh || `HS${1000 + s.hocSinhId}`,
        name: s.fullName,
        dob: new Date(s.ngaySinh).toLocaleDateString('vi-VN'),
        gender: s.gioiTinh === 'MALE' ? 'Nam' : 'Nữ'
      }));
      setStudents(mapped);
      
      // Fetch all classes for transfer dropdown
      const all = await classService.getAllClasses();
      const availableTargets = all.filter((c: any) => c.lopHocId !== Number(id) && c.khoiLop === classData.khoiLop);
      setTargetClasses(availableTargets);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi tải chi tiết lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetail();
  }, [id]);

  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'TEACHERS'>('STUDENTS');
  const [phanCongs, setPhanCongs] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [monHocs, setMonHocs] = useState<any[]>([]);
  const [hocKys, setHocKys] = useState<any[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isChangeTeacherModalOpen, setIsChangeTeacherModalOpen] = useState(false);

  const [namHocs, setNamHocs] = useState<any[]>([]);

  const fetchPhanCongData = async () => {
    if (!id) return;
    try {
      const { academicService } = await import('../../services/academic.service');
      const [pcData, tData, mData, nData, hData] = await Promise.all([
        adminService.getPhanCongByLop(Number(id)),
        adminService.getTeachers(),
        adminService.getMonHocList(),
        academicService.getNamHocs(),
        academicService.getAllHocKy()
      ]);
      setPhanCongs(pcData);
      setTeachers(tData);
      setMonHocs(mData);
      setNamHocs(nData);
      setHocKys(hData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'TEACHERS') {
      fetchPhanCongData();
    }
  }, [activeTab, id]);

  const handleDeletePhanCong = async (pcId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phân công này?')) return;
    try {
      await adminService.deletePhanCong(pcId);
      toast.success('Đã xóa phân công');
      fetchPhanCongData();
    } catch (err) {
      toast.error('Lỗi khi xóa phân công');
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lopHocMoiId = formData.get('lopHocMoiId') as string;
    if (!lopHocMoiId) {
      toast.error('Vui lòng chọn lớp đến!');
      return;
    }
    
    setIsTransferring(true);
    try {
      const selectedStudent = students.find(s => s.id === transferStudentId);
      await classService.chuyenLop({
        hocSinhId: selectedStudent.hsId,
        lopHocCuId: classInfo.id,
        lopHocMoiId: Number(lopHocMoiId)
      });
      toast.success('Chuyển lớp thành công!');
      setTransferStudentId(null);
      // Remove student from list locally
      setStudents(prev => prev.filter(s => s.id !== transferStudentId));
      setClassInfo((prev: any) => ({ ...prev, totalStudents: prev.totalStudents - 1 }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi khi chuyển lớp');
    } finally {
      setIsTransferring(false);
    }
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
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> GVCN: <strong className="text-slate-700">{classInfo.teacher}</strong>
                <button 
                  onClick={() => setIsChangeTeacherModalOpen(true)}
                  className="text-xs ml-1 text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  (Đổi)
                </button>
              </span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Sĩ số: {classInfo.totalStudents} học sinh</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddStudentModalOpen(true)}
          >
            Thêm học sinh
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 mt-2">
        <button 
          onClick={() => setActiveTab('STUDENTS')}
          className={`pb-3 border-b-2 font-medium ${activeTab === 'STUDENTS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Danh sách học sinh
        </button>
        <button 
          onClick={() => setActiveTab('TEACHERS')}
          className={`pb-3 border-b-2 font-medium ${activeTab === 'TEACHERS' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Phân công giáo viên
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {activeTab === 'STUDENTS' ? (
          <>
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
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">{student.maHs}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.dob}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.gender}</td>
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
        </>
        ) : (
          <>
            <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Danh sách môn học được phân công</h3>
              <Button type="button" variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAssignModalOpen(true)}>
                Thêm phân công
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Môn học</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Giáo viên</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Học kỳ</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {phanCongs.map((pc, idx) => (
                    <tr key={pc.phanCongId} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{pc.tenMon || 'N/A'}</td>
                      <td className="px-6 py-4">{pc.tenGiaoVien || 'Chưa rõ'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {pc.hocKyId ? `Học kỳ ${pc.soHocKy || pc.hocKyId} (${pc.tenNamHoc || 'N/A'})` : 'Cả năm'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeletePhanCong(pc.phanCongId)}
                          className="text-sm font-bold text-red-600 hover:text-red-800 transition px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {phanCongs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                        Chưa có môn học nào được phân công.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
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
                  {students.find(s => s.id === transferStudentId)?.name || 'Học sinh'}
                </p>
                <p className="text-sm text-slate-500 mt-1">Lớp hiện tại: <span className="font-bold">{classInfo.name}</span></p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Chuyển đến lớp mới</label>
                <select name="lopHocMoiId" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium">
                  <option value="">-- Chọn lớp đến --</option>
                  {targetClasses.map((c: any) => (
                    <option key={c.lopHocId} value={c.lopHocId}>
                      Lớp {c.tenLop} (Sĩ số: {c.siSoHienTai || 0}/{c.siSoToiDa})
                    </option>
                  ))}
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

      {/* MODAL PHÂN CÔNG GIÁO VIÊN */}
      <AssignTeacherModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => {
          setIsAssignModalOpen(false);
          fetchPhanCongData();
        }}
        lopHocId={Number(id)}
        teachers={teachers}
        monHocs={monHocs}
        namHocs={namHocs}
        hocKys={hocKys}
      />

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onSuccess={() => {
          setIsAddStudentModalOpen(false);
          fetchClassDetail(); // Tải lại danh sách học sinh
        }}
        lopHocMoiId={Number(id)}
      />

      <ChangeTeacherModal
        isOpen={isChangeTeacherModalOpen}
        onClose={() => setIsChangeTeacherModalOpen(false)}
        onSuccess={() => {
          setIsChangeTeacherModalOpen(false);
          fetchClassDetail(); // Tải lại thông tin lớp học
        }}
        classId={Number(id)}
        currentTeacherId={classInfo.rawClassData?.giaoVienChuNhiem?.giaoVienId || classInfo.rawClassData?.giaoVienChuNhiemId}
      />

    </div>
  );
}
