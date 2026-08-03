import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ChevronUp, ChevronDown, Minimize, Maximize, CheckCircle2, BookOpen, Loader2, Star, Gem, Lightbulb, ArrowRight, XCircle } from 'lucide-react';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import { studentService } from '../../services/student.service';
import QuizForm from '../../components/student/QuizForm';

import LessonVisual from '../../components/student/LessonVisual';
import { MatchingGame } from "../../components/games/MatchingGame";
import { MillionaireGame } from "../../components/games/MillionaireGame";
import { BeeGame } from "../../components/games/BeeGame";
import { SortingGame } from "../../components/games/SortingGame";

import { HarvestGame } from '../../components/games/HarvestGame';
import { FrogGame } from '../../components/games/FrogGame';
import { BalloonGame } from '../../components/games/BalloonGame';
import { CatchingGame } from '../../components/games/CatchingGame';
import { GoldMinerGame } from '../../components/games/GoldMinerGame';
import LyThuyetForm from '../../components/student/LyThuyetForm';
import TuLuanForm from '../../components/student/TuLuanForm';
import { X } from 'lucide-react';

export interface QuizResult {
  diem: number | string;
  xpEarned?: number;
  dapAnChuan?: any;
  isFirstTime?: boolean;
}

export type Loai = 'LY_THUYET' | 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET';

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [title, setTitle] = useState('');
  const [h5pContentId, setH5pContentId] = useState<string | null>(null);
  const [loaiNoiDung, setLoaiNoiDung] = useState<string | null>(null);
  const [loai, setLoai] = useState<Loai | null>(null);
  const [cauHinh, setCauHinh] = useState<any>(null);
  const [dapAnChuan, setDapAnChuan] = useState<any>(null);
  const [dangBaiId, setDangBaiId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [nextLessonId, setNextLessonId] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [autoNextTime, setAutoNextTime] = useState<number | null>(null);

  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoNextTime !== null && autoNextTime > 0) {
      timer = setTimeout(() => {
        setAutoNextTime(autoNextTime - 1);
      }, 1000);
    } else if (autoNextTime === 0) {
      if (activeItemIndex < itemsList.length - 1) {
        loadNextItem();
      }
      setAutoNextTime(null);
    }
    return () => clearTimeout(timer);
  }, [autoNextTime, activeItemIndex, itemsList.length]);

  useEffect(() => {
    if (!lessonId) return;
    setIsLoading(true);
    setQuizResult(null);
    setShowBanner(false);
    setAutoNextTime(null);

    studentService.getNextLessonId(Number(lessonId), subjectId ? Number(subjectId) : null).then(setNextLessonId);

    studentService
      .getContentNodeDetail(Number(lessonId))
      .then(async (data) => {
        console.log("=== DEBUG API RESPONSE ===");
        console.log("Called API /bai-hoc/" + lessonId + " and /he-thong/dang-bai/bai-hoc/" + lessonId);
        console.log("Response data from studentService.getContentNodeDetail:", data);
        console.log("==========================");

        setTitle(data.title);
        
        // Support multiple items
        const fetchedItems = data.items && data.items.length > 0 ? data.items : [data];
        setItemsList(fetchedItems);
        setActiveItemIndex(0);
        
        const activeItem = fetchedItems[0];
        console.log("Active item mapped to LessonPlayer state:", activeItem);

        setH5pContentId(activeItem.h5pContentId);
        setCompleted(!!data.completed);
        setLoaiNoiDung(activeItem.loaiNoiDung ?? null);
        setLoai(activeItem.loai ?? null);
        setCauHinh(activeItem.cauHinh ?? null);
        setDapAnChuan(activeItem.dapAnChuan ?? null);
        setDangBaiId(activeItem.dangBaiId);

        if (activeItem.dangBaiId && data.completed) {
          try {
            const hsRes = await studentService.getQuizHistory(activeItem.dangBaiId);
            if (hsRes && hsRes.length > 0) {
              const lastSub = hsRes[0];
              setQuizResult({
                diem: lastSub.diemSo ?? 10,
                xpEarned: Math.round(lastSub.diemSo ?? 10),
                dapAnChuan: lastSub.dapAnChuan || activeItem.dapAnChuan,
                isFirstTime: false
              });
            }
          } catch (e) {}
        }
      })
      .catch(() => toast.error('Không tải được nội dung bài học.'))
      .finally(() => setIsLoading(false));
  }, [lessonId, subjectId]);

  const handleComplete = async () => {
    if (!lessonId || completed) return;
    setSubmitting(true);
    try {
      const result = await studentService.markContentNodeComplete(Number(lessonId));
      setXpEarned(result.xpEarned ?? 0);
      setCompleted(true);
      toast.success(`Đã hoàn thành bài học! +${result.xpEarned ?? 10} XP`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Không thể đánh dấu hoàn thành.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUncomplete = async () => {
    if (!lessonId || !completed) return;
    setSubmitting(true);
    try {
      await studentService.unmarkContentNodeComplete(Number(lessonId));
      setCompleted(false);
      toast.success('Đã bỏ đánh dấu hoàn thành');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Không thể bỏ đánh dấu hoàn thành.');
    } finally {
      setSubmitting(false);
    }
  };

  const loadItem = async (index: number) => {
    if (index < 0 || index >= itemsList.length) return;
    setActiveItemIndex(index);
    const activeItem = itemsList[index];

    setH5pContentId(activeItem.h5pContentId);
    setLoaiNoiDung(activeItem.loaiNoiDung ?? null);
    setLoai(activeItem.loai ?? null);
    setCauHinh(activeItem.cauHinh ?? null);
    setDapAnChuan(activeItem.dapAnChuan ?? null);
    setDangBaiId(activeItem.dangBaiId);
    setQuizResult(null);
    setShowBanner(false);
    setAutoNextTime(null);
    setGameKey(k => k + 1);

    if (activeItem.dangBaiId && completed) {
      try {
        const hsRes = await studentService.getQuizHistory(activeItem.dangBaiId);
        if (hsRes && hsRes.length > 0) {
          const lastSub = hsRes[0];
          setQuizResult({
            diem: lastSub.diemSo ?? 10,
            xpEarned: Math.round(lastSub.diemSo ?? 10),
            dapAnChuan: lastSub.dapAnChuan || activeItem.dapAnChuan,
            isFirstTime: false
          });
        }
      } catch (e) {}
    }
  };

  const loadNextItem = () => loadItem(activeItemIndex + 1);
  const loadPrevItem = () => loadItem(activeItemIndex - 1);

  const handleSubmitQuiz = async (baiLam: any) => {
    if (!lessonId) return;
    setSubmitting(true);
    const wasCompleted = completed;
    const activeItem = itemsList[activeItemIndex];
    try {
      const result = await studentService.submitContentNodeQuiz(Number(lessonId), { ...baiLam, cauHinh }, dangBaiId, activeItem?.dapAnChuan);
      
      console.log("Kết quả từ Backend:", result);
      
      setQuizResult({
        diem: result.diem,
        xpEarned: result.xpEarned ?? 0,
        dapAnChuan: result.dapAnChuan,
        isFirstTime: !wasCompleted
      });
      
      const isPassed = Number(result.diem) === 10;
      
      if (isPassed && !wasCompleted && activeItemIndex === itemsList.length - 1) {
        setXpEarned(result.xpEarned ?? 0);
        setCompleted(true);
      }
      
      setShowBanner(true);
      setGameKey(k => k + 1); // Reset game logic

      // If wrong, or if last item, hide banner automatically
      // If right but not last item, we keep the banner open for them to click Next
      if (!isPassed) {
        setTimeout(() => setShowBanner(false), 5000);
      }
      
      // Start auto next only if there is a next level
      if (activeItemIndex < itemsList.length - 1) {
        setAutoNextTime(10);
      }

    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Không thể nộp bài.');
    } finally {
      setSubmitting(false);
    }
  };

  const backLink = subjectId ? `/student/subject/${subjectId}` : '/student';
  const isLyThuyet = loaiNoiDung === 'JSON_TEXT' && loai === 'LY_THUYET';
  const isTuLuan = loaiNoiDung === 'JSON_TEXT' && loai === 'TU_LUAN';
  const isQuizType = loaiNoiDung === 'JSON_TEXT' && !isLyThuyet && !isTuLuan;
  const isHarvestGame = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'THU_HOACH_NONG_SAN';
  const isFrogGame = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'ECH_QUA_SONG';
  const isBalloonGame = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'BAN_BONG_BAY';
  const isMillionaireGame = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'TRIEU_PHU';
  const isCatchingGame = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'DUOI_BAT';
  const isGoldMinerGame = loai === 'TRAC_NGHIEM' && cauHinh?.giaoDien === 'DAO_VANG';
  
  // Games that are exclusively tied to a specific loai
  const isMatchingGame = loai === 'NOI_CAP' && (cauHinh?.giaoDien === 'NOI_CAP_LINE' || !cauHinh?.giaoDien);
  const isSortingGame = loai === 'NOI_CAP' && cauHinh?.giaoDien === 'PHAN_LOAI';
  const isBeeGame = loai === 'DIEN_KHUYET' && cauHinh?.giaoDien === 'ONG_TIM_MAT';
  const isAnyGame = isHarvestGame || isFrogGame || isBalloonGame || isMatchingGame || isMillionaireGame || isBeeGame || isSortingGame || isCatchingGame || isGoldMinerGame;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-student-primary" />
      </div>
    );
  }

  return (
    <div className={isFullscreen ? `fixed inset-0 z-50 flex flex-col overflow-hidden ${isAnyGame ? "bg-slate-900" : "bg-slate-100"}` : "flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"}>
            {/* Floating UI Container (Always Visible) */}
      <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
        
        {/* Top Left Navigation */}
        <div className="absolute top-6 left-6 flex flex-col gap-4 pointer-events-auto">
          <Link to={backLink} className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group relative border shadow-lg ${isAnyGame ? 'bg-white/10 hover:bg-white/30 text-white border-white/20' : 'bg-slate-800 hover:bg-slate-900 text-white border-slate-700'}`}>
            <ArrowLeft className="w-6 h-6" />
            <span className="absolute left-16 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-opacity pointer-events-none drop-shadow-md">
              {isFullscreen ? "Thoát" : "Quay lại bài học"}
            </span>
          </Link>
          
          <button onClick={() => setIsFullscreen(!isFullscreen)} className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group relative border shadow-lg ${isAnyGame ? 'bg-white/10 hover:bg-white/30 text-white border-white/20' : 'bg-slate-800 hover:bg-slate-900 text-white border-slate-700'}`}>
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            <span className="absolute left-16 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-opacity pointer-events-none drop-shadow-md">
              {isFullscreen ? "Thu nhỏ" : "Phóng to"}
            </span>
          </button>

          {/* Màn trước */}
          {activeItemIndex > 0 && (
            <button onClick={loadPrevItem} className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group relative border shadow-lg ${isAnyGame ? 'bg-white/10 hover:bg-white/30 text-white border-white/20' : 'bg-slate-800 hover:bg-slate-900 text-white border-slate-700'}`}>
              <ChevronUp className="w-6 h-6" />
              <span className="absolute left-16 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-opacity pointer-events-none drop-shadow-md">
                Màn trước
              </span>
            </button>
          )}

          {/* Màn tiếp theo */}
          {activeItemIndex < itemsList.length - 1 && (
            <button onClick={loadNextItem} className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group relative border shadow-lg ${isAnyGame ? 'bg-white/10 hover:bg-white/30 text-white border-white/20' : 'bg-slate-800 hover:bg-slate-900 text-white border-slate-700'}`}>
              <ChevronDown className="w-6 h-6" />
              <span className="absolute left-16 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-opacity pointer-events-none drop-shadow-md">
                Màn tiếp theo
              </span>
            </button>
          )}
        </div>

        {/* Top Center Title */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto">
           <div className={`px-6 py-2 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-3 transition-colors ${isAnyGame ? 'bg-black/40 border-white/20 text-white' : 'bg-white/90 border-slate-200 text-slate-800'}`}>
              <span className="font-bold text-sm tracking-wide uppercase opacity-70">Bài học</span>
              <div className={`w-1 h-4 rounded-full ${isAnyGame ? 'bg-white/30' : 'bg-slate-300'}`}></div>
              <span className="font-black text-base">{title}</span>
              {itemsList.length > 1 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ml-2 ${isAnyGame ? 'bg-white/20' : 'bg-slate-200'}`}>
                  Phần {activeItemIndex + 1}/{itemsList.length}
                </span>
              )}
           </div>
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-4 items-end pointer-events-auto">
          {!completed && !isQuizType ? (
            <button
              onClick={handleComplete}
              disabled={submitting}
              className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group relative border shadow-lg ${isAnyGame ? 'bg-white/10 hover:bg-emerald-500 text-white border-white/20' : 'bg-slate-800 hover:bg-emerald-500 text-white border-slate-700'}`}
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
              <span className="absolute right-16 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-opacity pointer-events-none drop-shadow-md">
                Đánh dấu hoàn thành
              </span>
            </button>
          ) : completed ? (
            <button
              onClick={handleUncomplete}
              disabled={submitting}
              className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group relative border shadow-lg bg-emerald-500 hover:bg-rose-500 hover:border-rose-600 text-white border-emerald-400"
            >
               {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-6 h-6 group-hover:hidden" />}
               {!submitting && <XCircle className="w-6 h-6 hidden group-hover:block" />}
               <span className="absolute right-16 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-opacity pointer-events-none drop-shadow-md">
                 Bỏ đánh dấu hoàn thành
               </span>
            </button>
          ) : null}

          {nextLessonId && (
            <Link
              to={`/student/lesson/${nextLessonId}${subjectId ? `?subjectId=${subjectId}` : ''}`}
              className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all group relative border shadow-lg ${isAnyGame ? 'bg-white/10 hover:bg-[#3A82DF] text-white border-white/20' : 'bg-slate-800 hover:bg-[#3A82DF] text-white border-slate-700'}`}
            >
              <ArrowRight className="w-6 h-6" />
              <span className="absolute right-16 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-opacity pointer-events-none drop-shadow-md">
                Bài tiếp theo
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {showBanner && quizResult && (() => {
        const diem = Number(quizResult.diem);
        let bgClass, iconBgClass, iconColorClass, title, subtitle, IconComponent;
        
        if (diem === 10) {
          bgClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-[0_10px_40px_rgba(16,185,129,0.3)]';
          iconBgClass = 'bg-emerald-100'; iconColorClass = 'text-emerald-600';
          title = 'Chúc mừng nhà vô địch! 🏆';
          subtitle = quizResult.isFirstTime && quizResult.xpEarned > 0 ? `Bạn nhận được +${quizResult.xpEarned} XP` : 'Điểm tuyệt đối!';
          IconComponent = CheckCircle2;
        } else if (diem >= 7) {
          bgClass = 'bg-violet-50 border-violet-400 text-violet-900 shadow-[0_10px_40px_rgba(139,92,246,0.3)]';
          iconBgClass = 'bg-violet-100'; iconColorClass = 'text-violet-600';
          title = 'Rất tốt! Thiếu một xíu nữa là hoàn hảo! 🌟';
          subtitle = quizResult.isFirstTime && quizResult.xpEarned > 0 ? `Bạn nhận được +${quizResult.xpEarned} XP` : 'Gần đúng hết rồi đó!';
          IconComponent = CheckCircle2;
        } else if (diem >= 5) {
          bgClass = 'bg-sky-50 border-sky-400 text-sky-900 shadow-[0_10px_40px_rgba(14,165,233,0.3)]';
          iconBgClass = 'bg-sky-100'; iconColorClass = 'text-sky-600';
          title = 'Tốt rồi, cố gắng lấy điểm cao hơn nha! ⭐';
          subtitle = quizResult.isFirstTime && quizResult.xpEarned > 0 ? `Bạn nhận được +${quizResult.xpEarned} XP` : 'Cố gắng thêm chút nữa nhé!';
          IconComponent = Lightbulb;
        } else if (diem > 0) {
          bgClass = 'bg-amber-50 border-amber-400 text-amber-900 shadow-[0_10px_40px_rgba(245,158,11,0.3)]';
          iconBgClass = 'bg-amber-100'; iconColorClass = 'text-amber-600';
          title = 'Sai vài chỗ rồi, mình cẩn thận sửa lại nhé! 📝';
          subtitle = quizResult.isFirstTime && quizResult.xpEarned > 0 ? `Bạn nhận được +${quizResult.xpEarned} XP` : 'Hãy chú ý hơn nhé!';
          IconComponent = Lightbulb;
        } else {
          bgClass = 'bg-rose-50 border-rose-400 text-rose-900 shadow-[0_10px_40px_rgba(244,63,94,0.3)]';
          iconBgClass = 'bg-rose-100'; iconColorClass = 'text-rose-600';
          title = 'Không sao đâu, mình làm lại từ đầu nhé! 💪';
          subtitle = 'Hãy xem đáp án đúng ở dưới nha!';
          IconComponent = XCircle;
        }

        return (
          <div className={`fixed top-8 left-1/2 -translate-x-1/2 min-w-[350px] md:min-w-[500px] shadow-2xl rounded-2xl z-[150] px-6 py-4 flex items-center justify-between transition-all duration-500 animate-in slide-in-from-top-10 fade-in zoom-in-95 border-2 ${bgClass}`}>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                <IconComponent className={`w-8 h-8 ${iconColorClass}`} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg">{title}</span>
                <span className="font-bold text-sm opacity-80">{subtitle}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBanner(false)}
                className="text-sm font-bold px-3 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        );
      })()}

      {/* Main Content */}
      <div className={`flex-1 flex justify-center items-center relative overflow-hidden ${isAnyGame ? 'bg-slate-900 p-6 lg:p-12' : 'bg-slate-100 p-6'}`}>
         <div className={`w-full h-full flex flex-col transition-all duration-500 mx-auto max-w-6xl ${isAnyGame ? 'rounded-3xl shadow-2xl' : 'max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200'}`}>
             {h5pContentId ? (
               <H5PPlayer contentId={h5pContentId} />
             ) : isLyThuyet ? (
               <LyThuyetForm cauHinh={cauHinh} />
             ) : isTuLuan ? (
               <TuLuanForm cauHinh={cauHinh} result={quizResult} onSubmit={handleSubmitQuiz} submitting={submitting} />
             ) : isHarvestGame ? (
                <HarvestGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isFrogGame ? (
                <FrogGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isBalloonGame ? (
                <BalloonGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isMatchingGame ? (
                <MatchingGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isMillionaireGame ? (
                <MillionaireGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isBeeGame ? (
                <BeeGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isSortingGame ? (
                <SortingGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isCatchingGame ? (
                <CatchingGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isGoldMinerGame ? (
                <GoldMinerGame key={gameKey} cauHinh={cauHinh} result={quizResult} activeDapAnChuan={dapAnChuan} onSubmit={handleSubmitQuiz} />
             ) : isQuizType && loai && cauHinh ? (
                <QuizForm
                  loai={loai}
                  cauHinh={cauHinh}
                  dapAnChuan={dapAnChuan}
                  result={quizResult}
                  onSubmit={handleSubmitQuiz}
                  onReset={() => {
                    setQuizResult(null);
                    setShowBanner(false);
    setAutoNextTime(null);
                    setGameKey(k => k + 1);
                  }}
                  submitting={submitting}
                  nextLessonId={nextLessonId}
                  subjectId={subjectId}
                />
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <BookOpen className="w-20 h-20 mb-6 opacity-80 text-student-primary" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">Bài học chưa có nội dung tương tác</h3>
                  <p className="text-slate-500 max-w-md">Giáo viên chưa gắn nội dung H5P cho bài này. Em có thể đánh dấu hoàn thành sau khi đã đọc/nghe giảng trên lớp.</p>
               </div>
             )}
         </div>
      </div>
      {/* Auto Next Progress Bar */}
      {autoNextTime !== null && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-t border-white/10 z-[200] flex items-center justify-between px-6">
          <div className="flex-1 mr-8 relative">
            <div className="flex justify-between text-white/90 text-sm font-semibold mb-2">
              <span>Tự động chuyển màn tiếp theo...</span>
              <span>{autoNextTime}s</span>
            </div>
            <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-sky-500 h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(14,165,233,0.8)]" 
                style={{ width: `${(autoNextTime / 10) * 100}%` }}
              />
            </div>
          </div>
          <button 
            onClick={() => setAutoNextTime(null)}
            className="flex items-center space-x-2 bg-white/10 hover:bg-rose-500/80 text-white px-4 py-2 rounded-xl font-bold transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Hủy</span>
          </button>
        </div>
      )}
    </div>
  );
}
