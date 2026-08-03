import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Loader2, Star, Gem } from 'lucide-react';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import { studentService } from '../../services/student.service';
import toast from 'react-hot-toast';

interface AssignmentDetail {
  assignmentId: number;
  title: string;
  h5pContentId: string;
  xpReward: number;
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

export default function AssignmentH5PPlayer() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<AssignmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (!assignmentId) return;
    studentService.getH5PAssignmentDetail(Number(assignmentId))
      .then(setDetail)
      .catch((err) => setLoadError(err.response?.data?.message || 'Không tải được bài tập.'))
      .finally(() => setIsLoading(false));
  }, [assignmentId]);

  const handleXAPIStatement = useCallback((statement: any) => {
    const verbId: string | undefined = statement?.verb?.id;
    if (!verbId || !verbId.includes('completed')) return;
    if (hasSubmittedRef.current || !assignmentId) return;

    const rawScore = statement?.result?.score?.raw;
    const maxScore = statement?.result?.score?.max;
    if (rawScore === undefined || !maxScore) return;

    hasSubmittedRef.current = true;
    setIsSubmitting(true);
    studentService.submitH5PAssignment(Number(assignmentId), {
      rawScore,
      maxScore,
      completed: Boolean(statement?.result?.completion ?? true),
      interactionDetails: JSON.stringify(statement),
    })
      .then((res) => setResult(res))
      .catch((err) => {
        hasSubmittedRef.current = false;
        toast.error(err.response?.data?.message || 'Lỗi khi nộp bài.');
      })
      .finally(() => setIsSubmitting(false));
  }, [assignmentId]);

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
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-4">
          <Link to="/student/tasks" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-student-primary hover:border-student-primary/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bài tập Tương tác</span>
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
        <div className={`w-full max-w-4xl h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all duration-500 ${result ? 'scale-95 opacity-50 blur-sm' : ''}`}>
          <H5PPlayer contentId={detail.h5pContentId} onXAPIStatement={handleXAPIStatement} />
        </div>

        {isSubmitting && !result && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70">
            <Loader2 className="w-8 h-8 animate-spin text-student-primary" />
          </div>
        )}

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
