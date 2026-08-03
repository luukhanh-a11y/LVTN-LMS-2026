import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import type { SubmissionDetail } from '../../../services/teacher.service';

interface GradedDetailsModalProps {
  submission: SubmissionDetail | null;
  onClose: () => void;
}

export function GradedDetailsModal({ submission, onClose }: GradedDetailsModalProps) {
  if (!submission) return null;

  const score = submission.evaluationScore ?? submission.autoScore;

  return (
    <Modal isOpen={!!submission} onClose={onClose} title="Chi tiết Đánh giá" widthClass="w-[500px]">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-slate-800">{submission.studentName}</h3>
            <p className="text-sm text-slate-500">{submission.assignmentTitle}</p>
          </div>
          {score !== null && score !== undefined && (
            <Badge variant="success">Điểm: {score}</Badge>
          )}
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm leading-relaxed text-slate-700">
          <strong className="block mb-2 text-slate-800">Bài làm:</strong>
          {submission.textContent || (
            <span className="text-slate-400 italic">Không có nội dung văn bản (bài nộp file hoặc H5P).</span>
          )}
        </div>

        {submission.evaluationComment && (
          <div>
            <strong className="block mb-1 text-sm text-slate-800">Nhận xét của giáo viên:</strong>
            <div className="p-3 bg-pro-primary/10 text-pro-fg text-sm rounded border border-pro-primary/20">
              {submission.evaluationComment}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </Modal>
  );
}
