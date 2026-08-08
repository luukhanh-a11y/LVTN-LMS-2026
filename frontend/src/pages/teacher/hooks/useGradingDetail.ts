import { useState, useEffect } from 'react';
import { teacherService, type SubmissionDetail } from '../../../services/teacher.service';

export type ActionStatus = 'idle' | 'success' | 'error';

export function useGradingDetail(submissionId: string | undefined) {
  // giaoVienId thật (khác user.userId, vốn là id đăng nhập) — cần cho mọi request chấm bài
  const [giaoVienId, setGiaoVienId] = useState<number | null>(null);
  useEffect(() => {
    teacherService.getMyTeacherProfile().then((p) => setGiaoVienId(p.giaoVienId)).catch(() => setGiaoVienId(null));
  }, []);

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [showAI, setShowAI] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('HOAN_THANH');
  const [retryReason, setRetryReason] = useState('');

  const [isSubmittingApprove, setIsSubmittingApprove] = useState(false);
  const [isSubmittingRetry, setIsSubmittingRetry] = useState(false);
  const [actionStatus, setActionStatus] = useState<ActionStatus>('idle');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (!submissionId) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadError('');
    teacherService
      .getSubmissionDetail(submissionId)
      .then((data) => {
        if (!cancelled) setSubmission(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err?.response?.data?.message ?? 'Không tải được bài nộp.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const applyAISuggestion = (text: string) => {
    setCommentText(text);
    setShowAI(false);
  };

  const handleApprove = async () => {
    if (!commentText) {
      setActionStatus('error');
      setActionMsg('Vui lòng nhập nhận xét trước khi phê duyệt!');
      return;
    }
    if (!giaoVienId) {
      setActionStatus('error');
      setActionMsg('Không xác định được hồ sơ giáo viên, vui lòng tải lại trang!');
      return;
    }
    setIsSubmittingApprove(true);
    setActionStatus('idle');
    try {
      await teacherService.evaluateSubmission(Number(submissionId), {
        grade: selectedGrade,
        comment: commentText,
        action: 'DUYET',
        teacherId: giaoVienId,
      });
      setActionStatus('success');
      setActionMsg('Phê duyệt bài làm thành công! Học sinh sẽ nhận được phản hồi ngay.');
    } catch (err: any) {
      setActionStatus('error');
      setActionMsg(err.response?.data?.message || 'Có lỗi xảy ra khi chấm bài!');
    } finally {
      setIsSubmittingApprove(false);
    }
  };

  const handleRetry = async () => {
    if (!retryReason) {
      setActionStatus('error');
      setActionMsg('Vui lòng nhập lý do yêu cầu làm lại!');
      return;
    }
    if (!giaoVienId) {
      setActionStatus('error');
      setActionMsg('Không xác định được hồ sơ giáo viên, vui lòng tải lại trang!');
      return;
    }
    setIsSubmittingRetry(true);
    setActionStatus('idle');
    try {
      await teacherService.evaluateSubmission(Number(submissionId), {
        grade: 'CHUA_HOAN_THANH',
        comment: retryReason,
        action: 'YC_LAM_LAI',
        reason: retryReason,
        teacherId: giaoVienId,
      });
      setActionStatus('success');
      setActionMsg('Đã gửi yêu cầu làm lại! Học sinh sẽ được phép nộp bài mới.');
    } catch (err: any) {
      setActionStatus('error');
      setActionMsg(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setIsSubmittingRetry(false);
    }
  };

  return {
    submission, isLoading, loadError,
    showAI, setShowAI,
    commentText, setCommentText,
    selectedGrade, setSelectedGrade,
    retryReason, setRetryReason,
    isSubmittingApprove, isSubmittingRetry,
    actionStatus, actionMsg,
    applyAISuggestion,
    handleApprove,
    handleRetry,
  };
}
