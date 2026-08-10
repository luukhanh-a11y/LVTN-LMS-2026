import { useState, useEffect } from 'react';
import { Trophy, ChevronLeft, Lock, Star, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
        // rewardData.huyHieu is an array of { id, ten, moTa, icon, daMoKhoa, ngayTrao }
        if (rewardData.huyHieu && rewardData.huyHieu.length > 0) {
          const mappedBadges = rewardData.huyHieu.map((b: any, index: number) => {
            const colors = ['bg-yellow-400', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-teal-400', 'bg-pink-400'];
            const shadows = ['shadow-yellow-500/40', 'shadow-red-500/40', 'shadow-blue-500/40', 'shadow-green-500/40', 'shadow-teal-500/40', 'shadow-pink-500/40'];
            const colorIdx = index % colors.length;
            
            return {
              id: b.id,
              name: b.ten,
              desc: b.moTa,
              icon: b.icon, // This is an image URL now
              color: colors[colorIdx],
              shadow: shadows[colorIdx],
              unlocked: b.daMoKhoa
            };
          });
          setBadges(mappedBadges);
          setUnlockedCount(mappedBadges.filter((b: any) => b.unlocked).length);
        } else {
          // Mock data fallback
          const mockBadges = [
            { id: 1, name: 'Siêu Chăm', icon: '🌟', color: 'bg-yellow-400', shadow: 'shadow-yellow-500/40', unlocked: true },
            { id: 2, name: 'Điểm 10', icon: '💯', color: 'bg-red-400', shadow: 'shadow-red-500/40', unlocked: true },
            { id: 3, name: 'Thông Minh', icon: '🦉', color: 'bg-blue-400', shadow: 'shadow-blue-500/40', unlocked: true },
            { id: 4, name: 'Tiến Bộ', icon: '🚀', color: 'bg-green-400', shadow: 'shadow-green-500/40', unlocked: false },
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
      toast('Cố gắng ngoan để nhận sticker này nhé!', { icon: '🔒', style: { fontSize: '18px', fontWeight: 'bold' } });
      return;
    }
    setSelectedBadge(badge);
    toast(`🔊 "Bé nhận được sticker: ${badge.name}"`, { icon: '🦉' });
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] pb-24 font-sans text-slate-900 flex flex-col items-center overflow-hidden relative">
      
      {/* Họa tiết nền vui tươi */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER Tối giản */}
      <header className="w-full max-w-4xl px-6 py-6 flex items-center justify-between z-20 sticky top-0">
        <button 
          onClick={() => navigate('/student')}
          className="w-14 h-14 rounded-full bg-white border-4 border-yellow-100 flex items-center justify-center text-yellow-600 hover:scale-110 transition-transform shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8 -ml-1" />
        </button>

        <div className="bg-white px-6 py-3 rounded-full border-4 border-yellow-100 shadow-sm flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <h1 className="font-black text-yellow-700 tracking-wide uppercase">
            Tủ Quà Của Bé
          </h1>
        </div>
        
        <div className="w-14"></div>
      </header>

      <main className="w-full max-w-4xl px-6 py-4 flex flex-col gap-6 items-center z-10">
        
        {/* THANH TIẾN ĐỘ BẰNG SAO NỔI (Không dùng khung, không dùng chữ) */}
        <div className="flex justify-center gap-3 mb-4">
          {[...Array(unlockedCount)].map((_, i) => (
            <Star 
              key={`star-${i}`} 
              className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 fill-yellow-400 drop-shadow-md animate-bounce" 
              style={{ animationDelay: `${i * 0.15}s` }} 
            />
          ))}
          {[...Array(badges.length - unlockedCount)].map((_, i) => (
            <Star 
              key={`empty-${i}`} 
              className="w-10 h-10 sm:w-12 sm:h-12 text-black/10 fill-black/5 drop-shadow-sm" 
            />
          ))}
        </div>

        {/* LƯỚI STICKER KHỔNG LỒ */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 w-full justify-items-center mt-2">
          {badges.map((badge) => {
            const isImage = badge.unlocked && (badge.icon?.startsWith('http') || badge.icon?.startsWith('/'));
            return (
              <button 
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={cn(
                  "relative flex flex-col items-center text-center transition-all duration-300 cursor-pointer group w-32 sm:w-40",
                  !badge.unlocked && "opacity-60 grayscale hover:grayscale-0"
                )}
              >
                {/* Hình dạng Sticker */}
                <div className={cn(
                  "w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center text-6xl sm:text-7xl mb-4 transition-all duration-300",
                  isImage ? "bg-transparent border-none shadow-none overflow-visible group-hover:scale-110 group-hover:-translate-y-2" : cn("rounded-full border-8 border-white overflow-hidden", badge.unlocked ? `${badge.color} shadow-xl ${badge.shadow} group-hover:scale-110 group-hover:-translate-y-2` : "bg-slate-300 shadow-none")
                )}>
                  {badge.unlocked ? (
                    isImage ? (
                      <img src={badge.icon} alt={badge.name} className="w-full h-full object-contain drop-shadow-md" />
                    ) : (
                      <span>{badge.icon}</span>
                    )
                  ) : (
                    <Lock className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                
                <h3 className={cn(
                  "font-black text-lg sm:text-xl",
                  badge.unlocked ? "text-slate-700 bg-white/80 px-4 py-1.5 rounded-full" : "text-slate-400"
                )}>
                  {badge.name}
                </h3>
              </button>
            );
          })}
        </section>

      </main>

      {/* POPUP PHÓNG TO STICKER */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center relative border-8 border-yellow-200 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute -top-6 -right-6 w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center border-4 border-white hover:scale-110 transition-transform shadow-lg cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Sticker Phóng to */}
            <div className={cn(
              "w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center text-7xl sm:text-8xl mb-6",
              (selectedBadge.icon?.startsWith('http') || selectedBadge.icon?.startsWith('/')) 
                ? "bg-transparent border-none shadow-none rounded-none overflow-visible" 
                : cn("rounded-full border-8 border-white overflow-hidden shadow-2xl", selectedBadge.color, selectedBadge.shadow)
            )}>
              {(selectedBadge.icon?.startsWith('http') || selectedBadge.icon?.startsWith('/')) ? (
                <img src={selectedBadge.icon} alt={selectedBadge.name} className="w-full h-full object-contain drop-shadow-2xl" />
              ) : (
                <span>{selectedBadge.icon}</span>
              )}
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">{selectedBadge.name}</h2>
            <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed">
              {selectedBadge.desc || "Bé rất giỏi khi đạt được sticker này. Hãy tiếp tục phát huy nhé!"}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
