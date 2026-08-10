import { useState } from 'react';
import { X, Volume2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function StudentGameWorkspace() {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Giả lập dữ liệu câu hỏi
  const question = {
    text: "Phép tính nào dưới đây có kết quả bằng 10?",
    options: [
      { id: 'A', text: '5 + 4' },
      { id: 'B', text: '7 + 3', isCorrect: true },
      { id: 'C', text: '8 + 1' },
      { id: 'D', text: '6 + 5' },
    ]
  };

  const handlePlayAudio = () => {
    toast('🔊 Đang đọc: "Phép tính nào dưới đây có kết quả bằng 10?"', { icon: '🦉' });
    
    try {
      // Dùng trực tiếp file MP3 đã tải sẵn lưu ở thư mục public
      // Đảm bảo 100% lúc đi bảo vệ đồ án luôn luôn kêu, không phụ thuộc mạng hay API
      const audio = new Audio('/question_math_1.mp3');
      audio.play().catch(error => {
        console.error("Lỗi phát âm thanh:", error);
      });
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    
    const correct = question.options.find(o => o.id === selectedAnswer)?.isCorrect;
    setIsCorrect(correct || false);

    if (correct) {
      toast.success('Hoan hô! Bé làm đúng rồi!', { 
        icon: '🎉',
        style: { background: '#00D26A', color: '#fff', fontWeight: 'bold' }
      });
      setTimeout(() => navigate('/student'), 2000); // Tự thoát ra ngoài
    } else {
      toast.error('Chưa đúng rồi, bé thử lại nhé!', {
        icon: '💪',
        style: { background: '#EF4444', color: '#fff', fontWeight: 'bold' }
      });
      setTimeout(() => setIsCorrect(null), 1500); // Reset trạng thái
    }
  };

  return (
    // THAY ĐỔI QUAN TRỌNG: fixed inset-0 z-50 che đi toàn bộ UI bên ngoài (kể cả thanh Dock)
   <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* THANH TIẾN ĐỘ & NÚT THOÁT */}
      <header className="px-6 py-4 flex items-center gap-4 bg-white shadow-sm shrink-0">
        <button 
          onClick={() => navigate('/student')}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 bg-slate-200 h-4 rounded-full overflow-hidden">
          <div className="bg-[#00D26A] w-1/3 h-full rounded-full transition-all"></div>
        </div>

        <div className="font-black text-slate-400">1/3</div>
      </header>

      {/* KHÔNG GIAN CÂU HỎI VÀ ĐÁP ÁN */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* CÂU HỎI */}
          <div className="text-center mb-10 w-full relative">
            <button 
              onClick={handlePlayAudio}
              className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 hover:scale-110 transition-transform cursor-pointer"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
              {question.text}
            </h2>
          </div>

          {/* LƯỚI ĐÁP ÁN KHỔNG LỒ (Không dùng Radio Button) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {question.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              
              // Logic màu sắc khi đã bấm nút Kiểm tra
              let stateClass = "bg-white border-slate-200 text-slate-700 hover:border-blue-300";
              if (isSelected && isCorrect === null) {
                stateClass = "bg-blue-50 border-blue-500 text-blue-700 ring-4 ring-blue-100";
              } else if (isSelected && isCorrect === true) {
                stateClass = "bg-green-50 border-green-500 text-green-700 ring-4 ring-green-100";
              } else if (isSelected && isCorrect === false) {
                stateClass = "bg-red-50 border-red-500 text-red-700 ring-4 ring-red-100";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (isCorrect !== true) {
                      setSelectedAnswer(opt.id);
                      setIsCorrect(null);
                    }
                  }}
                  className={cn(
                    "w-full py-8 rounded-[2rem] border-4 text-3xl font-black transition-all cursor-pointer shadow-sm active:scale-95",
                    stateClass
                  )}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

        </div>
      </main>

      {/* FOOTER: Nút Kiểm tra dính chặt ở dưới (Sticky) */}
      <footer className="bg-white border-t border-slate-200 p-6 sm:p-8 shrink-0 flex justify-center">
        <button
          onClick={handleCheck}
          disabled={!selectedAnswer || isCorrect === true}
          className={cn(
            "w-full max-w-sm py-5 rounded-full font-black text-2xl flex items-center justify-center gap-3 transition-all",
            selectedAnswer && isCorrect !== true
              ? "bg-[#00D26A] text-white shadow-[0_8px_0_#00A854] hover:-translate-y-1 hover:shadow-[0_12px_0_#00A854] cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          Kiểm tra <ArrowRight className="w-8 h-8" />
        </button>
      </footer>

    </div>
  );
}
