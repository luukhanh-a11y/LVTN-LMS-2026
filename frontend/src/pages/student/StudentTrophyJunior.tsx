import { useState, useEffect } from 'react';
import { Trophy, ChevronLeft, Lock, Star, X, Sparkles, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { studentService } from '../../services/student.service';

export default function StudentTrophyJunior() {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const rewardData = await studentService.getRewards();
        if (rewardData.huyHieu && rewardData.huyHieu.length > 0) {
          const mappedBadges = rewardData.huyHieu.map((b: any, index: number) => {
            const colors = ['bg-amber-400', 'bg-rose-400', 'bg-sky-400', 'bg-emerald-400', 'bg-violet-400', 'bg-fuchsia-400'];
            const borders = ['border-amber-500', 'border-rose-500', 'border-sky-500', 'border-emerald-500', 'border-violet-500', 'border-fuchsia-500'];
            const colorIdx = index % colors.length;

            return {
              id: b.id,
              name: b.ten,
              desc: b.moTa,
              icon: b.icon,
              color: colors[colorIdx],
              borderColor: borders[colorIdx],
              unlocked: b.daMoKhoa
            };
          });
          setBadges(mappedBadges);
          setUnlockedCount(mappedBadges.filter((b: any) => b.unlocked).length);
        } else {
          // Mock data fallback vui nhộn hơn
          const mockBadges = [
            { id: 1, name: 'Siêu Chăm', icon: '🌟', color: 'bg-amber-400', borderColor: 'border-amber-500', unlocked: true },
            { id: 2, name: 'Điểm 10', icon: '💯', color: 'bg-rose-400', borderColor: 'border-rose-500', unlocked: true },
            { id: 3, name: 'Thông Minh', icon: '🦉', color: 'bg-sky-400', borderColor: 'border-sky-500', unlocked: true },
            { id: 4, name: 'Tiến Bộ', icon: '🚀', color: 'bg-emerald-400', borderColor: 'border-emerald-500', unlocked: false },
            { id: 5, name: 'Lễ Phép', icon: '🙇‍♂️', color: 'bg-violet-400', borderColor: 'border-violet-500', unlocked: false },
            { id: 6, name: 'Sáng Tạo', icon: '🎨', color: 'bg-fuchsia-400', borderColor: 'border-fuchsia-500', unlocked: false },
          ];
          setBadges(mockBadges);
          setUnlockedCount(mockBadges.filter(b => b.unlocked).length);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRewards();
  }, []);

  const handleBadgeClick = (badge: any) => {
    if (!badge.unlocked) {
      toast('Cố gắng ngoan để mở khóa nha!', {
        icon: '🔒',
        style: { fontFamily: "'Nunito', sans-serif", fontSize: '20px', fontWeight: '900', borderRadius: '20px', padding: '16px' }
      });
      return;
    }
    setSelectedBadge(badge);
    toast(`🔊 "Bé nhận được: ${badge.name}"`, {
      icon: '✨',
      style: { fontFamily: "'Nunito', sans-serif", fontWeight: '700' }
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-green-100 pb-24 text-slate-900 flex flex-col items-center overflow-hidden relative selection:bg-rose-300"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >

      {/* BACKGROUND ĐÁM Mây HOẠT HÌNH */}
      <div className="absolute top-10 left-4 opacity-50 animate-pulse"><Cloud className="w-24 h-24 text-white fill-white" /></div>
      <div className="absolute top-32 right-10 opacity-70" style={{ animation: 'bounce 4s infinite' }}><Cloud className="w-32 h-32 text-white fill-white" /></div>
      <div className="absolute top-80 -left-10 opacity-60"><Cloud className="w-40 h-40 text-white fill-white" /></div>

      {/* HEADER GAME-LIKE */}
      <header className="w-full max-w-4xl px-4 py-6 flex items-center justify-between z-20 sticky top-0">
        <button
          onClick={() => navigate('/student')}
          className="w-16 h-16 rounded-full bg-white border-b-8 border-slate-200 flex items-center justify-center text-sky-500 hover:scale-105 active:border-b-0 active:translate-y-2 transition-all shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-10 h-10 -ml-1 pr-1" strokeWidth={4} />
        </button>

        {/* Bỏ transform rotate-2 ở đây để thẻ nằm thẳng */}
        <div className="bg-white px-8 py-3 rounded-full border-4 border-b-8 border-sky-400 shadow-xl flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-400 animate-bounce" />
          <h1 className="font-black text-2xl text-sky-600 tracking-wider uppercase drop-shadow-sm">
            Tủ Quà Của Bé
          </h1>
        </div>

        <div className="w-16"></div> {/* Spacer */}
      </header>

      <main className="w-full max-w-4xl px-4 py-4 flex flex-col gap-10 items-center z-10">

        {/* THANH TIẾN ĐỘ TRÊN ĐÁM MÂY */}
        <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-[3rem] shadow-xl border-4 border-white flex flex-col items-center gap-2">
          <span className="font-black text-rose-500 text-lg uppercase tracking-widest">Bé đã gom được</span>
          <div className="flex justify-center gap-2 sm:gap-4">
            {[...Array(unlockedCount)].map((_, i) => (
              <div key={`star-${i}`} className="relative">
                <Star
                  className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 fill-amber-400 drop-shadow-lg"
                  style={{ animation: `bounce 2s infinite ${i * 0.2}s` }}
                />
                <Sparkles className="w-6 h-6 text-yellow-200 absolute -top-2 -right-2 animate-ping" />
              </div>
            ))}
            {[...Array(Math.max(0, badges.length - unlockedCount))].map((_, i) => (
              <Star
                key={`empty-${i}`}
                className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 fill-slate-200 drop-shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* LƯỚI THẺ BÀI (CHUNKY CARDS) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full justify-items-center mt-4">
          {badges.map((badge) => {
            const isImage = badge.unlocked && (badge.icon?.startsWith('http') || badge.icon?.startsWith('/'));

            return (
              <button
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-4 w-40 h-48 sm:w-48 sm:h-56 rounded-3xl transition-all duration-300 cursor-pointer group outline-none",
                  badge.unlocked
                    ? `bg-white border-4 border-b-[12px] ${badge.borderColor} hover:-translate-y-4 hover:rotate-3 shadow-xl active:border-b-4 active:translate-y-2`
                    : "bg-slate-200 border-4 border-b-[12px] border-slate-300 opacity-80 hover:opacity-100 shadow-md active:border-b-4 active:translate-y-2"
                )}
              >
                {/* Vòng sáng nhạt phía sau icon */}
                {badge.unlocked && (
                  <div className={cn("absolute top-8 w-24 h-24 rounded-full opacity-30 blur-xl", badge.color)}></div>
                )}

                {/* Hình dạng Sticker */}
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-7xl sm:text-8xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {badge.unlocked ? (
                    isImage ? (
                      <img src={badge.icon} alt={badge.name} className="w-full h-full object-contain drop-shadow-xl" />
                    ) : (
                      <span className="drop-shadow-2xl">{badge.icon}</span>
                    )
                  ) : (
                    <div className="w-20 h-20 bg-slate-300 rounded-full flex items-center justify-center shadow-inner border-4 border-slate-400">
                      <Lock className="w-10 h-10 text-slate-500" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Tên nhãn dán */}
                <h3 className={cn(
                  "font-black text-xl sm:text-2xl mt-2 relative z-10",
                  badge.unlocked ? "text-slate-800" : "text-slate-500"
                )}>
                  {badge.name}
                </h3>
              </button>
            );
          })}
        </section>

      </main>

      {/* POPUP ĂN MỪNG SIÊU TO KHỔNG LỒ */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">

          {/* Hiệu ứng hào quang xoay tròn (Sunburst) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[800px] bg-[conic-gradient(from_0deg,transparent_0_15deg,#fff3_15deg_30deg,transparent_30deg_45deg,#fff3_45deg_60deg,transparent_60deg_75deg,#fff3_75deg_90deg,transparent_90deg_105deg,#fff3_105deg_120deg,transparent_120deg_135deg,#fff3_135deg_150deg,transparent_150deg_165deg,#fff3_165deg_180deg,transparent_180deg_195deg,#fff3_195deg_210deg,transparent_210deg_225deg,#fff3_225deg_240deg,transparent_240deg_255deg,#fff3_255deg_270deg,transparent_270deg_285deg,#fff3_285deg_300deg,transparent_300deg_315deg,#fff3_315deg_330deg,transparent_330deg_345deg,#fff3_345deg_360deg)] animate-[spin_10s_linear_infinite] opacity-50 rounded-full blur-sm"></div>
          </div>

          {/* Nội dung Popup */}
          <div className="bg-white rounded-[3rem] p-8 sm:p-12 max-w-md w-full text-center relative border-8 border-b-[16px] border-amber-400 shadow-2xl animate-in zoom-in-75 duration-300 z-10">

            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute -top-8 -right-8 w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center border-4 border-white hover:scale-110 hover:rotate-90 transition-all shadow-xl cursor-pointer"
            >
              <X className="w-10 h-10" strokeWidth={4} />
            </button>

            {/* Chữ ăn mừng cực lớn */}
            <h2 className="text-4xl sm:text-5xl font-black text-rose-500 mb-6 drop-shadow-sm uppercase tracking-wider animate-bounce">
              Woa! Giỏi Quá!
            </h2>

            {/* Sticker Phóng to lơ lửng */}
            <div className={cn(
              "w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center text-8xl sm:text-9xl mb-8 transition-transform",
              (selectedBadge.icon?.startsWith('http') || selectedBadge.icon?.startsWith('/'))
                ? "bg-transparent border-none shadow-none"
                : cn("rounded-full border-8 border-white shadow-2xl", selectedBadge.color)
            )}
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              {(selectedBadge.icon?.startsWith('http') || selectedBadge.icon?.startsWith('/')) ? (
                <img src={selectedBadge.icon} alt={selectedBadge.name} className="w-full h-full object-contain drop-shadow-2xl" />
              ) : (
                <span className="drop-shadow-xl">{selectedBadge.icon}</span>
              )}
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4 bg-amber-100 py-2 px-6 rounded-full inline-block border-4 border-amber-200">
              {selectedBadge.name}
            </h3>

            <p className="text-slate-600 text-xl font-bold leading-relaxed">
              {selectedBadge.desc || "Bé hãy ngoan như vậy nữa nha! 💖"}
            </p>
          </div>
        </div>
      )}

      {/* NHÚNG TRỰC TIẾP FONT CHỮ & ANIMATION */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}} />

    </div>
  );
}