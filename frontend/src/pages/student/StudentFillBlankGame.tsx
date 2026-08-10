import { useState } from 'react';
import { X, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function StudentFillBlankGame() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  // Giả lập Dữ liệu JSON từ API (Loại: DIEN_KHUYET)
  const gameData = {
    loai: 'DIEN_KHUYET',
    cauHoi: 'Em hãy chọn từ thích hợp điền vào chỗ trống nhé!',
    // Cấu trúc câu: Chữ và Ô trống đan xen nhau
    cauTruc: [
      { type: 'text', value: 'Con ' },
      { type: 'blank', id: 'b1' },
      { type: 'text', value: ' kêu meo meo, rất thích ăn ' },
      { type: 'blank', id: 'b2' },
      { type: 'text', value: ' và hay bắt chuột.' },
    ],
    // Các từ cho sẵn (Bao gồm cả đáp án đúng và từ gây nhiễu)
    tuKhoa: [
      { id: 'w1', word: 'chó' },
      { id: 'w2', word: 'mèo' },
      { id: 'w3', word: 'hạt' },
      { id: 'w4', word: 'cá' },
      { id: 'w5', word: 'cỏ' },
    ]
  };

  // State quản lý các ô trống: blankId -> wordId
  const [answers, setAnswers] = useState<Record<string, string | null>>({
    b1: null,
    b2: null
  });

  // Xử lý khi bé bấm vào một "Thẻ từ" ở Ngân hàng từ vựng
  const handleSelectWord = (wordId: string) => {
    if (isChecking) return;
    
    // Tìm ô trống đầu tiên chưa được điền
    const firstEmptyBlank = Object.keys(answers).find(key => answers[key] === null);
    
    if (firstEmptyBlank) {
      setAnswers(prev => ({ ...prev, [firstEmptyBlank]: wordId }));
    } else {
      toast('Các ô trống đã được điền hết rồi!', { icon: '💡' });
    }
  };

  // Xử lý khi bé bấm vào "Ô trống" để gỡ thẻ từ ra
  const handleRemoveWord = (blankId: string) => {
    if (isChecking || !answers[blankId]) return;
    setAnswers(prev => ({ ...prev, [blankId]: null }));
  };

  // Reset làm lại từ đầu
  const handleReset = () => {
    setAnswers({ b1: null, b2: null });
  };

  const handleSubmit = () => {
    setIsChecking(true);
    
    // Tạo Payload nộp bài
    const payload = {
      dapAnDienKhuyet: answers // Ví dụ: { b1: 'w2', b2: 'w4' }
    };
    
    console.log('Đang nộp bài Điền khuyết:', payload);
    
    toast.success('Xuất sắc! +15 XP', { 
      icon: '🌟',
      style: { background: '#22c55e', color: '#fff', fontWeight: 'bold' }
    });

    setTimeout(() => {
      navigate('/student'); 
    }, 2000);
  };

  // Kiểm tra xem bé đã điền hết các ô trống chưa
  const isAllFilled = Object.values(answers).every(val => val !== null);

  // Helper: Lấy nội dung chữ của wordId
  const getWordText = (wordId: string) => {
    return gameData.tuKhoa.find(w => w.id === wordId)?.word || '';
  };

  // Danh sách các từ còn lại trong Ngân hàng (chưa được chọn)
  const usedWordIds = Object.values(answers).filter(val => val !== null);
  const availableWords = gameData.tuKhoa.filter(w => !usedWordIds.includes(w.id));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col fixed inset-0 z-50">
      
      {/* HEADER */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-20">
        <button 
          onClick={() => navigate('/student')}
          className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div className="h-full bg-blue-500 rounded-full w-2/3 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="w-12 h-12 rounded-full flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Làm lại"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center p-6 sm:p-10">
        <div className="max-w-3xl w-full flex-1 flex flex-col">
          
          {/* LOA VÀ CÂU LỆNH (Hero) */}
          <div className="mb-12 text-center flex flex-col items-center">
            <button 
              onClick={() => toast('🔊 Đang đọc...', { icon: '🦉' })}
              className="mb-6 w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-500">
              {gameData.cauHoi}
            </h2>
          </div>

          {/* VÙNG CÂU HỎI ĐIỀN KHUYẾT */}
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border-2 border-slate-200 shadow-sm mb-12">
            <div className="text-2xl sm:text-4xl font-medium text-slate-800 leading-[3rem] sm:leading-[4.5rem]">
              {gameData.cauTruc.map((part, index) => {
                
                if (part.type === 'text') {
                  return <span key={index}>{part.value}</span>;
                }

                if (part.type === 'blank' && part.id) {
                  const selectedWordId = answers[part.id];
                  
                  return (
                    <button
                      key={part.id}
                      onClick={() => handleRemoveWord(part.id!)}
                      className={cn(
                        "inline-flex items-center justify-center min-w-[120px] px-6 h-12 sm:h-16 mx-2 align-middle rounded-2xl font-black text-xl sm:text-2xl transition-all cursor-pointer",
                        selectedWordId 
                          ? "bg-blue-500 text-white shadow-md border-b-4 border-blue-600 -translate-y-1 hover:bg-blue-600" 
                          : "bg-slate-100 text-slate-300 border-b-4 border-slate-200 hover:bg-slate-200 border-dashed"
                      )}
                    >
                      {selectedWordId ? getWordText(selectedWordId) : '___'}
                    </button>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* NGÂN HÀNG TỪ VỰNG (Word Bank) */}
          <div className="w-full bg-blue-50/50 p-6 rounded-[2rem] border-2 border-blue-100/50 mb-32">
            <p className="text-center text-sm font-bold text-blue-400 uppercase tracking-widest mb-6">
              Ngân hàng từ vựng
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {/* Hiển thị các từ chưa được điền */}
              {availableWords.map(word => (
                <button
                  key={word.id}
                  onClick={() => handleSelectWord(word.id)}
                  className="px-8 py-4 bg-white border-2 border-slate-200 rounded-[1.5rem] font-black text-xl text-slate-700 shadow-sm hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer active:scale-95 active:shadow-none"
                >
                  {word.word}
                </button>
              ))}
              
              {/* Nếu đã điền hết từ */}
              {availableWords.length === 0 && (
                <div className="text-slate-400 font-medium">Đã dùng hết thẻ từ rồi!</div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER NỘP BÀI */}
      <footer className={cn(
        "fixed bottom-0 left-0 right-0 p-6 flex justify-center transition-all duration-500 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]",
        isAllFilled ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}>
        <div className="max-w-3xl w-full flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isAllFilled || isChecking}
            className="flex items-center gap-3 px-10 py-5 bg-[#00D26A] text-white rounded-2xl font-black text-xl hover:bg-[#00e676] shadow-lg shadow-green-500/30 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {isChecking ? 'Đang nộp...' : 'KIỂM TRA'} 
            {!isChecking && <ArrowRight className="w-6 h-6" />}
          </button>
        </div>
      </footer>

    </div>
  );
}
