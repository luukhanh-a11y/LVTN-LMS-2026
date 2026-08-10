import { useState, useEffect } from 'react';
import { X, Clock, ChevronLeft, ChevronRight, CheckCircle2, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function StudentExamWorkspace() {
  const navigate = useNavigate();
  
  // Giả lập Dữ liệu Bài kiểm tra
  const examData = {
    tieuDe: 'Kiểm tra 15 phút - Lịch Sử & Địa Lý',
    tongThoiGian: 15 * 60, // 15 phút tính bằng giây
    cauHoi: [
      {
        id: 'q1',
        noiDung: 'Nhà nước đầu tiên của nước ta có tên là gì?',
        luaChon: [
          { id: 'A', text: 'Văn Lang' },
          { id: 'B', text: 'Âu Lạc' },
          { id: 'C', text: 'Đại Việt' },
          { id: 'D', text: 'Đại Ngu' }
        ]
      },
      {
        id: 'q2',
        noiDung: 'Thành Cổ Loa được xây dựng dưới thời vua nào?',
        luaChon: [
          { id: 'A', text: 'Hùng Vương' },
          { id: 'B', text: 'An Dương Vương' },
          { id: 'C', text: 'Lý Thái Tổ' },
          { id: 'D', text: 'Ngô Quyền' }
        ]
      },
      {
        id: 'q3',
        noiDung: 'Sông nào dài nhất Việt Nam?',
        luaChon: [
          { id: 'A', text: 'Sông Hồng' },
          { id: 'B', text: 'Sông Đà' },
          { id: 'C', text: 'Sông Đồng Nai' },
          { id: 'D', text: 'Sông Mê Kông' }
        ]
      }
    ]
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(examData.tongThoiGian);
  const [showGrid, setShowGrid] = useState(false); // Mobile sidebar toggle

  // Format thời gian đếm ngược
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    // API POST /api/bai-nop
    toast.success('Đã nộp bài thành công!', { icon: '✅' });
    navigate('/student');
  };

  const currentQuestion = examData.cauHoi[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === examData.cauHoi.length - 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col fixed inset-0 z-50">
      
      {/* HEADER: Có Đồng hồ đếm ngược */}
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/student')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-slate-800 hidden sm:block">{examData.tieuDe}</h1>
        </div>

        {/* Đồng hồ */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-full font-bold font-mono text-lg border-2",
          timeLeft < 60 ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-slate-50 text-slate-700 border-slate-200"
        )}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>

        {/* Nút Nộp bài */}
        <button 
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors hidden sm:block shadow-sm"
        >
          Nộp bài
        </button>

        {/* Nút mở Grid cho Mobile */}
        <button 
          onClick={() => setShowGrid(!showGrid)}
          className="p-2 bg-slate-100 text-slate-600 rounded-lg sm:hidden"
        >
          <LayoutGrid className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* VÙNG CÂU HỎI (Main Area) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-10 flex flex-col items-center">
          <div className="max-w-3xl w-full flex-1 flex flex-col">
            
            {/* Header Câu hỏi */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-black">
                {currentIndex + 1}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed flex-1">
                {currentQuestion.noiDung}
              </h2>
            </div>

            {/* Danh sách Đáp án (Dạng List Dọc) */}
            <div className="space-y-4 mb-10">
              {currentQuestion.luaChon.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={cn(
                      "w-full text-left p-4 sm:p-5 rounded-xl border-2 flex items-center gap-4 transition-all cursor-pointer group",
                      isSelected 
                        ? "border-blue-500 bg-blue-50/50 shadow-sm" 
                        : "border-slate-200 bg-white hover:border-blue-300"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors border-2",
                      isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-slate-100 text-slate-500 border-transparent group-hover:border-blue-200"
                    )}>
                      {opt.id}
                    </div>
                    <span className={cn(
                      "text-lg font-medium",
                      isSelected ? "text-blue-800" : "text-slate-700"
                    )}>
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1"></div> {/* Spacer */}

            {/* Điều hướng Trái / Phải */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                onClick={() => setCurrentIndex(prev => prev - 1)}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" /> Câu trước
              </button>
              
              {!isLastQuestion ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  Câu tiếp <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors cursor-pointer sm:hidden"
                >
                  Nộp bài <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>

          </div>
        </main>

        {/* SIDEBAR: Danh sách đánh dấu câu hỏi (Grid) */}
        <aside className={cn(
          "w-80 bg-white border-l border-slate-200 flex flex-col absolute right-0 inset-y-0 transform transition-transform duration-300 z-40 sm:relative sm:translate-x-0",
          showGrid ? "translate-x-0 shadow-2xl" : "translate-x-full"
        )}>
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 mb-1">Danh sách câu hỏi</h3>
            <p className="text-sm font-medium text-slate-500">Đã làm: {answeredCount}/{examData.cauHoi.length}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-4 gap-3">
              {examData.cauHoi.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = currentIndex === idx;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentIndex(idx); setShowGrid(false); }}
                    className={cn(
                      "aspect-square rounded-xl font-bold flex items-center justify-center transition-all border-2 cursor-pointer",
                      isCurrent ? "ring-4 ring-blue-100 border-blue-500 text-blue-700" : "border-transparent",
                      isAnswered && !isCurrent ? "bg-blue-600 text-white" : "",
                      !isAnswered && !isCurrent ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : ""
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hướng dẫn màu sắc */}
          <div className="p-5 border-t border-slate-100 space-y-2 text-sm font-medium text-slate-600 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600"></div> Đã trả lời
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-200"></div> Chưa trả lời
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-blue-500"></div> Câu hiện tại
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
