import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Map, CheckSquare, Trophy, Gem, Star, UserCircle } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useEffect } from 'react';
import { userService } from '../services/user.service';

export default function StudentLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  useEffect(() => {
    if (user?.requirePasswordChange) {
      navigate('/force-change-password');
      return;
    }

    if (user && !user.fullName) {
      userService.getMyProfile()
        .then(data => {
          updateUser({ fullName: data.fullName, avatarUrl: data.avatarUrl || undefined });
        })
        .catch(err => console.error("Failed to fetch profile", err));
    }
  }, [user, navigate, updateUser]);

  return (
    <div className="flex min-h-[100dvh] font-body bg-[#f8fafc]">
      {/* Sidebar - Premium Kids UI */}
      <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] fixed h-full">
        <div className="p-6 flex items-center border-b border-slate-100">
          <Link to="/student" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-indigo-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 group-active:scale-95 transition-transform">
              <span className="text-white font-black text-2xl">T</span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">Titkul Kids</span>
          </Link>
        </div>

        <nav className="flex-1 p-5 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Khám phá</div>
          
          <NavLink 
            to="/student"
            end
            className={({ isActive }) => 
              `flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-[inset_0_0_0_2px_#c7d2fe]' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Map className="w-6 h-6 stroke-[2.5px]" />
            <span className="text-[15px]">Lộ trình học tập</span>
          </NavLink>

          <NavLink 
            to="/student/tasks"
            className={({ isActive }) => 
              `flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] ${
                isActive 
                  ? 'bg-orange-50 text-orange-700 shadow-[inset_0_0_0_2px_#fdba74]' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <CheckSquare className="w-6 h-6 stroke-[2.5px]" />
            <span className="text-[15px]">Bài tập hôm nay</span>
          </NavLink>

          <NavLink 
            to="/student/rewards"
            className={({ isActive }) => 
              `flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] ${
                isActive 
                  ? 'bg-amber-50 text-amber-700 shadow-[inset_0_0_0_2px_#fcd34d]' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Trophy className="w-6 h-6 stroke-[2.5px]" />
            <span className="text-[15px]">Thành tích</span>
          </NavLink>
        </nav>

        {/* Thông tin nhân vật */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center space-x-2">
                <Gem className="w-5 h-5 text-cyan-500 fill-cyan-100" />
                <span className="font-black text-cyan-700 text-[15px]">1,250</span>
             </div>
             <div className="w-px h-6 bg-slate-200"></div>
             <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-100" />
                <span className="font-black text-amber-600 text-[15px]">42</span>
             </div>
          </div>
          
          <div className="flex gap-2">
            <Link to="/student/profile" className="flex-1 flex items-center space-x-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all active:scale-[0.98] group cursor-pointer font-bold shadow-sm">
              <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-6 h-6 text-indigo-600" />
                )}
              </div>
              <span className="truncate flex-1 text-[15px]">{user?.fullName || user?.username || 'Học sinh'}</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden ml-[280px]">
        {/* Header Phụ (Glassmorphism) */}
        <header className="h-[72px] flex items-center justify-between px-8 z-10 sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
          <div className="relative w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5px]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bài học..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-2 border-transparent rounded-xl font-medium text-[15px] focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center space-x-4">
             <Link to="/student/notifications" className="relative p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-all active:scale-[0.95] block">
               <Bell className="w-5 h-5 stroke-[2.5px]" />
               <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full shadow-sm"></span>
             </Link>
          </div>
        </header>

        {/* Vùng Render Trang Con */}
        <div className="flex-1 overflow-y-auto p-10 relative">
          <div className="max-w-[1200px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
