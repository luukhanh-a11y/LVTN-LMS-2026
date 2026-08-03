import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Loader2, Star, Gem, Send } from 'lucide-react';
import { studentService } from '../../services/student.service';
import toast from 'react-hot-toast';

interface QuizDetail {
  assignmentId: number;
  title: string;
  loai: 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET';
  cauHinh: any;
  allowResubmit: boolean;
  maxResubmitCount: number;
  attemptsUsed: number;
  canSubmit: boolean;
  deadline: string | null;
  isPastDeadline: boolean;
}

interface SubmissionResult {
  score: number;
  xpEarned: number;
  totalXp: number;
  status: string;
  isLate: boolean;
}

export default function AssignmentQuizPlayer() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<QuizDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trắc nghiệm
  const [dapAnDungId, setDapAnDungId] = useState('');
  // Nối cặp
  const [capChon, setCapChon] = useState<Record<string, string>>({});
  // Điền khuyết
  const [traLoiTheoCho, setTraLoiTheoCho] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!assignmentId) return;
    studentService.getQuizAssignmentDetail(Number(assignmentId))
      .then(setDetail)
      .catch((err) => setLoadError(err.response?.data?.message || 'Không tải được bài tập.'))
      .finally(() => setIsLoading(false));
  }, [assignmentId]);

  const handleSubmit = async () => {
    if (!detail || !assignmentId) return;

    let baiLam: Record<string, unknown>;
    if (detail.loai === 'TRAC_NGHIEM') {
      if (!dapAnDungId) {
        toast.error('Vui lòng chọn 1 đáp án.');
        return;
      }
      baiLam = { dapAnDungId };
    } else if (detail.loai === 'NOI_CAP') {
      const capArr = Object.entries(capChon).map(([traiId, phaiId]) => ({ traiId, phaiId }));
      if (capArr.length < (detail.cauHinh.cotTrai?.length ?? 0)) {
        toast.error('Vui lòng nối đủ tất cả các mục.');
        return;
      }
      baiLam = { capChon: capArr };
    } else {
      const cho = detail.cauHinh.danhSachCho || [];
      if (cho.some((c: any) => !traLoiTheoCho[c.id]?.trim())) {
        toast.error('Vui lòng điền đủ tất cả các chỗ trống.');
        return;
      }
      baiLam = { traLoiTheoCho };
    }

    setIsSubmitting(true);
    try {
      const res = await studentService.submitQuizAssignment(Number(assignmentId), baiLam);
      setResult(res);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi nộp bài.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-student-primary" />
      </div>
    );
  }

  if (loadError || !detail) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
        <p className="text-slate-600 mb-4">{loadError || 'Không tìm thấy bài tập.'}</p>
        <Link to="/student/tasks" className="text-student-primary font-bold hover:underline">
          Quay lại danh sách bài tập
        </Link>
      </div>
    );
  }

  if (!detail.canSubmit && !result) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
        <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
        <p className="text-slate-700 font-bold mb-1">Bạn đã hết lượt làm bài này.</p>
        <p className="text-slate-500 mb-4">Đã dùng {detail.attemptsUsed}/{detail.maxResubmitCount} lượt.</p>
        <Link to="/student/tasks" className="text-student-primary font-bold hover:underline">
          Quay lại danh sách bài tập
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-4">
          <Link to="/student/tasks" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-student-primary hover:border-student-primary/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bài tập Quiz bộ sách</span>
            <h2 className="text-lg font-black text-slate-800">{detail.title}</h2>
          </div>
        </div>
        {detail.isPastDeadline && !result && (
          <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold text-sm">
            Đã quá hạn nộp — bài sẽ được đánh dấu nộp trễ
          </div>
        )}
      </div>

      <div className="flex-1 bg-slate-100 p-6 flex justify-center items-center relative">
        <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5 transition-all duration-500 ${result ? 'scale-95 opacity-50 blur-sm' : ''}`}>
          <p className="text-lg font-bold text-slate-800">{detail.cauHinh.cauHoi}</p>

          {detail.loai === 'TRAC_NGHIEM' && (
            <div className="space-y-2">
              {(detail.cauHinh.luaChon || []).map((lc: any) => (
                <label key={lc.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${dapAnDungId === lc.id ? 'border-student-primary bg-student-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="dapAn" checked={dapAnDungId === lc.id} onChange={() => setDapAnDungId(lc.id)} />
                  <span className="text-slate-700">{lc.noiDung}</span>
                </label>
              ))}
            </div>
          )}

          {detail.loai === 'NOI_CAP' && (
            <div className="space-y-3">
              {(detail.cauHinh.cotTrai || []).map((t: any) => (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="flex-1 font-medium text-slate-700">{t.noiDung}</span>
                  <select
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-student-primary text-sm"
                    value={capChon[t.id] || ''}
                    onChange={(e) => setCapChon((prev) => ({ ...prev, [t.id]: e.target.value }))}
                  >
                    <option value="">-- Chọn --</option>
                    {(detail.cauHinh.cotPhai || []).map((p: any) => (
                      <option key={p.id} value={p.id}>{p.noiDung}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {detail.loai === 'DIEN_KHUYET' && (
            <div className="space-y-3">
              {(detail.cauHinh.danhSachCho || []).map((c: any) => (
                <div key={c.id} className="flex flex-wrap items-center gap-2 text-slate-700">
                  <span>{c.vanBanTruoc}</span>
                  <input
                    className="w-28 px-2 py-1 border border-slate-300 rounded-lg outline-none focus:border-student-primary text-sm text-center"
                    value={traLoiTheoCho[c.id] || ''}
                    onChange={(e) => setTraLoiTheoCho((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  />
                  <span>{c.vanBanSau}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 bg-student-primary text-white font-bold rounded-xl hover:bg-[#3A82DF] transition-colors disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
            Nộp bài
          </button>
        </div>

        {result && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-300 max-w-sm">
              <h1 className="text-3xl font-bold text-amber-500 mb-2">Giỏi Quá!</h1>
              <p className="text-slate-600 font-medium mb-2">Em đã hoàn thành bài tập này.</p>
              <p className="text-slate-500 text-sm mb-6">Điểm: <span className="font-bold text-slate-800">{result.score}/10</span></p>

              {result.xpEarned > 0 && (
                <div className="flex justify-center items-end space-x-2 mb-6">
                  <Star className="w-16 h-16 animate-bounce delay-75 text-yellow-400 fill-yellow-400" />
                  <Star className="w-20 h-20 animate-bounce text-yellow-400 fill-yellow-400" />
                  <Star className="w-16 h-16 animate-bounce delay-150 text-yellow-400 fill-yellow-400" />
                </div>
              )}

              <div className="inline-flex items-center justify-center bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl w-full mb-6">
                <span className="text-slate-600 font-semibold mr-3">Phần thưởng:</span>
                <Gem className="w-6 h-6 mr-2 text-cyan-500 fill-cyan-100" />
                <span className="text-2xl font-bold text-amber-500">+{result.xpEarned}</span>
              </div>

              {result.isLate && (
                <p className="text-red-500 text-xs font-bold mb-4">Bài nộp trễ hạn</p>
              )}

              <button
                onClick={() => navigate('/student/tasks')}
                className="w-full bg-student-primary hover:bg-[#3A82DF] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Tiếp tục hành trình
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
