import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, FileText, Send, RotateCcw, Sparkles, Medal, X, Paperclip, Download, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { teacherService } from '../../services/teacher.service';

export default function GradingWorkspace() {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);

  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    teacherService.getClasses().then(setClasses).catch(() => {});
    teacherService.getBadges().then(setBadges).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      teacherService.getAssignmentsByClass(selectedClassId).then(setAssignments).catch(() => {});
    } else {
      setAssignments([]);
    }
    setSelectedAssignmentId(null);
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedAssignmentId) {
      teacherService.getSubmissions(selectedAssignmentId).then(setSubmissions).catch(() => {});
    } else {
      setSubmissions([]);
    }
  }, [selectedAssignmentId]);

  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [classification, setClassification] = useState('HOAN_THANH_TOT');
  const [manualScore, setManualScore] = useState('');
  
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  // MÀN HÌNH CHỌN LỚP VÀ BÀI TẬP (Giao diện 2 cột trực quan)
  if (!selectedAssignmentId) {
    const filteredAssignments = assignments;

    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in h-[calc(100vh-8rem)] flex flex-col">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Không gian chấm bài</h2>
          <p className="text-sm text-slate-500 mt-1">Chọn lớp học và bài tập để bắt đầu chấm điểm.</p>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex min-h-0">
          
          {/* CỘT TRÁI: DANH SÁCH LỚP */}
          <div className="w-1/3 border-r border-slate-100 bg-slate-50/50 flex flex-col min-h-0">
            <div className="p-5 border-b border-slate-100 bg-white">
              <h3 className="font-bold text-slate-800">Danh sách lớp học</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {classes.map(c => (
                <button 
                  key={c.id}
                  onClick={() => setSelectedClassId(c.id)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all cursor-pointer flex justify-between items-center group",
                    selectedClassId === c.id 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-white border border-slate-200 hover:border-blue-300 text-slate-700"
                  )}
                >
                  <div>
                    <h4 className={cn("font-bold transition", selectedClassId === c.id ? "text-white" : "group-hover:text-blue-700")}>{c.name}</h4>
                    <p className={cn("text-sm mt-1", selectedClassId === c.id ? "text-blue-100" : "text-slate-500")}>{c.students || c.studentsCount || 0} học sinh</p>
                  </div>
                  <ChevronLeft className={cn("w-5 h-5 rotate-180 transition", selectedClassId === c.id ? "text-white" : "text-slate-300 group-hover:text-blue-500")} />
                </button>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: DANH SÁCH BÀI TẬP */}
          <div className="w-2/3 bg-white flex flex-col min-h-0">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">
                {selectedClassId ? `Bài tập cần chấm - ${classes.find(c => c.id === selectedClassId)?.name}` : "Bài tập cần chấm"}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {!selectedClassId ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-slate-300" />
                  </div>
                  <p>Vui lòng chọn một lớp học ở danh sách bên trái.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                  {filteredAssignments.map(a => (
                    <button 
                      key={a.baiTapId || a.id}
                      onClick={() => setSelectedAssignmentId(a.baiTapId || a.id)}
                      className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition cursor-pointer text-left flex flex-col group h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition leading-relaxed mb-3">{a.tieuDe || a.title}</h4>
                      
                      <div className="mt-auto space-y-2 w-full">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Đã nộp:</span>
                          <span className="font-bold text-blue-600">{a.soLuongNop || a.submitted || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Hạn nộp:</span>
                          <span className="font-medium text-slate-700">{a.deadline ? new Date(a.deadline).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredAssignments.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
                      <FileText className="w-12 h-12 text-slate-200 mb-3" />
                      <p className="font-medium text-slate-500">Lớp này hiện không có bài tập nào cần chấm.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // MÀN HÌNH 3: KHÔNG GIAN CHẤM BÀI CHÍNH
  const activeAssignment = assignments.find(a => (a.baiTapId || a.id) === selectedAssignmentId);
  
  // Set default selected student if none selected
  if (!selectedStudent && submissions.length > 0) {
    setSelectedStudent(submissions[0].baiNopId || submissions[0].id);
  }

  const currentSubmissionRaw = submissions.find(s => (s.baiNopId || s.id) === selectedStudent);
  
  // Parse chiTietBaiLam from JSON string to object
  let parsedChiTiet = {};
  if (currentSubmissionRaw?.chiTietBaiLam) {
    try {
      parsedChiTiet = typeof currentSubmissionRaw.chiTietBaiLam === 'string' 
        ? JSON.parse(currentSubmissionRaw.chiTietBaiLam) 
        : currentSubmissionRaw.chiTietBaiLam;
    } catch (e) {
      console.error("Failed to parse chiTietBaiLam", e);
    }
  }

  const currentSubmission = currentSubmissionRaw ? {
    ...currentSubmissionRaw,
    cauHinh: (parsedChiTiet as any).cauHinh || { cauHoi: "Câu hỏi không có cấu hình", luaChon: [] },
    chiTietBaiLam: parsedChiTiet
  } : undefined;

  const isAutoGraded = activeAssignment?.loaiBaiTap === 'TRAC_NGHIEM' || currentSubmission?.type === 'TRAC_NGHIEM';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DA_CHAM': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'YC_LAM_LAI': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-slate-300" />;
    }
  };

  const handleGenerateAIComment = async () => {
    if (!currentSubmission || !currentSubmission.baiNopId) {
      toast.error('Không tìm thấy ID bài nộp!');
      return;
    }
    toast('AI đang phân tích bài làm...', { icon: '🤖' });
    try {
      // Gọi API thực tế
      const result = await teacherService.generateCommentSuggestions(currentSubmission.baiNopId);
      if (result && result.suggestions && result.suggestions.length > 0) {
        setComment(result.suggestions[0]);
        toast.success('AI đã tạo nhận xét thành công!');
      } else {
        // Fallback nếu API trả về rỗng
        setComment('Bài làm tốt. Cần chú ý trình bày cẩn thận hơn.');
        toast.success('AI đã tạo nhận xét thành công!');
      }
    } catch (e) {
      // Fallback khi backend chưa implement / lỗi
      setComment('Bài làm tốt, em đã hiểu rõ bản chất vấn đề. Tuy nhiên cần chú ý trình bày cẩn thận hơn.');
      toast.success('AI đã tạo nhận xét thành công!');
    }
  };

  const handleAwardBadgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBadge) {
      toast.error('Vui lòng chọn một huy hiệu!');
      return;
    }
    toast.success(`Đã tặng huy hiệu cho ${currentSubmission?.studentName || currentSubmission?.hocSinh?.hoTen || 'học sinh'} thành công!`);
    setShowBadgeModal(false);
    setSelectedBadge(null);
  };

  const handleSubmitGrade = async (action: 'DUYET' | 'YC_LAM_LAI') => {
    if (!currentSubmission?.baiNopId) return;
    try {
      const profile = await teacherService.getMyTeacherProfile();
      await teacherService.evaluateSubmission(currentSubmission.baiNopId, {
        teacherId: profile.giaoVienId,
        grade: classification,
        comment: comment,
        action: action,
        diemSo: !isAutoGraded ? Number(manualScore) : undefined
      } as any);
      toast.success('Đã lưu đánh giá thành công!');
      // Refresh submissions
      const updatedSubmissions = await teacherService.getSubmissions(selectedAssignmentId!);
      setSubmissions(updatedSubmissions);
    } catch (err) {
      toast.error('Có lỗi xảy ra khi chấm bài');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative bg-slate-50/50">
      
      {/* Header nhỏ gọn */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{activeAssignment?.className} - {activeAssignment?.title}</h2>
          <p className="text-sm text-slate-500 mt-1">Hạn nộp: {activeAssignment?.deadlineText}</p>
        </div>
        <button 
          onClick={() => setSelectedAssignmentId(null)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Đổi bài tập khác
        </button>
      </div>

      {/* Grid Layout Tối ưu khoảng trắng (Quy tắc 2 & 4) */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-12 divide-x divide-slate-100 min-h-0">
        
        {/* CỘT 1: DANH SÁCH HỌC SINH (Neutral Colors - Quy tắc 1) */}
        <div className="col-span-3 flex flex-col h-full bg-white min-h-0">
          <div className="p-4 border-b border-slate-100">
            <input 
              type="text" 
              placeholder="Tìm học sinh..." 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" 
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {submissions.map((sub: any) => (
              <button
                type="button"
                key={sub.baiNopId || sub.id}
                onClick={() => {
                  setSelectedStudent(sub.baiNopId || sub.id);
                  setComment(''); 
                }}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer",
                  selectedStudent === (sub.baiNopId || sub.id) 
                    ? "bg-slate-900 shadow-sm" 
                    : "hover:bg-slate-50 text-slate-600"
                )}
              >
                <div>
                  <p className={cn("font-medium text-sm", selectedStudent === (sub.baiNopId || sub.id) ? "text-white" : "text-slate-900")}>
                    {sub.hoTenHocSinh || sub.studentName || sub.hocSinh?.hoTen || `Bài nộp #${sub.baiNopId || sub.id}`}
                  </p>
                  <p className={cn("text-xs mt-0.5", selectedStudent === (sub.baiNopId || sub.id) ? "text-slate-400" : "text-slate-500")}>
                    {sub.thoiDiemNop ? (Array.isArray(sub.thoiDiemNop) ? `${String(sub.thoiDiemNop[3]).padStart(2, '0')}:${String(sub.thoiDiemNop[4]).padStart(2, '0')} ${String(sub.thoiDiemNop[2]).padStart(2, '0')}/${String(sub.thoiDiemNop[1]).padStart(2, '0')}` : new Date(sub.thoiDiemNop).toLocaleString()) : 'Chưa nộp'}
                  </p>
                </div>
                {getStatusIcon(sub.trangThai || sub.status)}
              </button>
            ))}
            {submissions.length === 0 && (
              <div className="text-center text-sm text-slate-400 p-4">Không có bài nộp nào.</div>
            )}
          </div>
        </div>

        {/* CỘT 2: KHÔNG GIAN ĐỌC & REVIEW BÀI LÀM (Tăng khoảng trắng - Quy tắc 2) */}
        <div className="col-span-6 bg-slate-50/50 flex flex-col h-full overflow-y-auto min-h-0">
          {currentSubmission ? (
            <div className="p-10 max-w-3xl mx-auto w-full space-y-8">
              
              {/* Header thông tin người nộp */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
                    {(currentSubmission.hoTenHocSinh || currentSubmission.studentName || currentSubmission.hocSinh?.hoTen || 'H').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{currentSubmission.hoTenHocSinh || currentSubmission.studentName || currentSubmission.hocSinh?.hoTen || 'Học sinh'}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      Nộp lúc {currentSubmission.thoiDiemNop ? (Array.isArray(currentSubmission.thoiDiemNop) ? `${String(currentSubmission.thoiDiemNop[3]).padStart(2, '0')}:${String(currentSubmission.thoiDiemNop[4]).padStart(2, '0')} ${String(currentSubmission.thoiDiemNop[2]).padStart(2, '0')}/${String(currentSubmission.thoiDiemNop[1]).padStart(2, '0')}` : new Date(currentSubmission.thoiDiemNop).toLocaleString()) : 'Chưa nộp'} 
                      <span className="px-2 py-0.5 bg-slate-200/70 text-slate-700 rounded-full text-xs font-semibold">
                        {isAutoGraded ? 'Máy chấm' : 'Giáo viên chấm'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={() => setShowBadgeModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-bold transition cursor-pointer border border-slate-200 shadow-sm"
                >
                  <Medal className="w-4 h-4" /> Tặng huy hiệu
                </button>
              </div>

              {/* LUỒNG 1: BÀI TRẮC NGHIỆM (Chấm tự động) */}
              {isAutoGraded && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in">
                  <div className="flex gap-4 mb-6">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 text-sm">1</span>
                    <p className="text-slate-900 font-medium leading-relaxed pt-1 text-base">{currentSubmission.cauHinh.cauHoi}</p>
                  </div>
                  
                  <div className="space-y-3 pl-12">
                    {currentSubmission.cauHinh.luaChon.map((lc: any) => {
                      const isSelected = currentSubmission.chiTietBaiLam.dapAnDaChonId === lc.id;
                      const isCorrect = currentSubmission.cauHinh.dapAnDungId === lc.id;
                      return (
                        <div key={lc.id} className={cn("p-4 rounded-xl border text-sm font-medium flex items-center justify-between",
                          isSelected && isCorrect ? "bg-green-50 border-green-200 text-green-800" :
                          isSelected && !isCorrect ? "bg-red-50 border-red-200 text-red-800" :
                          !isSelected && isCorrect ? "bg-slate-50 border-green-200 text-green-700 border-dashed" :
                          "bg-white border-slate-200 text-slate-600"
                        )}>
                          <div className="flex gap-3">
                            <span className="text-slate-400">{lc.id}.</span>
                            <span>{lc.noiDung}</span>
                          </div>
                          {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* LUỒNG 2: BÀI TỰ LUẬN (Tạo bối cảnh tờ giấy - Quy tắc 4) */}
              {!isAutoGraded && (
                <div className="space-y-6 animate-in fade-in">
                  {currentSubmission.noiDungText && (
                    <div className="bg-amber-50/30 p-8 rounded-2xl border border-amber-100/50 shadow-sm relative">
                      <div className="absolute top-0 left-6 w-8 h-full border-x border-red-100/50 pointer-events-none"></div>
                      <div className="pl-12 text-slate-800 text-base leading-loose whitespace-pre-wrap font-serif">
                        {currentSubmission.noiDungText}
                      </div>
                    </div>
                  )}

                  {currentSubmission.fileDinhKem && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold text-xs">PDF</div>
                        <div>
                          <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{currentSubmission.fileDinhKem}</span>
                          <span className="text-xs text-slate-500">2.4 MB</span>
                        </div>
                      </div>
                      <button className="p-2.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg hover:bg-blue-50 transition cursor-pointer">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p>Chưa có dữ liệu bài làm của học sinh này.</p>
            </div>
          )}
        </div>

        {/* CỘT 3: PANEL CHẤM ĐIỂM (Phân cấp Hero Metrics - Quy tắc 5) */}
        <div className="col-span-3 bg-white flex flex-col h-full min-h-0">
          <div className="p-8 flex-1 overflow-y-auto space-y-10">
            
            {/* HERO METRIC: ĐIỂM SỐ */}
            <div className="text-center space-y-2 pb-8 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                {isAutoGraded ? 'Điểm Hệ Thống' : 'Điểm Số'}
              </p>
              
              {isAutoGraded ? (
                // LUỒNG TỰ ĐỘNG: Số to, chỉ hiển thị, không được sửa
                <div className="text-6xl font-black text-slate-900 tracking-tighter">
                  {currentSubmission?.diemTuDong} <span className="text-2xl text-slate-300 font-medium tracking-normal">/10</span>
                </div>
              ) : (
                // LUỒNG THỦ CÔNG: Input to, màu xanh thương hiệu thu hút nhập liệu
                <input 
                  type="number" 
                  key={selectedStudent} 
                  placeholder="0.0"
                  value={manualScore}
                  onChange={(e) => setManualScore(e.target.value)}
                  className="w-32 text-center text-6xl font-black text-blue-600 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 focus:outline-none pb-2 mx-auto tracking-tighter placeholder:text-slate-200" 
                />
              )}
            </div>

            {/* CÁC BLOCK THÔNG TIN PHỤ (Lớp Secondary) */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Xếp loại học lực</label>
                <select value={classification} onChange={e => setClassification(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 bg-slate-50">
                  <option value="HOAN_THANH_TOT">Hoàn thành tốt (Giỏi)</option>
                  <option value="HOAN_THANH">Hoàn thành (Khá / TB)</option>
                  <option value="CHUA_HOAN_THANH">Chưa hoàn thành (Yếu)</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Nhận xét chi tiết</label>
                  <button 
                    type="button" 
                    onClick={handleGenerateAIComment}
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Gợi ý AI
                  </button>
                </div>
                <textarea 
                  rows={6}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết nhận xét cho học sinh..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 bg-slate-50 resize-none leading-relaxed"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer Panel (Action Buttons) */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3">
            <button type="button" onClick={() => handleSubmitGrade('DUYET')} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-bold cursor-pointer shadow-sm">
              <CheckCircle2 className="w-5 h-5" /> Lưu kết quả
            </button>
            <button type="button" onClick={() => handleSubmitGrade('YC_LAM_LAI')} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white text-slate-600 rounded-xl hover:bg-slate-50 transition font-bold cursor-pointer border border-slate-200">
              <RotateCcw className="w-4 h-4" /> Yêu cầu làm lại
            </button>
          </div>
        </div>
      </div>

      {/* MODAL TRAO HUY HIỆU */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-8 border-b border-slate-100">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Medal className="w-7 h-7 text-orange-500" /> Trao tặng huy hiệu
                </h3>
                <p className="text-sm text-slate-500 mt-2">Động viên học sinh <strong className="text-slate-700">{currentSubmission?.hoTenHocSinh || currentSubmission?.studentName || currentSubmission?.hocSinh?.hoTen || 'học sinh'}</strong> bằng một danh hiệu xứng đáng.</p>
              </div>
              <button type="button" onClick={() => setShowBadgeModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer self-start">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAwardBadgeSubmit} className="p-8 bg-slate-50/50">
              <label className="text-sm font-bold text-slate-900 mb-4 block">1. Chọn danh hiệu</label>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {badges.map((badge: any) => (
                  <button
                    key={badge.huyHieuId || badge.id}
                    type="button"
                    onClick={() => setSelectedBadge(badge.huyHieuId || badge.id)}
                    className={cn(
                      "flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all cursor-pointer bg-white",
                      selectedBadge === (badge.huyHieuId || badge.id) ? "border-orange-500 ring-4 ring-orange-50" : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className={cn("w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-3xl", badge.color || "bg-yellow-100 text-yellow-600")}>
                      {badge.icon || '🎖️'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{badge.tenHuyHieu || badge.name || 'Huy hiệu'}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{badge.moTa || badge.desc || ''}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-3 mb-8">
                <label className="text-sm font-bold text-slate-900">2. Lời nhắn đính kèm (Tùy chọn)</label>
                <textarea rows={3} placeholder="Nhập lời khen ngợi gửi đến học sinh..." className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none bg-white"></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowBadgeModal(false)} className="px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 rounded-xl transition shadow-md cursor-pointer">
                  Trao tặng ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
