import { useState, useEffect } from 'react';
import { Play, Volume2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { studentService } from '../../services/student.service';
import GradedResultModal, { type GradedEssayResult } from '../../components/student/GradedResultModal';

// Lớp 1 không có danh sách/điều hướng gì để tự vào xem bài tự luận đã được cô chấm
// (giao diện Junior chỉ có đúng 1 nút to duy nhất) — nên phải TỰ ĐỘNG hiện kết quả mới
// nhất ngay khi vào Trang Chủ. Nhớ id đã xem trong localStorage để không hiện lặp lại
// mỗi lần mở lại trang.
const SEEN_KEY = 'seenGradedEssayId';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [newResult, setNewResult] = useState<GradedEssayResult | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await studentService.getDashboard();
        const tasks = data.upcomingTasks || [];
        setPendingTasks(tasks);

        const gradedEssays: GradedEssayResult[] = data.gradedEssays || [];
        const newest = gradedEssays[0];
        if (newest && newest.danhGiaId) {
          const seenId = Number(localStorage.getItem(SEEN_KEY) || 0);
          if (newest.danhGiaId > seenId) {
            setNewResult(newest);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [navigate]);

  const handleCloseResult = () => {
    if (newResult?.danhGiaId) localStorage.setItem(SEEN_KEY, String(newResult.danhGiaId));
    setNewResult(null);
  };

  const hasTasks = pendingTasks.length > 0;
  const currentTask = pendingTasks[0]; // Luôn lấy bài tập đầu tiên trong hàng đợi

  const handleAction = () => {
    if (hasTasks) {
      if (currentTask?.id) {
        if (currentTask.loaiBaiTap === 'TRAC_NGHIEM' || currentTask.loaiBaiTap === 'NOI_CAP' || currentTask.loaiBaiTap === 'DIEN_KHUYET' || currentTask.loaiBaiTap === 'NHIEU_CAU') {
          navigate(`/student/tasks/${currentTask.id}/quiz`);
        } else if (currentTask.loaiBaiTap === 'H5P') {
          navigate(`/student/tasks/${currentTask.id}/play`);
        } else if (currentTask.loaiBaiTap === 'GAME') {
          navigate(`/student/game?id=${currentTask.id}`);
        } else {
          navigate(`/student/essay?id=${currentTask.id}`);
        }
      }
    } else {
      navigate('/student/library');
    }
  };

  const getOwlSpeech = () => {
    if (hasTasks) {
      return "Còn bài tập cần làm nữa, em chọn vào nút play để làm bài nhé.";
    }
    return "Em đã hoàn thành xong hết bài tập cần làm rồi.";
  };

  const handleSpeak = () => {
    const textToSpeak = getOwlSpeech();
    toast(`🔊 Cú Mèo: "${textToSpeak}"`, { icon: '🦉' });
    
    const src = hasTasks ? '/owl_tasks_pending.mp3' : '/owl_tasks_done.mp3';
    const audio = new Audio(src);
    audio.play().catch(console.error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 font-sans relative">
      
      {/* Lời thoại của Cú Mèo */}
      <div 
        onClick={handleSpeak}
        className="bg-white px-6 py-4 rounded-full shadow-sm border border-slate-100 flex items-center gap-3 mb-6 animate-bounce cursor-pointer hover:shadow-md transition-shadow max-w-sm text-center"
      >
        <span className="font-bold text-slate-700 text-base sm:text-lg leading-tight">
          {getOwlSpeech()}
        </span>
        <Volume2 className="w-6 h-6 text-blue-500 shrink-0" />
      </div>

      {/* Nhân vật Cú Mèo */}
      <div className="w-40 h-40 bg-indigo-50 rounded-full flex items-center justify-center mb-12 shadow-inner border-4 border-white relative z-10">
        <div className="text-7xl drop-shadow-lg">🦉</div>
        
        {/* Số đếm bài tập lơ lửng */}
        {hasTasks && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white font-black animate-pulse shadow-md">
            {pendingTasks.length}
          </div>
        )}
        {!hasTasks && (
          <div className="absolute -top-2 -right-2 text-4xl animate-pulse">✨</div>
        )}
      </div>

      {/* NÚT HÀNH ĐỘNG KHỔNG LỒ */}
      <button
        onClick={handleAction}
        className={cn(
          "relative w-full max-w-sm h-32 rounded-[2.5rem] flex items-center justify-center transition-all duration-300 active:scale-95 group z-10",
          hasTasks 
            ? "bg-[#00D26A] shadow-[0_10px_0_#00A854,0_15px_30px_rgba(0,210,106,0.3)] hover:shadow-[0_8px_0_#00A854,0_15px_30px_rgba(0,210,106,0.4)] cursor-pointer"
            : "bg-[#FF9800] shadow-[0_10px_0_#F57C00,0_15px_30px_rgba(255,152,0,0.3)] hover:shadow-[0_8px_0_#F57C00,0_15px_30px_rgba(255,152,0,0.4)] cursor-pointer"
        )}
      >
        <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {hasTasks ? (
          <Play className="w-16 h-16 text-white fill-white ml-2 drop-shadow-md" />
        ) : (
          <BookOpen className="w-16 h-16 text-white drop-shadow-md" />
        )}
      </button>

      {newResult && (
        <GradedResultModal result={newResult} onClose={handleCloseResult} simple />
      )}

    </div>
  );
}
