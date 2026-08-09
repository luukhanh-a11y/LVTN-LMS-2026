import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useParentContextStore } from '../../stores/useParentContextStore';
import { parentService } from '../../services/parent.service';

export default function ParentDashboard() {
  const { selectedChild } = useParentContextStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChild?.id) {
      setLoading(true);
      parentService.getDashboard(selectedChild.id)
        .then(data => setDashboardData(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedChild?.id]);

  const activeChild: any = selectedChild || { name: 'Học sinh', className: '...', avatar: 'C', school: 'Trường THPT' };
  const progressList = dashboardData?.recentProgress || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tổng Quan Học Tập</h2>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi tiến độ học tập gần đây của <strong className="text-slate-700">{activeChild.name}</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* TIẾN ĐỘ BÀI GIẢNG */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-lg">Tiến độ bài giảng gần đây</h3>
            </div>
            
            <div className="space-y-4">
              {progressList.map((item: any) => (
                <div key={item.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                        {item.subject}
                      </span>
                      <h4 className="font-bold text-slate-800 mt-2">{item.lesson}</h4>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.isCompleted ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                          <CheckCircle2 className="w-4 h-4" /> Đã học xong
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                          <Clock className="w-4 h-4" /> Đang học dở
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-500", item.isCompleted ? "bg-emerald-500" : "bg-blue-600")}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-600 shrink-0 w-10 text-right">{item.progress}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Thời gian học: {item.timeSpent}</p>
                </div>
              ))}

              {progressList.length === 0 && (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-white">
                  Chưa có dữ liệu học tập.
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* WIDGET THÔNG TIN TRƯỜNG LỚP */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <BookOpen className="w-24 h-24" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 mb-4">
                <span className="font-bold text-xl">{activeChild.avatar}</span>
              </div>
              
              <h3 className="font-bold text-xl mb-1">{activeChild.name}</h3>
              <p className="text-blue-100 font-medium text-sm">Lớp {activeChild.className || activeChild.class}</p>
              
              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-sm font-medium opacity-90">Trường</p>
                <p className="font-bold">{activeChild.school}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
               <h3 className="font-bold text-slate-900 text-lg">Huy hiệu mới nhất</h3>
             </div>
             {(dashboardData?.recentBadges || []).length > 0 ? (
               <div className="space-y-4">
                 {(dashboardData?.recentBadges || []).map((badge: any) => (
                    <div key={badge.id} className="flex items-center gap-4 border border-slate-100 p-3 rounded-xl bg-amber-50/30">
                      {badge.iconUrl ? (
                        <img src={badge.iconUrl} alt="badge" className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{badge.name}</p>
                        <p className="text-xs text-slate-500">{badge.date} • {badge.source === 'GIAO_VIEN' ? 'Giáo viên tặng' : 'Hệ thống tự động'}</p>
                      </div>
                    </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-6 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-sm">
                 Bé chưa nhận được huy hiệu nào.
               </div>
             )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4">Lưu ý</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
               Phụ huynh vui lòng nhắc nhở bé hoàn thành các bài giảng còn đang học dở (màu xanh lam). Kết quả học tập sẽ được tổng hợp tự động vào Bảng điểm ở mỗi cuối kỳ.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
