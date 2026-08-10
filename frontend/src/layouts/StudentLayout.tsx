import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Home, BookOpen, Trophy } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useEffect, useRef, useState } from 'react';
import { userService } from '../services/user.service';


export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const [className, setClassName] = useState<string>('');
  // Dùng ref để tránh gọi API nhiều lần khi route thay đổi
  const hasFetchedProfile = useRef(false);
  
  const isLessonPage = location.pathname.includes('/student/lesson');

  useEffect(() => {
    if (user?.requirePasswordChange) {
      navigate('/force-change-password');
      return;
    }

    // Chỉ fetch 1 lần khi component mount, không chạy lại khi navigate
    if (hasFetchedProfile.current) return;
    hasFetchedProfile.current = true;

    userService.getMyProfile()
      .then((data: any) => {
        if (!user?.fullName) {
          updateUser({ fullName: data.fullName, avatarUrl: data.avatarUrl || undefined });
        }
        setClassName(data.className || data.lopHoc?.tenLop || 'Lớp ?');
      })
      .catch(err => console.error('[StudentLayout] Failed to fetch profile:', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi mount — intentional empty deps


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 font-sans relative">
      {/* Header */}
      {!isLessonPage && (
        <header className="h-16 bg-white border-b border-sky-100 flex items-center justify-between px-6 sticky top-0 z-10">
          <Link to="/student" className="flex items-center group">
            <img 
              src="https://www.titkul.vn/upload/photo/cropped-titkul-logo-header-7055.png" 
              alt="Titkul Kids" 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Nút Thông Báo (Hộp thư) */}
            <Link 
              to="/student/notifications"
              className="relative w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer border border-slate-200"
            >
              <Bell className="w-5 h-5" />
              {/* Giả lập có thông báo */}
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            </Link>

            {/* Link Profile & Đăng xuất */}
            <div className="flex items-center gap-3 hover:bg-sky-50 p-1.5 pr-3 rounded-full transition-colors cursor-pointer border border-transparent hover:border-sky-100 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user?.fullName || user?.username || 'Học sinh'}</p>
                <p className="text-xs font-semibold text-sky-600">{className}</p>
              </div>
              <Link to="/student/profile" className="w-10 h-10 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center font-bold text-sky-700 overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (user?.fullName || user?.username || 'H').charAt(0).toUpperCase()
                )}
              </Link>
              <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-500" title="Đăng xuất">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Vùng chứa nội dung */}
      <main className={isLessonPage ? "flex-1" : "flex-1 pb-24"}> 
        <Outlet />
      </main>

      {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG (DOCK) DÙNG CHUNG CHO MỌI TRANG HỌC SINH */}
      {!isLessonPage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-slate-100 flex items-center gap-6 sm:gap-10 z-50">
          
          <Link 
            to="/student" 
            className={`flex flex-col items-center gap-1.5 min-w-[64px] transition-all duration-300 cursor-pointer ${
              location.pathname === '/student' ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-blue-500 hover:scale-105'
            }`}
          >
            <div className={`p-2.5 rounded-2xl transition-colors ${location.pathname === '/student' ? 'bg-blue-50 shadow-sm' : 'bg-transparent'}`}>
              <Home className="w-6 h-6" strokeWidth={location.pathname === '/student' ? 2.5 : 2} />
            </div>
            <span className="text-[11px] font-black tracking-wide">Trang Chủ</span>
          </Link>

          <Link 
            to="/student/library" 
            className={`flex flex-col items-center gap-1.5 min-w-[64px] transition-all duration-300 cursor-pointer ${
              location.pathname.includes('/student/library') ? 'text-emerald-600 scale-105' : 'text-slate-400 hover:text-emerald-500 hover:scale-105'
            }`}
          >
            <div className={`p-2.5 rounded-2xl transition-colors ${location.pathname.includes('/student/library') ? 'bg-emerald-50 shadow-sm' : 'bg-transparent'}`}>
              <BookOpen className="w-6 h-6" strokeWidth={location.pathname.includes('/student/library') ? 2.5 : 2} />
            </div>
            <span className="text-[11px] font-black tracking-wide">Thư Viện</span>
          </Link>

          <Link 
            to="/student/trophy" 
            className={`flex flex-col items-center gap-1.5 min-w-[64px] transition-all duration-300 cursor-pointer ${
              location.pathname.includes('/student/trophy') ? 'text-amber-500 scale-105' : 'text-slate-400 hover:text-amber-500 hover:scale-105'
            }`}
          >
            <div className={`p-2.5 rounded-2xl transition-colors ${location.pathname.includes('/student/trophy') ? 'bg-amber-50 shadow-sm' : 'bg-transparent'}`}>
              <Trophy className="w-6 h-6" strokeWidth={location.pathname.includes('/student/trophy') ? 2.5 : 2} />
            </div>
            <span className="text-[11px] font-black tracking-wide">Thành Tích</span>
          </Link>

        </div>
      )}
    </div>
  );
}
