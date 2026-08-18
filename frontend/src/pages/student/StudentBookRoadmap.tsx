import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Star, Lock, Play, Map, Flag, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { studentService } from '../../services/student.service';

export default function StudentBookRoadmap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');
  const [loading, setLoading] = useState(true);
  const [bookData, setBookData] = useState<any>(null);
  const currentNodeRef = useRef<HTMLDivElement | null>(null);

  // Học sinh đã học tới đâu thì vào lại trang phải thấy ngay bài đó (vd đã học đến
  // Bài 10 thì mở trang lên phải ở ngay Bài 10, không bắt kéo từ Bài 1 xuống).
  useEffect(() => {
    if (bookData && currentNodeRef.current) {
      currentNodeRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, [bookData]);

  // Bài "đang học" (CURRENT) đầu tiên theo đúng thứ tự lộ trình — mọi bài trước đó
  // đã COMPLETED, đây chính là vị trí học sinh đang dừng lại.
  const firstCurrentId = (() => {
    for (const chuDe of bookData?.chuDe || []) {
      for (const bai of chuDe.baiHoc || []) {
        if (bai.type === 'CURRENT') return bai.id;
      }
    }
    return null;
  })();

  useEffect(() => {
    if (!bookId) {
      toast.error('Không tìm thấy sách!');
      navigate('/student/library');
      return;
    }

    const fetchRoadmap = async () => {
      try {
        const data = await studentService.getBookRoadmap(Number(bookId));
        setBookData(data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu lộ trình sách:", err);
        toast.error('Lỗi khi tải lộ trình sách');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [bookId, navigate]);

  const handleNodeClick = (type: string, id: string) => {
    if (type === 'LOCKED') {
      toast('Bé hoàn thành bài trước để mở khóa nhé!', { icon: '🔒', duration: 2000 });
      return;
    }
    toast(type === 'COMPLETED' ? 'Ôn tập lại bài cũ...' : 'Bắt đầu bài mới!', { icon: '🚀', duration: 1500 });
    setTimeout(() => {
      toast.dismiss();
      navigate('/student/lesson/' + id + '?bookId=' + bookId);
    }, 1000);
  };

  // Tạo đường zigzag mềm mại hơn
  const getOffsetClass = (index: number) => {
    return index % 2 === 0 ? '-translate-x-12 sm:-translate-x-16' : 'translate-x-12 sm:translate-x-16';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F9FF] font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="min-h-screen bg-[#F4F9FF] font-sans flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Không tìm thấy lộ trình sách này</h2>
        <button onClick={() => navigate('/student/library')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Quay lại Tủ Sách</button>
      </div>
    );
  }

  return (
    // overflow-hidden KHÔNG được đặt ở div gốc này nữa — nó phá "position: sticky" của
    // header bên dưới (sticky tính theo tổ tiên có overflow khác "visible" gần nhất;
    // nếu là div gốc — vốn không thật sự cuộn — header sẽ "dính" sai chỗ, trôi mất khỏi
    // màn hình khi cuộn trang). Overflow-hidden chỉ cần cho riêng lớp trang trí nền phía
    // dưới (các hình tròn mờ tràn ra ngoài khung) nên tách ra 1 lớp riêng.
    // font-heading (Baloo 2) thay vì font-sans (Outfit) — chữ tròn trịa, dễ thương hơn,
    // hợp với học sinh lớp 1 hơn font mặc định vốn thiết kế cho giao diện người lớn.
    <div className="min-h-screen bg-[#F4F9FF] font-heading flex flex-col relative">

      {/* Background mây/trời bồng bềnh tạo chiều sâu */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-20 w-80 h-80 bg-green-100/40 rounded-full blur-3xl"></div>
      </div>

      {/* HEADER: Glassmorphism — top-16 (không phải top-0) vì StudentLayout đã có sẵn
          1 header ngoài cùng cao 64px (h-16) cũng sticky top-0 — nếu để top-0 ở đây,
          2 header cùng dính vào y=0, đè lên nhau, khiến header trang này mất tác dụng
          sticky thật sự và nội dung cuộn xuyên qua được. */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-16 z-40 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <button 
          onClick={() => navigate('/student/library')}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2 bg-white/80 px-5 py-2 rounded-full shadow-sm border border-slate-100">
          <Map className="w-5 h-5 text-blue-500" />
          <h1 className="text-lg font-black text-slate-700 tracking-tight uppercase">
            {bookData.tenSach}
          </h1>
        </div>

        <div className="w-12"></div>
      </header>

      {/* BẢN ĐỒ HÀNH TRÌNH */}
      {/* pb-28: chừa chỗ cho thanh điều hướng nổi (Trang Chủ/Thư Viện/Thành Tích) của
          StudentLayout — fixed ở đáy màn hình, nếu không sẽ đè lên các bài cuối cùng. */}
      <main className="flex-1 py-12 pb-28 flex flex-col items-center relative z-10">
        
        {/* Đường mòn (Trail) đứt nét chạy dọc mượt mà hơn */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-[2px] w-[4px] border-l-4 border-dashed border-blue-200/70 z-0"></div>

        <div className="w-full max-w-md relative z-10 flex flex-col items-center">
          
          {bookData.chuDe.map((chuDe: any) => (
            <div key={chuDe.id} className="w-full flex flex-col items-center mb-16 relative">
              
              {/* TRẠM DỪNG CHÂN (Tên Chủ Đề) - Thiết kế như một tấm biển báo cao cấp */}
              <div className="bg-white/90 backdrop-blur-md px-8 py-3.5 rounded-2xl border-b-4 border-slate-200 shadow-sm flex items-center gap-3 mb-12 relative z-20 hover:-translate-y-1 transition-transform">
                <span className="text-2xl drop-shadow-sm">{chuDe.icon}</span>
                <h2 className="text-lg font-black text-slate-700 uppercase tracking-widest text-center">
                  {chuDe.tenChuDe}
                </h2>
                
                {/* 2 cái đinh ảo gắn biển báo vào đường */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2 h-6 bg-slate-300 rounded-full -z-10"></div>
              </div>

              {/* DANH SÁCH BÀI HỌC (Các Node) */}
              <div className="flex flex-col gap-24 w-full items-center pt-8 pb-12">
                {chuDe.baiHoc.map((bai: any, bIndex: number) => {
                  const offset = getOffsetClass(bIndex);
                  const isCurrent = bai.type === 'CURRENT';
                  const isCompleted = bai.type === 'COMPLETED';
                  const isLocked = bai.type === 'LOCKED';

                  return (
                    <div
                      key={bai.id}
                      ref={bai.id === firstCurrentId ? currentNodeRef : undefined}
                      className={cn("relative transition-transform duration-500 flex items-center justify-center", offset)}
                    >
                      {/* Nhân vật Cú Mèo bay lơ lửng ở bài hiện tại */}
                      {isCurrent && (
                        <div className="absolute -top-14 text-5xl animate-bounce drop-shadow-xl z-30">
                          🦉
                        </div>
                      )}

                      {/* Vòng sáng tỏa ra nếu là bài đang học */}
                      {isCurrent && (
                        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 scale-[1.8]"></div>
                      )}

                      <button
                        onClick={() => handleNodeClick(bai.type, bai.id)}
                        className={cn(
                          "w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center relative z-20 transition-all duration-300 cursor-pointer border-[4px]",
                          // Bài Đã Xong: Màu Vàng Gold sang trọng, có độ bóng
                          isCompleted && "bg-gradient-to-br from-amber-300 to-amber-500 border-white shadow-[0_10px_20px_rgba(251,191,36,0.3)] hover:scale-105 hover:shadow-[0_15px_30px_rgba(251,191,36,0.4)] text-white",
                          // Bài Hiện Tại: Màu Xanh rực rỡ, viền phát sáng
                          isCurrent && "bg-gradient-to-br from-blue-400 to-blue-600 border-white shadow-[0_10px_25px_rgba(59,130,246,0.4)] ring-8 ring-blue-500/20 scale-110 hover:scale-125 text-white",
                          // Bài Khóa: Kính mờ (Glassmorphism) hòa vào nền
                          isLocked && "bg-white/50 backdrop-blur-sm border-white/80 shadow-sm text-slate-400 cursor-not-allowed"
                        )}
                      >
                        {isCompleted && (
                          <>
                            <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-current drop-shadow-sm" />
                            <Sparkles className="absolute top-1 right-1 w-4 h-4 text-amber-100 opacity-70" />
                          </>
                        )}
                        {isCurrent && <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current drop-shadow-md ml-1" />}
                        {isLocked && <Lock className="w-8 h-8 opacity-50" />}

                        {/* Nhãn "Bài X" dạng Floating Tag, không còn dính chết vào nút */}
                        <div className={cn(
                          "absolute -bottom-8 whitespace-nowrap font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow-sm transition-colors",
                          isCurrent ? "bg-blue-600 text-white" : "bg-white text-slate-500 border border-slate-100"
                        )}>
                          Bài {bIndex + 1}
                        </div>
                        {/* Tên bài học */}
                        <div className="absolute -bottom-14 text-xs font-semibold text-slate-600 text-center max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis px-2">
                           {bai.tenBaiHoc}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

          {/* Đích đến cuối cùng */}
          <div className="mt-16 bg-gradient-to-b from-yellow-100 to-amber-100 p-8 rounded-full border-4 border-white shadow-xl relative z-20 flex flex-col items-center justify-center gap-2 hover:-translate-y-2 transition-transform cursor-pointer">
            <Flag className="w-12 h-12 text-amber-500 fill-amber-500 drop-shadow-md" />
            <span className="font-black text-amber-700 uppercase tracking-widest text-xs">Đích đến</span>
          </div>

        </div>
      </main>
    </div>
  );
}
