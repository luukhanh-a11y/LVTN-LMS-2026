import { useState, useEffect } from 'react';
import { FileText, ListChecks, ChevronRight, ChevronLeft, Search, CheckCircle2, Sparkles, LayoutTemplate } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';
import { useAcademicStore } from '../../stores/useAcademicStore';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import { Modal } from '../../components/ui/Modal';

const STEPS = [
  { id: 1, label: 'Thông tin chung', icon: FileText },
  { id: 2, label: 'Chọn Câu hỏi & Giao diện', icon: ListChecks }, // Gộp việc chọn câu hỏi và cấu hình giao diện
];

export default function CreateAssignment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [classes, setClasses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  
  // Form State
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedMonHocId, setSelectedMonHocId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Step 2 Drill-down State
  const [sachList, setSachList] = useState<any[]>([]);
  const [selectedSachId, setSelectedSachId] = useState('');
  
  const [chuDeList, setChuDeList] = useState<any[]>([]);
  const [selectedChuDeId, setSelectedChuDeId] = useState('');
  
  const [baiHocList, setBaiHocList] = useState<any[]>([]);
  const [selectedBaiHocId, setSelectedBaiHocId] = useState('');
  
  const [dangBaiList, setDangBaiList] = useState<any[]>([]);
  
  // Map dangBaiId -> cheDoGiaoDien
  const [selectedDangBais, setSelectedDangBais] = useState<Record<number, string>>({});

  // Popup xem toàn bộ nội dung H5P (câu hỏi + đáp án) khi bấm vào 1 câu H5P trong danh sách
  const [previewH5P, setPreviewH5P] = useState<{ contentId: string; title: string } | null>(null);
  
  // Lưu trữ tất cả các câu hỏi đã từng fetch để hiển thị lại những câu đã chọn từ bài học khác
  const [allFetchedQuestions, setAllFetchedQuestions] = useState<Record<number, any>>({});

  // Fetch initial data
  useEffect(() => {
    teacherService.getMyTeacherProfile().then(setProfile).catch(console.error);
    teacherService.getClasses({ onlyTeaching: true }).then(setClasses).catch(console.error);
  }, []);

  const { currentHocKyId } = useAcademicStore();

  // Load Sach when MonHoc changes
  useEffect(() => {
    if (!profile?.giaoVienId || !selectedClassId || !selectedMonHocId || !currentHocKyId) {
      setSachList([]);
      return;
    }
    const currentClass = classes.find(c => String(c.id) === String(selectedClassId));
    const currentSubject = currentClass?.monHocList?.find((m: any) => String(m.monHocId) === String(selectedMonHocId));

    teacherService.getSachBaiTapTheoPhanCong({
      giaoVienId: profile.giaoVienId,
      lopHocId: Number(selectedClassId),
      maMon: currentSubject?.maMon || '',
      hocKyId: currentHocKyId
    }).then(list => setSachList(list)).catch(() => setSachList([]));
  }, [profile?.giaoVienId, selectedClassId, selectedMonHocId, currentHocKyId, classes]);

  // Load ChuDe when Sach changes
  useEffect(() => {
    if (!selectedSachId) {
      setChuDeList([]);
      return;
    }
    teacherService.getChuDeBySach(Number(selectedSachId))
      .then(setChuDeList).catch(() => setChuDeList([]));
  }, [selectedSachId]);

  // Load BaiHoc when ChuDe changes
  useEffect(() => {
    if (!selectedChuDeId) {
      setBaiHocList([]);
      return;
    }
    teacherService.getBaiHocByChuDe(Number(selectedChuDeId))
      .then(setBaiHocList).catch(() => setBaiHocList([]));
  }, [selectedChuDeId]);

  const handleFetchQuestions = async () => {
    if (!selectedBaiHocId) {
      toast.error('Vui lòng chọn bài học!');
      return;
    }
    try {
      const questions = await teacherService.getDangBaiByBaiHoc(Number(selectedBaiHocId));
      setDangBaiList(questions);
      
      setAllFetchedQuestions(prev => {
        const next = { ...prev };
        questions.forEach((q: any) => {
          next[q.dangBaiId] = q;
        });
        return next;
      });
    } catch (err) {
      toast.error('Lỗi khi tải câu hỏi');
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!assignmentTitle || !selectedClassId || !deadline) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }
      if (new Date(deadline).getTime() <= Date.now()) {
        toast.error('Hạn nộp phải ở tương lai');
        return;
      }
      setCurrentStep(2);
    } else {
      const dangBaiIds = Object.keys(selectedDangBais);
      if (dangBaiIds.length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 câu hỏi để giao bài!');
        return;
      }

      try {
        // Nội dung H5P (soạn qua Editor) không có duLieuGame dạng JSON quiz — phải gắn
        // loaiBaiTap: 'H5P' để học sinh được điều hướng sang trang chơi H5P (/play) thay
        // vì trang Quiz (/quiz), nơi không có cách nào hiển thị được nội dung H5P.
        const selectedQuestions = dangBaiIds.map((id) => allFetchedQuestions[Number(id)]).filter(Boolean);
        const isH5P = selectedQuestions.length > 0 && selectedQuestions.every((q) => q.loaiNoiDung === 'H5P');

        const payload = {
          baiTap: {
            giaoVienId: profile.giaoVienId,
            lopHocId: Number(selectedClassId),
            hocKyId: currentHocKyId,
            tieuDe: assignmentTitle,
            moTa: "Bài tập giao từ Teacher Portal",
            loaiBaiTap: isH5P ? "H5P" : "TRAC_NGHIEM",
            thoiDiemBatDau: new Date().toISOString().slice(0, 19),
            deadline: new Date(deadline).toISOString().slice(0, 19),
            soLanNopLaiToiDa: 3,
            trangThai: "DANG_MO"
          },
          danhSachChiTiet: dangBaiIds.map((id, index) => ({
            dangBaiId: Number(id),
            thuTu: index + 1,
            cheDoGiaoDien: selectedDangBais[Number(id)]
          }))
        };

        await teacherService.createAssignment(payload);
        toast.success('Đã tạo và giao bài tập thành công!');
        // Redirect or reset form could go here
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || 'Lỗi khi tạo bài tập. Vui lòng thử lại.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleAISuggest = async () => {
    if (!selectedClassId || !selectedMonHocId) {
      toast.error('Vui lòng chọn Lớp và Môn học trước khi nhờ AI gợi ý!');
      return;
    }

    const loadingToast = toast.loading('🤖 AI đang phân tích chương trình học...', {
      style: { minWidth: '250px' }
    });

    try {
      const currentClass = classes.find(c => String(c.id) === String(selectedClassId));
      
      const response = await teacherService.generateExerciseSuggestions({
        grade: currentClass?.grade,
        subjectId: Number(selectedMonHocId),
      });

      if (response && response.suggestions && response.suggestions.length > 0) {
        setAiSuggestions(response.suggestions);
        toast.success('AI đã đưa ra gợi ý tiêu đề!', { id: loadingToast });
      } else {
        toast.error('AI không tìm thấy gợi ý nào phù hợp.', { id: loadingToast });
      }
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      toast.error('Lỗi kết nối AI. Vui lòng thử lại sau.', { id: loadingToast });
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full">
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tạo bài tập mới</h2>
          <p className="text-sm text-slate-500 mt-1">Thiết lập bài tập và cá nhân hóa trải nghiệm học sinh.</p>
        </div>
        {currentStep === 1 && (
          <button onClick={handleAISuggest} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition font-medium shadow-sm cursor-pointer text-sm">
            <Sparkles className="w-4 h-4" /> AI Gợi ý Đề bài
          </button>
        )}
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50/30">
          
          {/* BƯỚC 1: THÔNG TIN CHUNG */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Tiêu đề bài tập <span className="text-red-500">*</span></label>
                  <input type="text" value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} placeholder="VD: Bài tập cuối tuần..." className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                  
                  {aiSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {aiSuggestions.map((sug, idx) => (
                        <button 
                          type="button"
                          key={idx} 
                          onClick={() => setAssignmentTitle(sug)}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium hover:bg-purple-100 transition cursor-pointer text-left"
                        >
                          ✨ {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Giao cho Lớp <span className="text-red-500">*</span></label>
                  <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none bg-white">
                    <option value="">-- Chọn lớp --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {selectedClassId && classes.find(c => String(c.id) === selectedClassId)?.monHocList?.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Môn học <span className="text-red-500">*</span></label>
                    <select 
                      value={selectedMonHocId} 
                      onChange={e => setSelectedMonHocId(e.target.value)} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none bg-white"
                    >
                      <option value="">-- Chọn môn học --</option>
                      {classes.find(c => String(c.id) === selectedClassId)?.monHocList.map((m: any) => (
                        <option key={m.monHocId} value={m.monHocId}>{m.tenMon}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Hạn nộp (Deadline) <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 2: CHỌN CÂU HỎI TỪ THƯ VIỆN & CẤU HÌNH GIAO DIỆN TỪNG CÂU */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Bộ lọc phân tầng (Drill-down API) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">1. Sách</label>
                  <select value={selectedSachId} onChange={e => { setSelectedSachId(e.target.value); setSelectedChuDeId(''); setSelectedBaiHocId(''); setDangBaiList([]); }} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none">
                    <option value="">-- Chọn sách --</option>
                    {sachList.map(s => (
                      <option key={s.sachId} value={s.sachId} disabled={s.loaiSach === 'SACH_GIAO_KHOA'}>
                        {s.loaiSach === 'SACH_GIAO_KHOA' ? '[SGK] ' : '[SBT] '} {s.tenSach}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">2. Chủ đề</label>
                  <select value={selectedChuDeId} onChange={e => { setSelectedChuDeId(e.target.value); setSelectedBaiHocId(''); setDangBaiList([]); }} disabled={!selectedSachId} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none">
                    <option value="">-- Chọn chủ đề --</option>
                    {chuDeList.map(c => <option key={c.chuDeId} value={c.chuDeId}>{c.tenChuDe}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">3. Bài học</label>
                  <select value={selectedBaiHocId} onChange={e => { setSelectedBaiHocId(e.target.value); setDangBaiList([]); }} disabled={!selectedChuDeId} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none">
                    <option value="">-- Chọn bài học --</option>
                    {baiHocList.map(b => <option key={b.baiHocId} value={b.baiHocId}>{b.tenBaiHoc}</option>)}
                  </select>
                </div>
                <button onClick={handleFetchQuestions} disabled={!selectedBaiHocId} className="self-end px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50">
                  Lấy câu hỏi
                </button>
              </div>

              {/* Danh sách câu hỏi và Cấu hình Giao diện */}
              <div className="space-y-6">
                
                {/* Câu hỏi đã chọn */}
                <div>
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                    <ListChecks className="w-5 h-5 text-blue-600" />
                    Danh sách câu hỏi được chọn ({Object.keys(selectedDangBais).length})
                  </h3>
                  
                  {Object.keys(selectedDangBais).length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                      Chưa có câu hỏi nào được chọn.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.keys(selectedDangBais).map((idStr, idx) => {
                        const qId = Number(idStr);
                        const q = allFetchedQuestions[qId];
                        if (!q) return null;

                        let cauHinh: any = {};
                        let dapAnChuan: any = null;
                        try {
                          if (q.duLieuGame) cauHinh = JSON.parse(q.duLieuGame);
                          if (q.dapAnChuan) dapAnChuan = JSON.parse(q.dapAnChuan);
                        } catch { }

                        return (
                          <div key={q.dangBaiId} className="bg-white border border-blue-300 ring-1 ring-blue-100 rounded-xl p-5 shadow-sm transition">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <input 
                                  type="checkbox" 
                                  className="mt-1 w-4 h-4 cursor-pointer"
                                  checked={true}
                                  onChange={() => {
                                    const newSelections = { ...selectedDangBais };
                                    delete newSelections[q.dangBaiId];
                                    setSelectedDangBais(newSelections);
                                  }}
                                />
                                <div>
                                  <div className="flex gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">Câu {idx + 1}</span>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">{q.loaiNoiDung}</span>
                                  </div>
                                  <p className="text-sm font-bold text-slate-900 mb-2">{q.tenDangBai}</p>
                                  
                                  {/* Hiển thị chi tiết câu hỏi và đáp án */}
                                  <div className="mt-2 pl-4 border-l-2 border-slate-200 text-sm text-slate-600">
                                    {q.loaiNoiDung === 'H5P' ? (
                                      q.h5pNoiDungId ? (
                                        <button
                                          type="button"
                                          onClick={() => setPreviewH5P({ contentId: q.h5pNoiDungId, title: q.tenDangBai })}
                                          className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-700 font-medium text-sm transition cursor-pointer"
                                        >
                                          🎮 Xem toàn bộ nội dung H5P (câu hỏi &amp; đáp án)
                                        </button>
                                      ) : (
                                        <p className="text-red-600 font-medium">Nội dung H5P bị thiếu contentId, không xem trước được.</p>
                                      )
                                    ) : (
                                      <>
                                        <p className="font-semibold text-slate-800">{cauHinh.cauHoi || 'Không có nội dung câu hỏi'}</p>
                                        {cauHinh.luaChon && Array.isArray(cauHinh.luaChon) ? (
                                          <ul className="mt-2 space-y-1">
                                            {cauHinh.luaChon.map((choice: any, cIdx: number) => {
                                              const val = typeof choice === 'object' ? (choice.giaTri || choice.noiDung || choice.text || choice.content || choice.value || choice.id || JSON.stringify(choice)) : choice;
                                              const hinhAnh = typeof choice === 'object' ? choice.hinhAnh : null;
                                              const isCorrect = dapAnChuan !== null && (
                                                (typeof choice === 'object' && choice.id != null && (String(dapAnChuan) === String(choice.id) || String(dapAnChuan?.dapAnDungId) === String(choice.id))) ||
                                                (String(dapAnChuan) === String(cIdx) || String(dapAnChuan?.dapAnDungId) === String(cIdx)) ||
                                                (String(dapAnChuan) === String(val))
                                              );
                                              return (
                                                <li key={cIdx} className={cn("flex items-center gap-2", isCorrect ? "text-green-600 font-bold" : "")}>
                                                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", isCorrect ? "bg-green-500" : "bg-slate-300")} />
                                                  {hinhAnh ? (
                                                    <img src={hinhAnh} alt="choice" className="h-10 object-contain rounded border" />
                                                  ) : (
                                                    <span>{val}</span>
                                                  )}
                                                  {isCorrect && <span className="text-[10px] uppercase px-1.5 py-0.5 bg-green-100 text-green-700 rounded ml-2 shrink-0">Đáp án</span>}
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        ) : (
                                          dapAnChuan && (
                                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 font-semibold text-xs">
                                              Đáp án chuẩn: {typeof dapAnChuan === 'object' ? JSON.stringify(dapAnChuan) : dapAnChuan}
                                            </div>
                                          )
                                        )}
                                      </>
                                    )}
                                  </div>

                                </div>
                              </div>

                              {/* Cấu hình giao diện riêng cho câu này */}
                              <div className="w-64 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in">
                                <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                  <LayoutTemplate className="w-3.5 h-3.5" /> Chế độ hiển thị
                                </label>
                                <select 
                                  value={selectedDangBais[q.dangBaiId]}
                                  onChange={e => setSelectedDangBais({ ...selectedDangBais, [q.dangBaiId]: e.target.value })}
                                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:outline-none"
                                >
                                  <option value="MAC_DINH">Mặc định (Tiêu chuẩn)</option>
                                  <option value="DAO_VANG">Đào Vàng</option>
                                  <option value="DUOI_BAT">Đuổi Bắt</option>
                                  <option value="THU_HOACH_NONG_SAN">Thu hoạch Nông sản</option>
                                  <option value="ECH_QUA_SONG">Ếch qua sông</option>
                                  <option value="BAN_BONG_BAY">Bắn bóng bay</option>
                                  <option value="TRIEU_PHU">Ai là triệu phú</option>
                                  <option value="ONG_TIM_MAT">Ong Tìm Mật</option>
                                  <option value="PHAN_LOAI">Phân Loại (Thùng rác)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Phân cách */}
                <hr className="border-slate-200" />

                {/* Câu hỏi có sẵn trong bài học */}
                <div>
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                    <ListChecks className="w-5 h-5 text-slate-500" />
                    Các câu hỏi khác trong bài học ({dangBaiList.filter(q => !selectedDangBais[q.dangBaiId]).length})
                  </h3>
                  
                  {dangBaiList.filter(q => !selectedDangBais[q.dangBaiId]).length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                      Không còn câu hỏi nào trong bài học này.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dangBaiList.filter(q => !selectedDangBais[q.dangBaiId]).map((q, idx) => {
                        let cauHinh: any = {};
                        let dapAnChuan: any = null;
                        try {
                          if (q.duLieuGame) cauHinh = JSON.parse(q.duLieuGame);
                          if (q.dapAnChuan) dapAnChuan = JSON.parse(q.dapAnChuan);
                        } catch { }

                        return (
                          <div key={q.dangBaiId} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition hover:border-blue-300">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <input 
                                  type="checkbox" 
                                  className="mt-1 w-4 h-4 cursor-pointer"
                                  checked={false}
                                  onChange={() => {
                                    const newSelections = { ...selectedDangBais };
                                    newSelections[q.dangBaiId] = 'MAC_DINH';
                                    setSelectedDangBais(newSelections);
                                  }}
                                />
                                <div>
                                  <div className="flex gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">{q.loaiNoiDung}</span>
                                  </div>
                                  <p className="text-sm font-medium text-slate-900 mb-2">{q.tenDangBai}</p>
                                  
                                  {/* Hiển thị chi tiết câu hỏi và đáp án */}
                                  <div className="mt-2 pl-4 border-l-2 border-slate-200 text-sm text-slate-600">
                                    {q.loaiNoiDung === 'H5P' ? (
                                      q.h5pNoiDungId ? (
                                        <button
                                          type="button"
                                          onClick={() => setPreviewH5P({ contentId: q.h5pNoiDungId, title: q.tenDangBai })}
                                          className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-700 font-medium text-sm transition cursor-pointer"
                                        >
                                          🎮 Xem toàn bộ nội dung H5P (câu hỏi &amp; đáp án)
                                        </button>
                                      ) : (
                                        <p className="text-red-600 font-medium">Nội dung H5P bị thiếu contentId, không xem trước được.</p>
                                      )
                                    ) : (
                                      <>
                                        <p className="font-semibold text-slate-800">{cauHinh.cauHoi || 'Không có nội dung câu hỏi'}</p>
                                        {cauHinh.luaChon && Array.isArray(cauHinh.luaChon) ? (
                                          <ul className="mt-2 space-y-1">
                                            {cauHinh.luaChon.map((choice: any, cIdx: number) => {
                                              const val = typeof choice === 'object' ? (choice.giaTri || choice.noiDung || choice.text || choice.content || choice.value || choice.id || JSON.stringify(choice)) : choice;
                                              const hinhAnh = typeof choice === 'object' ? choice.hinhAnh : null;
                                              const isCorrect = dapAnChuan !== null && (
                                                (typeof choice === 'object' && choice.id != null && (String(dapAnChuan) === String(choice.id) || String(dapAnChuan?.dapAnDungId) === String(choice.id))) ||
                                                (String(dapAnChuan) === String(cIdx) || String(dapAnChuan?.dapAnDungId) === String(cIdx)) ||
                                                (String(dapAnChuan) === String(val))
                                              );
                                              return (
                                                <li key={cIdx} className={cn("flex items-center gap-2", isCorrect ? "text-green-600 font-bold" : "")}>
                                                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", isCorrect ? "bg-green-500" : "bg-slate-300")} />
                                                  {hinhAnh ? (
                                                    <img src={hinhAnh} alt="choice" className="h-10 object-contain rounded border" />
                                                  ) : (
                                                    <span>{val}</span>
                                                  )}
                                                  {isCorrect && <span className="text-[10px] uppercase px-1.5 py-0.5 bg-green-100 text-green-700 rounded ml-2 shrink-0">Đáp án</span>}
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        ) : (
                                          dapAnChuan && (
                                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 font-semibold text-xs">
                                              Đáp án chuẩn: {typeof dapAnChuan === 'object' ? JSON.stringify(dapAnChuan) : dapAnChuan}
                                            </div>
                                          )
                                        )}
                                      </>
                                    )}
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button type="button" onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition disabled:opacity-50 cursor-pointer">
            <ChevronLeft className="w-5 h-5" /> Quay lại
          </button>
          
          <button type="button" onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition shadow-sm cursor-pointer">
            {currentStep === 2 ? 'Lưu & Giao bài' : 'Tiếp tục chọn câu hỏi'}
            {currentStep !== 2 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Popup xem toàn bộ nội dung H5P (câu hỏi + đáp án) trước khi giao bài */}
      <Modal
        isOpen={!!previewH5P}
        onClose={() => setPreviewH5P(null)}
        title={previewH5P?.title || 'Xem trước nội dung H5P'}
        widthClass="w-[90vw] max-w-4xl"
      >
        <div className="h-[70vh] p-4">
          {previewH5P && <H5PPlayer contentId={previewH5P.contentId} />}
        </div>
      </Modal>
    </div>
  );
}
