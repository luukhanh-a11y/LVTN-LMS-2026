import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, CheckSquare, Users, Award, ShieldAlert, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { teacherService } from '../../services/teacher.service';
import Gradebook from './Gradebook';

export default function ClassDetail() {
  const { classId: classIdParam } = useParams();
  const classId = Number(classIdParam);
  const [activeTab, setActiveTab] = useState('tong-quan'); 
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [tongQuanStudents, setTongQuanStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Reward Modal States
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [rewardStudent, setRewardStudent] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<number | ''>('');
  const [rewardReason, setRewardReason] = useState('');
  const [rewarding, setRewarding] = useState(false);

  const location = useLocation();
  const isHomeroomTeacher = location.state?.isHomeroom || false;
  const className = location.state?.className || 'Tên lớp';
  const stateStudentsCount = location.state?.studentsCount || 0;
  const academicYear = location.state?.academicYear || '2026 - 2027';

  // Nếu đã tải danh sách học sinh (hoặc F5 mất state) thì ưu tiên lấy số lượng thực tế
  const displayStudentsCount = tongQuanStudents.length > 0 ? tongQuanStudents.length : stateStudentsCount;

  const [isSystemEvaluationOpen, setIsSystemEvaluationOpen] = useState(false); 

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { academicService } = await import('../../services/academic.service');
        const config = await academicService.getCauHinhHeThong();
        setIsSystemEvaluationOpen(config?.danhGiaCuoiNamDangMo || false);
      } catch (err) {
        console.error('Failed to fetch system config', err);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const [allStudents, ketQuaList] = await Promise.all([
          teacherService.getHocSinhByLop(classId),
          teacherService.getDanhSachXetLopHoc(classId).catch(() => []) // Fallback to empty array if error
        ]);

        if (Array.isArray(allStudents)) {
          const mergedData = allStudents.map((hs: any) => {
            const studentId = hs.hocSinhId || hs.id;
            const kq = (ketQuaList || []).find((k: any) => k.hocSinh?.hocSinhId === studentId || k.hocSinhId === studentId);
            return {
              id: studentId,
              name: hs.hoTen || hs.name || hs.fullName || 'Học sinh',
              dob: hs.ngaySinh ? new Date(hs.ngaySinh).toLocaleDateString('vi-VN') : (hs.dob || 'N/A'),
              avgScore: kq?.diemTrungBinh || 0,
              academic: kq?.ketQuaHocTap || 'HOAN_THANH',
              conduct: kq?.ketQuaRenLuyen || 'TOT',
              result: kq?.quyetDinh === 'LEN_LOP' ? 'LEN_LOP' : (kq?.quyetDinh === 'O_LAI' ? 'O_LAI' : 'CHUA_XET')
            };
          });
          setStudentsData(mergedData);
        } else {
          setStudentsData([]);
        }
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách học sinh');
        setStudentsData([]);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTongQuan = async () => {
      setLoading(true);
      try {
        const data = await teacherService.getHocSinhByLop(classId);
        setTongQuanStudents(data || []);
      } catch (err) {
        console.error(err);
        setTongQuanStudents([]);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'danh-gia' && isHomeroomTeacher) {
      fetchStudents();
    } else if (activeTab === 'tong-quan') {
      fetchTongQuan();
    }
  }, [classId, activeTab, isHomeroomTeacher]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await teacherService.getBadges();
        const manualBadges = (data || []).filter(b => b.loai === 'THU_CONG');
        setBadges(manualBadges);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBadges();
  }, []);

  const openRewardModal = (student: any) => {
    setRewardStudent(student);
    setRewardReason('');
    setSelectedBadge('');
    setRewardModalOpen(true);
  };

  const handleRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBadge || !rewardStudent) return;
    
    setRewarding(true);
    try {
      await teacherService.awardBadge(rewardStudent.hocSinhId || rewardStudent.id, {
        huyHieuId: Number(selectedBadge),
        thuKhen: rewardReason
      });
      toast.success('Đã gửi khen thưởng thành công!');
      setRewardModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi khen thưởng');
    } finally {
      setRewarding(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedStudents(studentsData.map(s => s.id));
    else setSelectedStudents([]);
  };

  const handleSelectOne = (id: number) => {
    if (selectedStudents.includes(id)) setSelectedStudents(selectedStudents.filter(studentId => studentId !== id));
    else setSelectedStudents([...selectedStudents, id]);
  };

  const [bulkConduct, setBulkConduct] = useState('TOT');
  const [bulkAcademic, setBulkAcademic] = useState('HOAN_THANH');
  const [bulkDecision, setBulkDecision] = useState('LEN_LOP');

  const handleBulkApprove = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 học sinh để duyệt!');
      return;
    }
    
    try {
      setLoading(true);
      await Promise.all(
        selectedStudents.map(studentId => {
          const student = studentsData.find(s => s.id === studentId);
          return teacherService.luuKetQuaCuoiNam(classId, studentId, {
            ketQuaHocTap: student?.academic || 'HOAN_THANH',
            ketQuaRenLuyen: student?.conduct || 'TOT',
            quyetDinh: student?.result === 'CHUA_XET' ? 'LEN_LOP' : (student?.result || 'LEN_LOP'),
            duocXetDacCach: false
          });
        })
      );
      toast.success(`Đã lưu và duyệt kết quả cho ${selectedStudents.length} học sinh!`);
      setSelectedStudents([]);
      // Refresh students
      const [allStudents, ketQuaList] = await Promise.all([
        teacherService.getHocSinhByLop(classId),
        teacherService.getDanhSachXetLopHoc(classId).catch(() => [])
      ]);
      if (Array.isArray(allStudents)) {
        const mergedData = allStudents.map((hs: any) => {
          const studentId = hs.hocSinhId || hs.id;
          const kq = (ketQuaList || []).find((k: any) => k.hocSinh?.hocSinhId === studentId || k.hocSinhId === studentId);
          return {
            id: studentId,
            name: hs.hoTen || hs.name || hs.fullName || 'Học sinh',
            dob: hs.ngaySinh ? new Date(hs.ngaySinh).toLocaleDateString('vi-VN') : (hs.dob || 'N/A'),
            avgScore: kq?.diemTrungBinh || 0,
            academic: kq?.ketQuaHocTap || 'HOAN_THANH',
            conduct: kq?.ketQuaRenLuyen || 'TOT',
            result: kq?.quyetDinh === 'LEN_LOP' ? 'LEN_LOP' : (kq?.quyetDinh === 'O_LAI' ? 'O_LAI' : 'CHUA_XET')
          };
        });
        setStudentsData(mergedData);
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu kết quả cuối năm');
    } finally {
      setLoading(false);
    }
  };

  const updateStudentField = (id: number, field: string, value: string) => {
    setStudentsData(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const applyBulkValues = () => {
    if (selectedStudents.length === 0) return;
    setStudentsData(prev => prev.map(s => {
      if (selectedStudents.includes(s.id)) {
        return { ...s, academic: bulkAcademic, conduct: bulkConduct, result: bulkDecision };
      }
      return s;
    }));
    toast.success('Đã áp dụng thông tin cho các học sinh được chọn!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col min-h-[calc(100vh-8rem)]">
      
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
        <Link to="/teacher/classes" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-4">
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
            <p className="text-sm text-slate-500 mt-1">Năm học: {academicYear} • Sĩ số: {displayStudentsCount} học sinh</p>
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
        
        {/* TAB ĐÁNH GIÁ CUỐI NĂM - CHỈ GVCN MỚI THẤY KHI ADMIN MỞ */}
        {isHomeroomTeacher && isSystemEvaluationOpen && (
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
        
        {/* Tab Nội dung Đánh giá (Chỉ render nếu là GVCN, có mở đợt và đang chọn tab này) */}
        {activeTab === 'danh-gia' && isHomeroomTeacher && isSystemEvaluationOpen && (
          <>
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">
                  Đã chọn: <strong className="text-blue-600">{selectedStudents.length}</strong> học sinh
                </span>
                {selectedStudents.length > 0 && (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200 border-l border-slate-300 pl-4">
                    <select value={bulkAcademic} onChange={e => setBulkAcademic(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option value="HOAN_THANH_TOT">KQ học tập: Hoàn thành tốt</option>
                      <option value="HOAN_THANH">KQ học tập: Hoàn thành</option>
                      <option value="CHUA_HOAN_THANH">KQ học tập: Chưa hoàn thành</option>
                    </select>
                    <select value={bulkConduct} onChange={e => setBulkConduct(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option value="TOT">KQ rèn luyện: Tốt</option>
                      <option value="DAT">KQ rèn luyện: Đạt</option>
                      <option value="CAN_CO_GANG">KQ rèn luyện: Cần cố gắng</option>
                    </select>
                    <select value={bulkDecision} onChange={e => setBulkDecision(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white">
                      <option value="LEN_LOP">Quyết định: Lên lớp</option>
                      <option value="O_LAI">Quyết định: Ở lại lớp</option>
                    </select>
                    <button 
                      onClick={applyBulkValues}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-sm font-medium transition cursor-pointer"
                    >
                      Áp dụng hàng loạt
                    </button>
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
                        checked={selectedStudents.length === studentsData.length && studentsData.length > 0}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 font-semibold">Họ và tên</th>
                    <th className="px-6 py-4 font-semibold text-center">ĐTB Cả năm</th>
                    <th className="px-6 py-4 font-semibold">Kết quả học tập</th>
                    <th className="px-6 py-4 font-semibold">Kết quả rèn luyện</th>
                    <th className="px-6 py-4 font-semibold">Quyết định</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {studentsData.map((student) => {
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
                        <td className="px-6 py-4 font-medium">
                          <select 
                            value={student.academic} 
                            onChange={(e) => updateStudentField(student.id, 'academic', e.target.value)}
                            className="px-2 py-1.5 border border-slate-200 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                          >
                            <option value="HOAN_THANH_TOT">Hoàn thành tốt</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
                            <option value="CHUA_HOAN_THANH">Chưa hoàn thành</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={student.conduct} 
                            onChange={(e) => updateStudentField(student.id, 'conduct', e.target.value)}
                            className="px-2 py-1.5 border border-slate-200 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                          >
                            <option value="TOT">Tốt</option>
                            <option value="DAT">Đạt</option>
                            <option value="CAN_CO_GANG">Cần cố gắng</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={student.result === 'CHUA_XET' ? 'LEN_LOP' : student.result} 
                            onChange={(e) => updateStudentField(student.id, 'result', e.target.value)}
                            className={cn("px-2 py-1.5 rounded text-sm font-semibold border cursor-pointer focus:outline-none", 
                              (student.result === 'CHUA_XET' ? 'LEN_LOP' : student.result) === 'LEN_LOP' ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                            )}
                          >
                            <option value="LEN_LOP">Lên lớp</option>
                            <option value="O_LAI">Ở lại lớp</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Tab Tổng quan */}
        {activeTab === 'tong-quan' && (
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
                <Users className="w-16 h-16 mb-4 text-slate-200 animate-pulse" />
                <p>Đang tải dữ liệu học sinh...</p>
              </div>
            ) : tongQuanStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
                <Users className="w-16 h-16 mb-4 text-slate-200" />
                <p>Lớp này hiện chưa có học sinh nào.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-slate-200 text-slate-600 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-16 text-center">STT</th>
                    <th className="px-6 py-4 font-semibold">Mã Học Sinh</th>
                    <th className="px-6 py-4 font-semibold">Họ và tên</th>
                    <th className="px-6 py-4 font-semibold">Ngày sinh</th>
                    <th className="px-6 py-4 font-semibold">Giới tính</th>
                    <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tongQuanStudents.map((student, index) => (
                    <tr key={student.hocSinhId || student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-center text-slate-500 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-blue-600">{student.maHocSinh || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{student.hoTen || student.fullName || 'Học sinh'}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {student.ngaySinh ? new Date(student.ngaySinh).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {student.gioiTinh === 'NAM' ? 'Nam' : student.gioiTinh === 'NU' ? 'Nữ' : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openRewardModal(student)}
                          className="p-2 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-700 rounded-lg transition"
                          title="Khen thưởng"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab Bảng điểm */}
        {activeTab === 'bang-diem' && (
          <Gradebook embedded={true} classId={classId} />
        )}
      </div>

      {/* Modal Khen Thưởng */}
      {rewardModalOpen && rewardStudent && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-yellow-50/50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" /> Khen thưởng học sinh
              </h3>
              <button onClick={() => setRewardModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRewardSubmit} className="p-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Học sinh</p>
                <p className="font-bold text-slate-900">{rewardStudent.hoTen || rewardStudent.fullName || 'Học sinh'}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Chọn Huy hiệu <span className="text-red-500">*</span></label>
                <select 
                  required
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                >
                  <option value="" disabled>-- Chọn huy hiệu --</option>
                  {badges.map(b => (
                    <option key={b.huyHieuId} value={b.huyHieuId}>{b.tenHuyHieu}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Thư khen / Lời nhắn <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={3}
                  value={rewardReason}
                  onChange={(e) => setRewardReason(e.target.value)}
                  placeholder="Nhập lời khen dành cho học sinh..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setRewardModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition">
                  Hủy
                </button>
                <button disabled={rewarding || !selectedBadge || !rewardReason} type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600 transition flex items-center gap-2 disabled:opacity-50">
                  {rewarding ? 'Đang gửi...' : 'Gửi khen thưởng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
