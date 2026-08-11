import { useState, useEffect } from 'react';
import { Send, Bot, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { teacherService, type ClassRoom } from '../../services/teacher.service';
import { useAcademicStore } from '../../stores/useAcademicStore';

// Gợi ý yêu cầu bài tập theo từ khóa trong tiêu đề — quy tắc dựa dữ liệu thật (tiêu đề
// GV nhập), không gọi API AI ngoài (dự án hiện chưa có credentials cho dịch vụ AI trả phí).
function suggestDescription(title: string): string {
  const t = title.toLowerCase();
  if (/con vật|vật nuôi|thú cưng|chó|mèo/.test(t)) {
    return `Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) miêu tả "${title}". Hãy tập trung miêu tả về: hình dáng, bộ lông, và một thói quen đáng yêu của nó nhé!`;
  }
  if (/gia đình|bố|mẹ|ông|bà|anh|chị|em/.test(t)) {
    return `Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) về "${title}". Hãy kể tên các thành viên, công việc của mỗi người, và một kỷ niệm đáng nhớ của cả nhà nhé!`;
  }
  if (/cây|hoa|vườn|trái cây|quả/.test(t)) {
    return `Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) miêu tả "${title}". Hãy tả hình dáng, màu sắc, và lý do vì sao con thích nó nhé!`;
  }
  if (/trường|lớp|cô giáo|thầy giáo|bạn bè/.test(t)) {
    return `Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) về "${title}". Hãy kể lại một hoạt động hoặc kỷ niệm vui ở trường/lớp nhé!`;
  }
  if (/mùa|xuân|hè|thu|đông/.test(t)) {
    return `Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) miêu tả "${title}". Hãy tả thời tiết, cảnh vật, và cảm xúc của con trong mùa này nhé!`;
  }
  return `Các con hãy viết một đoạn văn ngắn (từ 5-7 câu) về chủ đề "${title}". Hãy nêu rõ suy nghĩ, cảm xúc và ví dụ cụ thể của con nhé!`;
}

// Giao diện hỗ trợ theo từng dạng bài — đồng bộ với bảng mapping ở
// frontend/src/pages/admin/components/GameAuthoringForm.tsx (soạn nội dung).
const GIAO_DIEN_THEO_LOAI: Record<string, { value: string; label: string }[]> = {
  TRAC_NGHIEM: [
    { value: 'MAC_DINH', label: 'Trắc nghiệm chuẩn' },
    { value: 'DAO_VANG', label: 'Đào Vàng' },
    { value: 'DUOI_BAT', label: 'Đuổi Bắt' },
    { value: 'THU_HOACH_NONG_SAN', label: 'Thu hoạch Nông sản' },
    { value: 'ECH_QUA_SONG', label: 'Ếch qua sông' },
    { value: 'BAN_BONG_BAY', label: 'Bắn bóng bay' },
    { value: 'TRIEU_PHU', label: 'Ai là triệu phú' },
  ],
  NOI_CAP: [
    { value: 'MAC_DINH', label: 'Nối cặp (Kéo dây)' },
    { value: 'PHAN_LOAI', label: 'Phân loại (Kéo thả vào thùng)' },
  ],
  DIEN_KHUYET: [
    { value: 'MAC_DINH', label: 'Nhập liệu chuẩn' },
    { value: 'ONG_TIM_MAT', label: 'Game Ong Tìm Mật' },
  ],
  LY_THUYET: [{ value: 'MAC_DINH', label: 'Mặc định' }],
  TU_LUAN: [{ value: 'MAC_DINH', label: 'Mặc định' }],
};

function parseLoaiDangBai(dangBai: any): string {
  try {
    const parsed = JSON.parse(dangBai.duLieuGame || '{}');
    return parsed.loai || 'TRAC_NGHIEM';
  } catch {
    return 'TRAC_NGHIEM';
  }
}

export default function TeacherAssignments() {
  const currentHocKyId = useAcademicStore((state) => state.currentHocKyId);

  const [targetType, setTargetType] = useState('toan-lop');
  const [showAI, setShowAI] = useState(false);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [selectedMonHocId, setSelectedMonHocId] = useState<number | ''>('');
  const [deadline, setDeadline] = useState('');
  const [maxResubmitCount, setMaxResubmitCount] = useState<number>(0);
  const [assignmentType, setAssignmentType] = useState('TU_LUAN');

  const [teacherProfile, setTeacherProfile] = useState<{ giaoVienId: number } | null>(null);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Chuỗi Sách bài tập → Chủ đề → Bài học → Dạng bài (đúng bộ môn giáo viên được phân công)
  const [sachList, setSachList] = useState<any[]>([]);
  const [selectedSachId, setSelectedSachId] = useState<number | ''>('');
  const [isLoadingSach, setIsLoadingSach] = useState(false);

  const [chuDeList, setChuDeList] = useState<any[]>([]);
  const [selectedChuDeId, setSelectedChuDeId] = useState<number | ''>('');
  const [isLoadingChuDe, setIsLoadingChuDe] = useState(false);

  const [baiHocList, setBaiHocList] = useState<any[]>([]);
  const [selectedBaiHocId, setSelectedBaiHocId] = useState<number | ''>('');
  const [isLoadingBaiHoc, setIsLoadingBaiHoc] = useState(false);

  const [dangBaiList, setDangBaiList] = useState<any[]>([]);
  const [isLoadingDangBai, setIsLoadingDangBai] = useState(false);
  const [selectedDangBais, setSelectedDangBais] = useState<{ dangBaiId: number; thuTu: number; cheDoGiaoDien: string }[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const monHocOptions = selectedClass?.monHocList ?? [];
  const selectedMonHoc = monHocOptions.find((m) => m.monHocId === selectedMonHocId);

  // Nạp hồ sơ giáo viên + danh sách lớp được phân công (đã lọc theo học kỳ hiện tại)
  useEffect(() => {
    (async () => {
      try {
        const [profile, classData] = await Promise.all([
          teacherService.getMyTeacherProfile(),
          teacherService.getClasses(),
        ]);
        setTeacherProfile(profile);
        setClasses(classData);
        if (classData.length > 0) setSelectedClassId(classData[0].id);
      } catch (err) {
        console.error('Lỗi tải dữ liệu giáo viên/lớp học', err);
      } finally {
        setIsLoadingData(false);
      }
    })();
  }, []);

  // Khi đổi lớp: reset chuỗi chọn nội dung, tự chọn môn nếu lớp chỉ được phân công 1 môn
  useEffect(() => {
    const opts = classes.find((c) => c.id === selectedClassId)?.monHocList ?? [];
    setSelectedMonHocId(opts.length === 1 ? opts[0].monHocId : '');
    setSachList([]); setSelectedSachId('');
    setChuDeList([]); setSelectedChuDeId('');
    setBaiHocList([]); setSelectedBaiHocId('');
    setDangBaiList([]); setSelectedDangBais([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId]);

  // Chọn Sách bài tập đúng bộ môn/lớp/học kỳ giáo viên được phân công
  useEffect(() => {
    setSachList([]); setSelectedSachId('');
    setChuDeList([]); setSelectedChuDeId('');
    setBaiHocList([]); setSelectedBaiHocId('');
    setDangBaiList([]); setSelectedDangBais([]);
    if (assignmentType !== 'TRAC_NGHIEM' || !teacherProfile || !selectedClassId || !selectedMonHoc) return;

    setIsLoadingSach(true);
    teacherService
      .getSachBaiTapTheoPhanCong({
        giaoVienId: teacherProfile.giaoVienId,
        lopHocId: selectedClassId as number,
        maMon: selectedMonHoc.maMon,
        hocKyId: selectedMonHoc.hocKyId,
      })
      .then((list) => {
        setSachList(list);
        if (list.length === 1) setSelectedSachId(list[0].sachId);
      })
      .catch(() => setSachList([]))
      .finally(() => setIsLoadingSach(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentType, teacherProfile, selectedClassId, selectedMonHocId]);

  // Chọn Chủ đề trong sách
  useEffect(() => {
    setChuDeList([]); setSelectedChuDeId('');
    setBaiHocList([]); setSelectedBaiHocId('');
    setDangBaiList([]); setSelectedDangBais([]);
    if (!selectedSachId) return;
    setIsLoadingChuDe(true);
    teacherService
      .getChuDeBySach(selectedSachId as number)
      .then((list) => {
        setChuDeList(list);
        if (list.length === 1) setSelectedChuDeId(list[0].chuDeId);
      })
      .catch(() => setChuDeList([]))
      .finally(() => setIsLoadingChuDe(false));
  }, [selectedSachId]);

  // Chọn Bài học trong chủ đề
  useEffect(() => {
    setBaiHocList([]); setSelectedBaiHocId('');
    setDangBaiList([]); setSelectedDangBais([]);
    if (!selectedChuDeId) return;
    setIsLoadingBaiHoc(true);
    teacherService
      .getBaiHocByChuDe(selectedChuDeId as number)
      .then((list) => {
        setBaiHocList(list);
        if (list.length === 1) setSelectedBaiHocId(list[0].baiHocId);
      })
      .catch(() => setBaiHocList([]))
      .finally(() => setIsLoadingBaiHoc(false));
  }, [selectedChuDeId]);

  // Chọn Dạng bài cụ thể trong bài học
  useEffect(() => {
    setDangBaiList([]); setSelectedDangBais([]);
    if (!selectedBaiHocId) return;
    setIsLoadingDangBai(true);
    teacherService
      .getDangBaiByBaiHoc(selectedBaiHocId as number)
      .then((list) => setDangBaiList(list))
      .catch(() => setDangBaiList([]))
      .finally(() => setIsLoadingDangBai(false));
  }, [selectedBaiHocId]);

  const handleApplyAI = () => {
    setTaskDesc(suggestDescription(taskTitle || 'chủ đề bài tập'));
    setShowAI(false);
  };

  const handleSubmit = async () => {
    if (!selectedClassId || !taskTitle || !deadline) {
      setSubmitStatus('error');
      setErrorMsg('Vui lòng điền đầy đủ Tiêu đề, chọn Lớp và Hạn chót!');
      return;
    }
    if (!teacherProfile) {
      setSubmitStatus('error');
      setErrorMsg('Không xác định được hồ sơ giáo viên, vui lòng tải lại trang!');
      return;
    }
    if (assignmentType === 'TRAC_NGHIEM' && !selectedMonHoc) {
      setSubmitStatus('error');
      setErrorMsg('Vui lòng chọn môn học cho lớp này!');
      return;
    }
    if (assignmentType === 'TRAC_NGHIEM' && selectedDangBais.length === 0) {
      setSubmitStatus('error');
      setErrorMsg('Vui lòng tích chọn ít nhất một dạng bài trong sách cho bài tập này!');
      return;
    }

    // hocKyId là bắt buộc ở backend (BaiTap.hocKy, nullable=false) — với bài tự luận không có
    // sẵn từ chuỗi chọn sách, lấy từ môn/lớp đã chọn, hoặc học kỳ hiện tại làm mặc định.
    const hocKyId = selectedMonHoc?.hocKyId ?? currentHocKyId;
    if (!hocKyId) {
      setSubmitStatus('error');
      setErrorMsg('Không xác định được học kỳ hiện tại, vui lòng thử lại!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMsg('');

    try {
      await teacherService.createAssignment({
        baiTap: {
          tieuDe: taskTitle,
          moTa: taskDesc,
          lopHocId: selectedClassId as number,
          giaoVienId: teacherProfile.giaoVienId,
          hocKyId,
          loaiBaiTap: assignmentType,
          deadline: new Date(deadline).toISOString(),
          soLanNopLaiToiDa: maxResubmitCount,
          trangThai: 'DANG_GIAO'
        },
        danhSachChiTiet: assignmentType === 'TRAC_NGHIEM' ? selectedDangBais : []
      });
      setSubmitStatus('success');
      setTaskTitle('');
      setTaskDesc('');
      setDeadline('');
      setSelectedDangBais([]);
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMsg(err.response?.data?.message || 'Giao bài thất bại! Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">Giao bài tập mới</h1>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 font-semibold">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          Giao bài thành công! Học sinh đã có thể thấy bài tập mới.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 font-semibold">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          {errorMsg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nội dung bài tập</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Tiêu đề bài tập"
            placeholder="Nhập tiêu đề..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-slate-700">Mô tả bài tập / Yêu cầu tự luận</label>
              <button
                className="text-xs text-pro-primary font-bold flex items-center hover:bg-pro-primary/10 px-2 py-1 rounded"
                onClick={() => setShowAI(!showAI)}
              >
                <Bot className="w-4 h-4 mr-1" /> AI Đề xuất Yêu cầu
              </button>
            </div>

            {showAI && (
              <div className="mb-3 p-3 bg-pro-primary/10 border border-pro-primary/20 rounded-lg">
                <p className="text-sm text-pro-fg mb-2 font-medium">Gợi ý theo tiêu đề "{taskTitle || '...'}"</p>
                <div className="bg-white p-3 rounded border border-pro-primary/20 text-sm text-slate-700 leading-relaxed">
                  {taskTitle ? `"${suggestDescription(taskTitle)}"` : 'Vui lòng nhập tiêu đề bài tập trước để nhận gợi ý phù hợp.'}
                </div>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" variant="pro-primary" className="text-xs" onClick={handleApplyAI} disabled={!taskTitle}>
                    <Sparkles className="w-3 h-3 mr-1" /> Sử dụng đoạn này
                  </Button>
                </div>
              </div>
            )}

            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-24 resize-none"
              placeholder="Nhập mô tả hoặc yêu cầu cụ thể..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại bài tập</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
            >
              <option value="TU_LUAN">Bài tự luận (Chấm tay)</option>
              <option value="H5P" disabled>Bài tập H5P (đang nâng cấp, chưa khả dụng)</option>
              <option value="TRAC_NGHIEM">Bài tập bộ sách (Trắc nghiệm/Nối cặp/Điền khuyết - tự động chấm)</option>
            </select>
          </div>

          {assignmentType === 'TRAC_NGHIEM' && (
            <div className="pt-2 space-y-3">
              {!selectedClass ? (
                <p className="text-sm text-slate-500 italic p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  Vui lòng chọn Lớp học ở mục "Phân phối & Thời hạn" bên dưới trước.
                </p>
              ) : monHocOptions.length === 0 ? (
                <p className="text-sm text-slate-500 italic p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  Bạn chưa được phân công dạy môn nào ở lớp này trong học kỳ hiện tại.
                </p>
              ) : (
                <>
                  {monHocOptions.length > 1 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Môn học</label>
                      <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                        value={selectedMonHocId}
                        onChange={(e) => setSelectedMonHocId(e.target.value ? Number(e.target.value) : '')}
                      >
                        <option value="">-- Chọn môn học --</option>
                        {monHocOptions.map((m) => (
                          <option key={m.monHocId} value={m.monHocId}>{m.tenMon}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedMonHoc && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Sách bài tập</label>
                        {isLoadingSach ? (
                          <div className="flex items-center gap-2 text-slate-500 text-sm p-3">
                            <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                          </div>
                        ) : sachList.length === 0 ? (
                          <p className="text-sm text-slate-500 italic p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                            Chưa có sách bài tập nào cho đúng tổ hợp lớp/môn/học kỳ này.
                          </p>
                        ) : (
                          <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                            value={selectedSachId}
                            onChange={(e) => setSelectedSachId(e.target.value ? Number(e.target.value) : '')}
                          >
                            <option value="">-- Chọn sách --</option>
                            {sachList.map((s) => (
                              <option key={s.sachId} value={s.sachId}>{s.tenSach}</option>
                            ))}
                          </select>
                        )}
                      </div>

                      {selectedSachId && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Chủ đề</label>
                          {isLoadingChuDe ? (
                            <div className="flex items-center gap-2 text-slate-500 text-sm p-3">
                              <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                            </div>
                          ) : (
                            <select
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                              value={selectedChuDeId}
                              onChange={(e) => setSelectedChuDeId(e.target.value ? Number(e.target.value) : '')}
                            >
                              <option value="">-- Chọn chủ đề --</option>
                              {chuDeList.map((cd) => (
                                <option key={cd.chuDeId} value={cd.chuDeId}>{cd.tenChuDe}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}

                      {selectedChuDeId && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Bài học</label>
                          {isLoadingBaiHoc ? (
                            <div className="flex items-center gap-2 text-slate-500 text-sm p-3">
                              <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                            </div>
                          ) : (
                            <select
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                              value={selectedBaiHocId}
                              onChange={(e) => setSelectedBaiHocId(e.target.value ? Number(e.target.value) : '')}
                            >
                              <option value="">-- Chọn bài học --</option>
                              {baiHocList.map((bh) => (
                                <option key={bh.baiHocId} value={bh.baiHocId}>{bh.tenBaiHoc}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}

                      {selectedBaiHocId && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tích chọn dạng bài & cấu hình giao diện</label>
                          {isLoadingDangBai ? (
                            <div className="flex items-center gap-2 text-slate-500 text-sm p-3">
                              <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                            </div>
                          ) : dangBaiList.length === 0 ? (
                            <p className="text-sm text-slate-500 italic p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                              Bài học này chưa có dạng bài nào.
                            </p>
                          ) : (
                            <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                              {dangBaiList.map((db) => {
                                const loai = parseLoaiDangBai(db);
                                const giaoDienOptions = GIAO_DIEN_THEO_LOAI[loai] ?? GIAO_DIEN_THEO_LOAI.TRAC_NGHIEM;
                                const selectedItem = selectedDangBais.find((item) => item.dangBaiId === db.dangBaiId);
                                return (
                                  <div key={db.dangBaiId} className={`flex items-center justify-between p-2.5 bg-white border rounded-lg transition-all ${selectedItem ? 'border-blue-500 shadow-sm ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                                      <input
                                        type="checkbox"
                                        checked={!!selectedItem}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedDangBais([...selectedDangBais, { dangBaiId: db.dangBaiId, thuTu: selectedDangBais.length + 1, cheDoGiaoDien: giaoDienOptions[0].value }]);
                                          } else {
                                            setSelectedDangBais(selectedDangBais.filter((item) => item.dangBaiId !== db.dangBaiId));
                                          }
                                        }}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-sm font-medium text-slate-700">
                                        {db.tenDangBai} <span className="text-xs text-slate-400 font-normal">({loai})</span>
                                      </span>
                                    </label>
                                    {selectedItem && (
                                      <div className="flex items-center gap-2 text-xs">
                                        <span className="text-slate-500 font-medium">Giao diện:</span>
                                        <select
                                          value={selectedItem.cheDoGiaoDien}
                                          onChange={(e) => {
                                            const newMode = e.target.value;
                                            setSelectedDangBais(selectedDangBais.map((item) =>
                                              item.dangBaiId === db.dangBaiId ? { ...item, cheDoGiaoDien: newMode } : item
                                            ));
                                          }}
                                          className="px-2 py-1 bg-blue-50 border border-blue-300 text-blue-700 rounded font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                        >
                                          {giaoDienOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                          ))}
                                        </select>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân phối & Thời hạn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Giao cho</label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="target" checked={targetType === 'toan-lop'} onChange={() => setTargetType('toan-lop')} className="w-4 h-4 text-primary" />
                <span className="text-sm">Toàn lớp</span>
              </label>
            </div>

            {isLoadingData ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm p-4 bg-slate-50 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh sách lớp...
              </div>
            ) : classes.length === 0 ? (
              <p className="text-sm text-slate-500 italic p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                Bạn chưa được phân công giảng dạy lớp nào trong học kỳ hiện tại.
              </p>
            ) : (
              <div className="space-y-2 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <label className="block text-sm font-medium text-slate-700 mb-2">Chọn lớp học</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(Number(e.target.value))}
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}{cls.grade ? ` - Khối ${cls.grade}` : ''}{cls.academicYear ? ` (${cls.academicYear})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Hạn chót (Deadline)" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <div className="flex items-center gap-3 pt-6">
              <label htmlFor="maxResubmit" className="text-sm font-medium text-slate-700 cursor-pointer w-56">
                Số lần nộp lại tối đa (0 = không cho nộp lại, -1 = không giới hạn)
              </label>
              <input
                type="number"
                id="maxResubmit"
                className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm"
                value={maxResubmitCount}
                min={-1}
                onChange={(e) => setMaxResubmitCount(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => { setTaskTitle(''); setTaskDesc(''); setDeadline(''); setSubmitStatus('idle'); }}>
          Xóa form
        </Button>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          Giao bài ngay
        </Button>
      </div>
    </div>
  );
}
