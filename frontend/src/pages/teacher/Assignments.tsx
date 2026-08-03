import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Bot, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { teacherService } from '../../services/teacher.service';
import type { ClassRoom, Material, Subject } from '../../services/teacher.service';
import { useAuthStore } from '../../stores/useAuthStore';

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

export default function TeacherAssignments() {
  const user = useAuthStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const [targetType, setTargetType] = useState('toan-lop');
  const [showAI, setShowAI] = useState(false);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [deadline, setDeadline] = useState('');
  const [maxResubmitCount, setMaxResubmitCount] = useState<number>(0);
  const [assignmentType, setAssignmentType] = useState('TU_LUAN');

  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [h5pMaterials, setH5pMaterials] = useState<Material[]>([]);
  const [selectedHocLieuId, setSelectedHocLieuId] = useState<number | ''>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [quizSubjectId, setQuizSubjectId] = useState<number | ''>('');
  const [quizSlots, setQuizSlots] = useState<any[]>([]);
  const [selectedDangBaiId, setSelectedDangBaiId] = useState<number | ''>('');
  const [isLoadingQuizSlots, setIsLoadingQuizSlots] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classData, materialData, subjectData] = await Promise.all([
          teacherService.getClasses(),
          user?.userId ? teacherService.getMaterials(user.userId) : Promise.resolve([]),
          teacherService.getSubjects(),
        ]);
        setClasses(classData);
        if (classData.length > 0) setSelectedClassId(classData[0].id);
        setH5pMaterials(materialData.filter((m) => m.h5pContentId));
        setSubjects(subjectData);

        const prefillHocLieuId = searchParams.get('hocLieuId');
        if (prefillHocLieuId) {
          setAssignmentType('H5P');
          setSelectedHocLieuId(Number(prefillHocLieuId));
        }
      } catch (err) {
        console.error('Lỗi tải danh sách lớp', err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (assignmentType !== 'TRAC_NGHIEM' || !quizSubjectId || !selectedClassId) {
      setQuizSlots([]);
      return;
    }
    const selectedClass = classes.find((c) => c.id === selectedClassId);
    if (!selectedClass) return;
    setIsLoadingQuizSlots(true);
    teacherService
      .getQuizSlots(quizSubjectId as number, selectedClass.grade)
      .then((slots) => setQuizSlots(slots.filter((s) => s.hasContent)))
      .catch(() => setQuizSlots([]))
      .finally(() => setIsLoadingQuizSlots(false));
  }, [assignmentType, quizSubjectId, selectedClassId, classes]);

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
    if (assignmentType === 'H5P' && !selectedHocLieuId) {
      setSubmitStatus('error');
      setErrorMsg('Vui lòng chọn học liệu H5P cho bài tập này!');
      return;
    }
    if (assignmentType === 'TRAC_NGHIEM' && !selectedDangBaiId) {
      setSubmitStatus('error');
      setErrorMsg('Vui lòng chọn bài quiz bộ sách cho bài tập này!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMsg('');

    try {
      await teacherService.createAssignment({
        title: taskTitle,
        description: taskDesc,
        classId: selectedClassId as number,
        teacherId: user?.userId ?? 0,
        type: assignmentType,
        deadline: new Date(deadline).toISOString(),
        maxResubmitCount,
        hocLieuId: assignmentType === 'H5P' ? (selectedHocLieuId as number) : undefined,
        contentNodeId: assignmentType === 'TRAC_NGHIEM' ? (selectedDangBaiId as number) : undefined,
      });
      setSubmitStatus('success');
      setTaskTitle('');
      setTaskDesc('');
      setDeadline('');
      setSelectedDangBaiId('');
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
              <option value="H5P">Bài tập H5P (Tự động chấm)</option>
              <option value="TRAC_NGHIEM">Bài tập bộ sách (Trắc nghiệm/Nối cặp/Điền khuyết - tự động chấm)</option>
            </select>
          </div>

          {assignmentType === 'H5P' && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn học liệu H5P</label>
              {h5pMaterials.length === 0 ? (
                <p className="text-sm text-slate-500 italic p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  Bạn chưa có học liệu H5P nào. Vào "Kho Học Liệu" để soạn bài trước.
                </p>
              ) : (
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={selectedHocLieuId}
                  onChange={(e) => setSelectedHocLieuId(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">-- Chọn học liệu --</option>
                  {h5pMaterials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}{m.grade ? ` (Khối ${m.grade})` : ''}{m.subjectName ? ` - ${m.subjectName}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {assignmentType === 'TRAC_NGHIEM' && (
            <div className="pt-2 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Môn học</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={quizSubjectId}
                  onChange={(e) => { setQuizSubjectId(e.target.value ? Number(e.target.value) : ''); setSelectedDangBaiId(''); }}
                >
                  <option value="">-- Chọn môn học --</option>
                  {subjects.map((s) => (
                    <option key={s.monHocId} value={s.monHocId}>{s.tenMon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn bài quiz bộ sách</label>
                {isLoadingQuizSlots ? (
                  <div className="flex items-center gap-2 text-slate-500 text-sm p-3">
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                  </div>
                ) : !quizSubjectId ? (
                  <p className="text-sm text-slate-500 italic p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                    Chọn môn học trước để xem danh sách bài quiz đã soạn.
                  </p>
                ) : quizSlots.length === 0 ? (
                  <p className="text-sm text-slate-500 italic p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                    Chưa có bài quiz nào được soạn cho môn/khối này. Vào "Kho Học Liệu" &gt; "Soạn quiz bộ sách" để soạn trước.
                  </p>
                ) : (
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                    value={selectedDangBaiId}
                    onChange={(e) => setSelectedDangBaiId(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">-- Chọn bài --</option>
                    {quizSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>{slot.tenChuDe} - {slot.tenDangBai} ({slot.loai})</option>
                    ))}
                  </select>
                )}
              </div>
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
                      {cls.name} - Khối {cls.grade} ({cls.academicYear})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Hạn chót (Deadline)" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <div className="flex items-center gap-3 pt-6">
              <label htmlFor="maxResubmit" className="text-sm font-medium text-slate-700 cursor-pointer w-48">
                Số lần nộp lại tối đa (0 = không giới hạn)
              </label>
              <input
                type="number"
                id="maxResubmit"
                className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm"
                value={maxResubmitCount}
                min={0}
                onChange={(e) => setMaxResubmitCount(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => { setTaskTitle(''); setTaskDesc(''); setDeadline(''); setSelectedHocLieuId(''); setSubmitStatus('idle'); }}>
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
