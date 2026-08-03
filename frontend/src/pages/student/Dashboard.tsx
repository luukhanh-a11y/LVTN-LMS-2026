import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bell, ArrowRight, Loader2, BookOpen, Sparkles, CheckSquare } from 'lucide-react';
import { studentService } from '../../services/student.service';
import { cn } from '../../lib/utils';
import { PageTitle } from '../../components/ui/PageTitle';
import titiMascot from '../../assets/titi-2d.png';

const XP_PER_LEVEL = 500;

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const totalXp: number = dashboardData?.totalXp || 0;
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;
  const levelProgressPercent = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await studentService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Banner - Premium Gradient */}
      <div className="bg-gradient-to-br from-student-primary via-student-primary to-student-accent rounded-[32px] p-10 mb-10 text-white shadow-[0_20px_40px_-15px_rgba(75,158,255,0.4)] flex items-center justify-between overflow-hidden relative group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:translate-x-1/4 transition-transform duration-1000"></div>
        
        <div className="relative z-10 max-w-2xl">
          <PageTitle className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">Chào em, hôm nay mình học gì?</PageTitle>
          <p className="text-white/80 mb-8 text-lg font-medium max-w-lg leading-relaxed">Hãy chọn một môn học bên dưới để tiếp tục hành trình khám phá tri thức nhé!</p>
          
          <div className="flex flex-wrap gap-4 items-center">
            {/* Thanh Level / XP — tính thật từ totalXp (500 XP/cấp), không còn số cứng giả */}
            <div className="inline-flex flex-col bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 min-w-[240px]">
               <div className="flex justify-between items-center text-sm font-bold mb-2 text-white/90">
                  <span className="flex items-center"><Sparkles className="w-4 h-4 text-amber-300 mr-1.5" /> Cấp {level}</span>
                  <span>{xpIntoLevel} / {XP_PER_LEVEL} XP</span>
               </div>
               <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full relative" style={{ width: `${levelProgressPercent}%` }}>
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Mascot Tit */}
        <div className="hidden lg:flex w-48 h-48 bg-white/10 backdrop-blur-xl rounded-[40px] rotate-12 items-center justify-center border border-white/20 shadow-2xl relative z-10 group-hover:rotate-6 transition-transform duration-700 overflow-hidden">
          <img src={titiMascot} alt="Tit - người bạn đồng hành học tập" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content (Môn học) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Danh sách môn học</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-[24px] border border-slate-200 shadow-sm">
               <Loader2 className="w-8 h-8 animate-spin text-student-primary" />
            </div>
          ) : !dashboardData?.subjects || dashboardData.subjects.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] p-12 text-center flex flex-col items-center">
               <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
               <p className="text-slate-500 font-medium text-lg">Chưa có bài học nào được giao.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.subjects.map((sub: any) => (
                <div key={sub.id} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-student-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-student-primary/10 rounded-bl-[100px] -z-10 group-hover:bg-student-primary/20 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-8">
                      <div className="pr-4">
                        <h3 className="text-xl font-bold text-slate-800 mb-1.5">{sub.name}</h3>
                        <p className="text-[15px] text-slate-500 font-medium line-clamp-2">{sub.desc || 'Khám phá tri thức mới mỗi ngày'}</p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-student-primary/10 text-student-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-student-primary group-hover:text-white transition-all duration-300 shadow-sm">
                        <BookOpen className="w-7 h-7" />
                      </div>
                  </div>

                  <div className="mb-8 mt-auto">
                      <div className="flex justify-between text-sm font-bold text-slate-600 mb-2.5">
                        <span>Tiến trình học</span>
                        <span className="text-student-primary">{sub.progress}%</span>
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden bg-slate-100 shadow-inner">
                        <div className="bg-student-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${sub.progress}%` }}></div>
                      </div>
                  </div>

                  <Link to={`/student/subject/${sub.id}`} className="block">
                      <button className="w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center bg-slate-50 text-slate-700 group-hover:bg-student-primary group-hover:text-white group-active:scale-[0.98]">
                        Tiếp tục học <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Widgets (To-do & Notifications) */}
        <div className="space-y-8">
           {/* Widget: Bài tập sắp đến hạn */}
           <div className="bg-white rounded-[24px] p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-black text-slate-800 flex items-center">
                    <Clock className="w-5 h-5 text-orange-500 mr-2.5 stroke-[2.5px]" /> Cần làm ngay
                 </h2>
                 <Link to="/student/tasks" className="text-sm font-bold text-student-primary hover:text-student-accent transition-colors">Tất cả</Link>
              </div>
              <div className="space-y-3">
                 {dashboardData?.upcomingTasks?.map((task: any) => (
                    <Link to="/student/tasks" key={task.id} className="block p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm transition-all active:scale-[0.98] group">
                       <h3 className="font-bold text-slate-700 group-hover:text-orange-800 text-[15px] line-clamp-1 mb-2">{task.title}</h3>
                       <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-slate-500 group-hover:text-orange-600/80">{task.subject}</span>
                          <span className="text-orange-700 bg-orange-100 px-2.5 py-1 rounded-lg">{task.time}</span>
                       </div>
                    </Link>
                 ))}
                 {(!dashboardData?.upcomingTasks || dashboardData.upcomingTasks.length === 0) && (
                   <div className="py-6 text-center">
                     <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                       <CheckSquare className="w-6 h-6 text-green-500" />
                     </div>
                     <p className="text-[15px] font-medium text-slate-500">Em không có bài tập nào sắp đến hạn!</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Widget: Thông báo mới */}
           <div className="bg-white rounded-[24px] p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-black text-slate-800 flex items-center">
                    <Bell className="w-5 h-5 text-student-primary mr-2.5 stroke-[2.5px]" /> Thông báo mới
                 </h2>
                 <Link to="/student/notifications" className="text-sm font-bold text-student-primary hover:text-student-accent transition-colors">Tất cả</Link>
              </div>
              <div className="space-y-3">
                 {dashboardData?.recentNotifications?.map((noti: any) => (
                    <Link to="/student/notifications" key={noti.id} className="block p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-student-primary/30 hover:bg-student-primary/5 hover:shadow-sm transition-all active:scale-[0.98] group relative overflow-hidden">
                       {noti.isNew && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-student-primary"></div>}
                       <h3 className={cn("text-[15px] line-clamp-2", noti.isNew ? "font-bold text-slate-800" : "font-semibold text-slate-600 group-hover:text-student-primary")}>
                         {noti.title}
                       </h3>
                    </Link>
                 ))}
                 {(!dashboardData?.recentNotifications || dashboardData.recentNotifications.length === 0) && (
                   <p className="text-[15px] text-slate-500 text-center py-4 font-medium">Không có thông báo mới.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
