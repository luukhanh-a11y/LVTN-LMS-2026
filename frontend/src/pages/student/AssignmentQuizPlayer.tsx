import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Loader2, Star, Gem, Send } from 'lucide-react';
import { studentService } from '../../services/student.service';
import { useAuthStore } from '../../stores/useAuthStore';
import toast from 'react-hot-toast';

import QuizForm from '../../components/student/QuizForm';
import NoiCapForm from '../../components/student/NoiCapForm';
import TuLuanForm from '../../components/student/TuLuanForm';
import LyThuyetForm from '../../components/student/LyThuyetForm';
import { MatchingGame } from '../../components/games/MatchingGame';
import { MillionaireGame } from '../../components/games/MillionaireGame';
import { BeeGame } from '../../components/games/BeeGame';
import { SortingGame } from '../../components/games/SortingGame';
import { HarvestGame } from '../../components/games/HarvestGame';
import { FrogGame } from '../../components/games/FrogGame';
import { BalloonGame } from '../../components/games/BalloonGame';
import { CatchingGame } from '../../components/games/CatchingGame';
import { GoldMinerGame } from '../../components/games/GoldMinerGame';
import { DragMatchGame } from '../../components/games/DragMatchGame';

interface QuizDetail {
  assignmentId: number;
  title: string;
  loai: 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET' | 'NHIEU_CAU' | string;
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

// Chọn đúng component game theo (loại dạng bài, giao diện đã chọn) — cùng logic switch
// đang dùng ở LessonPlayer.tsx (luồng tự học SGK), để trang làm bài tập giao từ giáo
// viên cũng hiển thị đúng game (Đào Vàng, Ếch qua sông, Kéo thả ghép cặp...) thay vì
// luôn rơi về form nhập liệu mặc định như trước đây.
function renderGameByGiaoDien(loai: string, cauHinh: any, onSubmit: (baiLam: any) => void) {
  const giaoDien = cauHinh?.giaoDien;
  const commonGameProps = { cauHinh, result: null, activeDapAnChuan: undefined, onSubmit };

  if (loai === 'TRAC_NGHIEM' || loai === 'DIEN_KHUYET') {
    if (loai === 'TRAC_NGHIEM') {
      if (giaoDien === 'THU_HOACH_NONG_SAN') return <HarvestGame {...commonGameProps} />;
      if (giaoDien === 'ECH_QUA_SONG') return <FrogGame {...commonGameProps} />;
      if (giaoDien === 'BAN_BONG_BAY') return <BalloonGame {...commonGameProps} />;
      if (giaoDien === 'TRIEU_PHU') return <MillionaireGame {...commonGameProps} />;
      if (giaoDien === 'DUOI_BAT') return <CatchingGame {...commonGameProps} />;
      if (giaoDien === 'DAO_VANG') return <GoldMinerGame {...commonGameProps} />;
    } else if (giaoDien === 'ONG_TIM_MAT') {
      return <BeeGame {...commonGameProps} />;
    }
    return <QuizForm loai={loai} cauHinh={cauHinh} dapAnChuan={undefined} result={null} onSubmit={onSubmit} submitting={false} />;
  }

  if (loai === 'NOI_CAP') {
    if (giaoDien === 'PHAN_LOAI') return <SortingGame {...commonGameProps} />;
    if (giaoDien === 'KEO_THA_GHEP_CAP') return <DragMatchGame {...commonGameProps} />;
    if (giaoDien === 'NOI_CAP_LINE' || !giaoDien) return <MatchingGame {...commonGameProps} />;
    return <NoiCapForm loai={loai} cauHinh={cauHinh} dapAnChuan={undefined} result={null} onSubmit={onSubmit} submitting={false} />;
  }

  if (loai === 'TU_LUAN') {
    return <TuLuanForm cauHinh={cauHinh} result={null} onSubmit={onSubmit} submitting={false} />;
  }

  if (loai === 'LY_THUYET') {
    return <LyThuyetForm cauHinh={cauHinh} />;
  }

  return <div className="text-sm text-slate-500 py-4">Dạng bài "{loai}" chưa được hỗ trợ hiển thị.</div>;
}

export default function AssignmentQuizPlayer() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [detail, setDetail] = useState<QuizDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bộ đề tổng hợp nhiều câu (Giao từ Sách Bài Tập) — gom bài làm của từng câu trước
  // khi nộp chung 1 lần bằng nút "Nộp bài" ở cuối trang.
  const [dapAnNhieuCau, setDapAnNhieuCau] = useState<Record<string, any>>({});

  // detail.cauHinh.danhSachCauHoi LUÔN tồn tại (mảng 1 phần tử ngay cả khi giao đúng 1
  // câu) — không thể dùng "có tồn tại mảng" để phân biệt 1 câu hay nhiều câu như code cũ
  // (luôn đúng, khiến bài 1-câu cũng bị coi là nhiều câu). Chỉ detail.loai === 'NHIEU_CAU'
  // (backend chỉ gán giá trị này khi thật sự > 1 câu) mới đáng tin.
  const isNhieuCau = detail?.loai === 'NHIEU_CAU';

  useEffect(() => {
    if (!assignmentId) return;
    studentService.getQuizAssignmentDetail(Number(assignmentId))
      .then(setDetail)
      .catch((err) => setLoadError(err.response?.data?.message || 'Không tải được bài tập.'))
      .finally(() => setIsLoading(false));
  }, [assignmentId, user]);

  const goToNextTask = useCallback(() => {
    if (!assignmentId) return;
    studentService.getNextTaskRoute(Number(assignmentId)).then(navigate);
  }, [assignmentId, navigate]);

  // Làm xong bài tự động chuyển sang bài tiếp theo còn phải làm, hết bài thì về trang chủ.
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(goToNextTask, 3000);
    return () => clearTimeout(timer);
  }, [result, goToNextTask]);

  const submitToServer = async (baiLam: Record<string, unknown>) => {
    if (!assignmentId || !user?.userId) {
      toast.error('Không tìm thấy thông tin học sinh.');
      return;
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

  // Dùng cho bài giao chỉ 1 câu — mỗi game tự gọi onSubmit ngay khi học sinh chọn/ghép
  // xong đáp án (giống hệt cách LessonPlayer.tsx xử lý), không cần nút "Nộp bài" riêng
  // ở ngoài nữa.
  //
  // QUAN TRỌNG: backend (BaiNopService) LUÔN chấm điểm theo khoá "dapAnHocSinh":
  // { <dangBaiId>: <bài làm> } — kể cả khi bài tập chỉ có 1 câu (chỉ cần chiTietBaiTap
  // không rỗng là backend đi theo nhánh này, không có nhánh riêng cho "1 câu"). Gửi thẳng
  // {dapAnDungId:...} không bọc key sẽ luôn bị chấm 0 điểm dù làm đúng.
  const handleSingleSubmit = (baiLam: Record<string, unknown>) => {
    const dangBaiId = detail?.cauHinh?.danhSachCauHoi?.[0]?.id;
    if (!dangBaiId) {
      submitToServer(baiLam);
      return;
    }
    submitToServer({ dapAnHocSinh: { [dangBaiId]: baiLam } });
  };

  // Dùng cho bộ đề nhiều câu — bấm "Nộp bài" ở cuối trang mới thực sự gửi lên chấm.
  const handleSubmitNhieuCau = () => {
    if (!detail) return;
    const ds = detail.cauHinh.danhSachCauHoi || [];
    if (ds.some((c: any) => !dapAnNhieuCau[c.id])) {
      toast.error('Vui lòng hoàn thành đầy đủ tất cả các câu hỏi trong bộ đề.');
      return;
    }
    submitToServer({ dapAnHocSinh: dapAnNhieuCau });
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
    // fixed inset-0 (không phải khung card gọn trong layout) — giống hệt cách
    // LessonPlayer.tsx tự vẽ toàn màn hình cho trang học bài, để game có tối đa không
    // gian hiển thị và thao tác (StudentLayout.tsx đã ẩn header/dock chung cho route này).
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-100">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shrink-0">
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

      <div className="flex-1 p-4 md:p-6 flex justify-center items-center relative overflow-y-auto">
        {/* max-w-3xl cũ quá hẹp so với khung fixed inset-0 toàn màn hình, để lại rất
            nhiều khoảng trống thừa 2 bên — nới lên gần hết chiều rộng khả dụng. */}
        <div className={`w-full h-full transition-all duration-500 ${isNhieuCau ? 'max-w-7xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5 overflow-y-auto' : 'max-w-7xl'} ${result ? 'scale-95 opacity-50 blur-sm' : ''}`}>
          {!isNhieuCau ? (
            // Giao đúng 1 câu — để game tự chiếm toàn bộ khung, tự xử lý nộp bài.
            // h-full (không phải min-h cố định): các game như Đào Vàng/Đuổi Bắt định vị
            // đáp án dựa theo chiều cao container thật — khung quá thấp khiến lớp trang
            // trí (gai nhọn ở đáy hầm) đè lên đúng chỗ khối đáp án, chặn mất thao tác bấm.
            <div className="h-full">
              {renderGameByGiaoDien(detail.loai, detail.cauHinh, handleSingleSubmit)}
            </div>
          ) : (
            <>
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                {(detail.cauHinh.danhSachCauHoi || []).map((ch: any, idx: number) => (
                  <div key={ch.id || idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <p className="font-bold text-slate-800 text-base flex items-center gap-2">
                        <span className="w-7 h-7 flex items-center justify-center bg-student-primary/10 text-student-primary rounded-full text-sm font-black">{idx + 1}</span>
                        <span className="text-xs text-slate-500 font-normal">
                          {ch.kieu === 'NOI_CAP' ? 'Nối cặp' : ch.kieu === 'DIEN_KHUYET' ? 'Điền từ' : 'Trắc nghiệm'}
                        </span>
                      </p>
                      {dapAnNhieuCau[ch.id] ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Đã trả lời
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Chưa trả lời
                        </span>
                      )}
                    </div>

                    <div className="max-h-[600px] overflow-y-auto rounded-xl border border-slate-200 [&_button[type='submit']]:!hidden">
                      {renderGameByGiaoDien(ch.kieu, ch, (baiLam) => setDapAnNhieuCau(prev => ({ ...prev, [ch.id]: baiLam })))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmitNhieuCau}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-3 bg-student-primary text-white font-bold rounded-xl hover:bg-[#3A82DF] transition-colors disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                Nộp bài
              </button>
            </>
          )}
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
                onClick={goToNextTask}
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
