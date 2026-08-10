import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export default function StudentBookReader() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  // Giả lập Dữ liệu Bài giảng / Lý thuyết từ API
  const bookData = {
    tieuDe: 'Bài 1: Làm quen với chữ A',
    trang: [
      {
        id: 'p1',
        hinhAnh: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop', // Hình minh họa quả táo
        vanBan: 'A a - Quả Táo',
        amThanh: 'Chữ A. Quả Táo'
      },
      {
        id: 'p2',
        hinhAnh: 'https://images.unsplash.com/photo-1601314167099-232775b4d793?q=80&w=800&auto=format&fit=crop', // Hình minh họa cái ấm
        vanBan: 'A a - Cái Ấm nước',
        amThanh: 'Chữ A. Cái Ấm nước'
      },
      {
        id: 'p3',
        hinhAnh: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=800&auto=format&fit=crop', // Hình minh họa con cá
        vanBan: 'A a - Con Cá',
        amThanh: 'Chữ A. Con Cá'
      }
    ]
  };

  const isLastPage = currentPage === bookData.trang.length - 1;
  const isFirstPage = currentPage === 0;

  const handleNext = () => {
    if (!isLastPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePlayAudio = () => {
    const textToRead = bookData.trang[currentPage].amThanh;
    toast(`🔊 Đang đọc: "${textToRead}"`, { icon: '🦉' });
    
    // Tùy theo trang hiện tại (0 hoặc 1) mà gọi file MP3 tương ứng
    const audioUrl = currentPage === 0 ? '/book_a.mp3' : '/book_a_detail.mp3';
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  const handleComplete = () => {
    toast.success('Bé đã đọc xong bài! +10 XP', { 
      icon: '🎉',
      style: { background: '#22c55e', color: '#fff', fontWeight: 'bold' }
    });
    setTimeout(() => {
      navigate('/student/library'); // Đọc xong thì quay về Tủ sách
    }, 1500);
  };

  const progressPercent = Math.round(((currentPage + 1) / bookData.trang.length) * 100);

  return (
    <div className="min-h-screen bg-[#1E293B] font-sans flex flex-col fixed inset-0 z-50">
      
      {/* HEADER: Chế độ Dark mode nhẹ để tập trung vào nội dung sách */}
      <header className="px-6 py-4 flex items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-white/10 z-20">
        <button 
          onClick={() => navigate('/student/library')}
          className="w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Thanh Progress Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="font-bold text-slate-300 bg-white/10 px-4 py-2 rounded-full">
          {currentPage + 1} / {bookData.trang.length}
        </div>
      </header>

      {/* KHÔNG GIAN ĐỌC SÁCH */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        
        {/* Nút Lùi Lật trang (Bên trái) */}
        <button
          onClick={handlePrev}
          disabled={isFirstPage}
          className={cn(
            "absolute left-4 sm:left-8 z-20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
            isFirstPage 
              ? "bg-white/5 text-white/20 cursor-not-allowed" 
              : "bg-white/20 text-white hover:bg-white/30 hover:scale-110 shadow-lg cursor-pointer"
          )}
        >
          <ChevronLeft className="w-10 h-10 -ml-1" />
        </button>

        {/* TRANG SÁCH CHÍNH (Book Page) */}
        <div className="max-w-4xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[70vh] sm:h-[80vh] relative z-10 animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Nửa trên: Hình ảnh minh họa */}
          <div className="flex-1 bg-slate-100 relative group">
            <img 
              src={bookData.trang[currentPage].hinhAnh} 
              alt="Minh họa" 
              className="w-full h-full object-cover"
            />
            {/* Lớp mờ gradient để làm nổi text nếu có */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
          </div>

          {/* Nửa dưới: Chữ và Loa phát âm */}
          <div className="bg-white p-8 sm:p-12 flex items-center justify-between gap-6 shrink-0 border-t-8 border-slate-50">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-800 leading-tight">
              {bookData.trang[currentPage].vanBan}
            </h2>
            
            <button 
              onClick={handlePlayAudio}
              className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[1.5rem] flex items-center justify-center hover:bg-blue-200 hover:scale-105 transition-all cursor-pointer shrink-0 shadow-sm border-2 border-blue-200"
            >
              <Volume2 className="w-10 h-10" />
            </button>
          </div>

        </div>

        {/* Nút Tiến Lật trang (Bên phải) */}
        {!isLastPage && (
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-20 w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/30 hover:scale-110 shadow-lg cursor-pointer transition-all"
          >
            <ChevronRight className="w-10 h-10 ml-1" />
          </button>
        )}
      </main>

      {/* FOOTER: Chỉ hiện Nút Hoàn Thành khi đến trang cuối */}
      {isLastPage && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={handleComplete}
            className="flex items-center gap-3 px-12 py-6 bg-[#00D26A] text-white rounded-full font-black text-2xl hover:bg-[#00e676] shadow-[0_10px_40px_rgba(0,210,106,0.4)] hover:scale-105 transition-all duration-300 border-4 border-white cursor-pointer"
          >
            <CheckCircle2 className="w-8 h-8" /> HOÀN THÀNH BÀI ĐỌC
          </button>
        </div>
      )}

    </div>
  );
}
