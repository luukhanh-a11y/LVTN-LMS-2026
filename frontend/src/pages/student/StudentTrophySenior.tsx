import { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Trophy, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { studentService } from '../../services/student.service';

export default function StudentTrophySenior() {
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
            const colors = ['bg-blue-50 text-blue-600', 'bg-emerald-50 text-emerald-600', 'bg-indigo-50 text-indigo-600', 'bg-rose-50 text-rose-600', 'bg-amber-50 text-amber-600', 'bg-violet-50 text-violet-600'];
            const colorIdx = index % colors.length;
            
            return {
              id: b.id,
              name: b.ten,
              desc: b.moTa,
              icon: b.icon,
              colorClass: colors[colorIdx],
              unlocked: b.daMoKhoa
            };
          });
          setBadges(mappedBadges);
          setUnlockedCount(mappedBadges.filter((b: any) => b.unlocked).length);
        } else {
          // Mock data fallback
          const mockBadges = [
            { id: 1, name: 'Siêu Chăm', icon: '🌟', colorClass: 'bg-blue-50 text-blue-600', unlocked: true },
            { id: 2, name: 'Điểm 10', icon: '💯', colorClass: 'bg-emerald-50 text-emerald-600', unlocked: true },
            { id: 3, name: 'Thông Minh', icon: '🦉', colorClass: 'bg-indigo-50 text-indigo-600', unlocked: true },
            { id: 4, name: 'Tiến Bộ', icon: '🚀', colorClass: 'bg-rose-50 text-rose-600', unlocked: false },
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
      toast('Hãy hoàn thành thêm bài tập để mở khóa huy hiệu này nhé.', { icon: '🔒', style: { fontSize: '16px', fontWeight: '500' } });
      return;
    }
    setSelectedBadge(badge);
    toast(`Mở khóa: ${badge.name}`, { icon: '🏆', style: { fontSize: '16px', fontWeight: '500' } });
  };

  const progressPercent = badges.length > 0 ? Math.round((unlockedCount / badges.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-pro text-slate-900 flex justify-center">
      <div className="w-full max-w-4xl p-6 sm:p-10 space-y-12">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mt-4">
          <button 
            onClick={() => navigate('/student')}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 -ml-0.5" />
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bộ Sưu Tập</h1>
          </div>
          
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <Trophy className="w-6 h-6" />
          </div>
        </header>

        {/* PROGRESS BENTO CARD */}
        <section className="bg-white p-6 sm:p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex-1 w-full text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Tiến độ thu thập</h2>
            <p className="text-slate-500 font-medium">
              Em đã thu thập được <strong className="text-blue-600">{unlockedCount} / {badges.length}</strong> huy hiệu.
            </p>
          </div>
          
          <div className="w-full sm:w-1/2 flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Hoàn thành</span>
              <span className="text-2xl font-black text-blue-600">{progressPercent}%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* GRID HUY HIỆU */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const isImage = badge.unlocked && (badge.icon?.startsWith('http') || badge.icon?.startsWith('/'));
            
            return (
              <button 
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-[2rem] transition-all duration-300 cursor-pointer group h-64",
                  badge.unlocked 
                    ? "bg-white border-2 border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md" 
                    : "bg-slate-50 border-2 border-slate-100/50 opacity-60 grayscale hover:grayscale-0 hover:bg-slate-100"
                )}
              >
                {/* ICON / IMAGE */}
                <div className={cn(
                  "w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-5xl mb-6 transition-all duration-300",
                  isImage 
                    ? "bg-transparent border-none shadow-none overflow-visible group-hover:scale-110 group-hover:-translate-y-2" 
                    : cn("rounded-full", badge.unlocked ? `${badge.colorClass} group-hover:scale-110 group-hover:-translate-y-2` : "bg-slate-200 text-slate-400")
                )}>
                  {badge.unlocked ? (
                    isImage ? (
                      <img src={badge.icon} alt={badge.name} className="w-full h-full object-contain drop-shadow-sm" />
                    ) : (
                      <span>{badge.icon}</span>
                    )
                  ) : (
                    <Lock className="w-10 h-10" />
                  )}
                </div>
                
                {/* NAME */}
                <h3 className={cn(
                  "font-bold text-lg text-center",
                  badge.unlocked ? "text-slate-800" : "text-slate-400"
                )}>
                  {badge.name}
                </h3>
              </button>
            );
          })}
        </section>

      </div>

      {/* MODAL CHI TIẾT HUY HIỆU */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center relative border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white text-slate-600 rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors shadow-lg cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className={cn(
              "w-40 h-40 mx-auto flex items-center justify-center text-7xl mb-8",
              (selectedBadge.icon?.startsWith('http') || selectedBadge.icon?.startsWith('/')) 
                ? "bg-transparent border-none shadow-none rounded-none overflow-visible" 
                : cn("rounded-full", selectedBadge.colorClass)
            )}>
              {(selectedBadge.icon?.startsWith('http') || selectedBadge.icon?.startsWith('/')) ? (
                <img src={selectedBadge.icon} alt={selectedBadge.name} className="w-full h-full object-contain drop-shadow-xl" />
              ) : (
                <span>{selectedBadge.icon}</span>
              )}
            </div>
            
            <h2 className="text-3xl font-black text-slate-800 mb-4">{selectedBadge.name}</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              {selectedBadge.desc || "Tuyệt vời! Em đã hoàn thành xuất sắc nhiệm vụ để đạt được huy hiệu này."}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
