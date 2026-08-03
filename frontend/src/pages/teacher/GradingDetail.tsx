import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Bot, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { AiSuggestionsPanel } from './components/AiSuggestionsPanel';
import { useGradingDetail } from './hooks/useGradingDetail';

const GRADE_OPTIONS = [
  { value: 'HOAN_THANH_TOT', label: '✨ Hoàn thành tốt' },
  { value: 'HOAN_THANH', label: '✅ Hoàn thành' },
  { value: 'CHUA_HOAN_THANH', label: '⚠️ Chưa hoàn thành' },
];

export default function TeacherGradingDetail() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const vm = useGradingDetail(submissionId);

  if (vm.isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-pro-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (vm.loadError) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/teacher/grading')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-semibold">{vm.loadError}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/teacher/grading')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {vm.submission ? `${vm.submission.studentName} — ${vm.submission.assignmentTitle}` : `Chấm bài #${submissionId}`}
            </h1>
            {vm.submission?.submittedAt && (
              <p className="text-sm text-slate-500 mt-0.5">
                Nộp lúc {vm.submission.submittedAt}{vm.submission.isLate ? ' (Nộp trễ)' : ''}
              </p>
            )}
          </div>
        </div>
        <Badge variant="warning" className="text-sm px-3 py-1">Chờ chấm</Badge>
      </div>

      {vm.actionStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 font-semibold">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          {vm.actionMsg}
        </div>
      )}
      {vm.actionStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 font-semibold">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          {vm.actionMsg}
        </div>
      )}

      <Card className="border-primary/20 shadow-md">
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-3">Nội dung bài làm</h3>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-base leading-relaxed text-slate-700 shadow-inner min-h-[120px]">
              {vm.submission?.textContent || (
                <span className="text-slate-400 italic">
                  Học sinh chưa có nội dung văn bản. (Có thể là bài nộp file hoặc H5P)
                </span>
              )}
            </div>
            {vm.submission?.attachmentUrl && (
              <a
                href={vm.submission.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-pro-primary font-semibold hover:underline"
              >
                Xem tệp đính kèm
              </a>
            )}
            {vm.submission?.autoScore !== null && vm.submission?.autoScore !== undefined && (
              <p className="mt-2 text-sm text-slate-600">
                Điểm tự động (H5P): <span className="font-bold text-slate-800">{vm.submission.autoScore}</span>
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Đánh giá Xếp loại (Theo TT27)</label>
              <select
                className="w-full md:w-1/2 px-4 py-3 border border-slate-300 rounded-lg outline-none bg-white text-base focus:border-primary shadow-sm"
                value={vm.selectedGrade}
                onChange={(e) => vm.setSelectedGrade(e.target.value)}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Nhận xét của Giáo viên</label>
                <button
                  className="text-sm text-pro-primary font-bold flex items-center hover:bg-pro-primary/10 px-3 py-1.5 rounded transition-colors"
                  onClick={() => vm.setShowAI(!vm.showAI)}
                >
                  <Bot className="w-4 h-4 mr-1.5" /> Gemma2 Gợi ý
                </button>
              </div>

              {vm.showAI && submissionId && (
                <AiSuggestionsPanel
                  submissionId={Number(submissionId)}
                  onApply={vm.applyAISuggestion}
                  onClose={() => vm.setShowAI(false)}
                />
              )}

              <textarea
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-1 text-base h-40 resize-y shadow-sm"
                placeholder="Nhập nhận xét chi tiết cho học sinh..."
                value={vm.commentText}
                onChange={(e) => vm.setCommentText(e.target.value)}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Button
                  className="w-full bg-pro-success hover:brightness-95 py-6 text-base shadow-sm"
                  onClick={vm.handleApprove}
                  disabled={vm.isSubmittingApprove || vm.actionStatus === 'success'}
                >
                  {vm.isSubmittingApprove
                    ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    : <CheckCircle className="w-5 h-5 mr-2" />}
                  Lưu & Phê duyệt kết quả
                </Button>
              </div>

              <div className="flex-1 flex flex-col space-y-3 border-t sm:border-t-0 sm:border-l border-dashed border-slate-200 pt-4 sm:pt-0 sm:pl-4">
                <label className="block text-xs font-medium text-slate-500">Hoặc yêu cầu học sinh làm lại:</label>
                <Input
                  placeholder="Lý do: Lạc đề, quá ngắn..."
                  className="text-sm"
                  value={vm.retryReason}
                  onChange={(e) => vm.setRetryReason(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm"
                  onClick={vm.handleRetry}
                  disabled={vm.isSubmittingRetry || vm.actionStatus === 'success'}
                >
                  {vm.isSubmittingRetry
                    ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    : <AlertCircle className="w-4 h-4 mr-2" />}
                  Trả bài làm lại
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
