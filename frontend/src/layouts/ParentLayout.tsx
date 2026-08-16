import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, Bell, Award,
  LogOut, ChevronDown, Check, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { userService } from '../services/user.service';
import { useParentContextStore } from '../stores/useParentContextStore';
import { parentService } from '../services/parent.service';
import { useAcademicStore } from '../stores/useAcademicStore';
import { academicService, type NamHoc } from '../services/academic.service';
import { cn } from '../lib/utils';
import { Calendar } from 'lucide-react';

function NavItem({ to, icon: Icon, label }: { to: string, icon: React.ElementType, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/parent' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm",
        isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-blue-700" : "text-slate-400")} />
      {label}
    </Link>
  );
}

function ChildSelectorDropdown() {
  const { selectedChild, setSelectedChild } = useParentContextStore();
  const [children, setChildren] = useState<any[]>([]);
  const [showChildSelect, setShowChildSelect] = useState(false);

  useEffect(() => {
    parentService.getChildren().then(data => {
      setChildren(data);
    }).catch(console.error);
  }, []);

  if (children.length === 0) return null;
  const activeChild = selectedChild || children[0];

  const handleSelect = (child: any) => {
    setSelectedChild({ id: child.id, name: child.name, className: child.className });
    setShowChildSelect(false);
  };

  return (
    <div className="relative">
      <button 
        type="button" 
        onClick={() => setShowChildSelect(!showChildSelect)}
        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-200"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm bg-blue-500">
          {activeChild?.name?.charAt(0) || 'C'}
        </div>
        <div className="text-left">
          <p className="text-xs text-slate-500 font-medium">Đang theo dõi:</p>
          <p className="text-sm font-bold text-slate-900">{activeChild?.name}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
      </button>

      {showChildSelect && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="p-3 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh sách học sinh</p>
          </div>
          <div className="p-2 space-y-1">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => handleSelect(child)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer",
                  activeChild?.id === child.id ? "bg-blue-50" : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm bg-blue-400">
                    {child.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className={cn("font-bold", activeChild?.id === child.id ? "text-blue-700" : "text-slate-900")}>{child.name}</p>
                    <p className="text-xs text-slate-500">Lớp {child.className}</p>
                  </div>
                </div>
                {activeChild?.id === child.id && <Check className="w-5 h-5 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AcademicYearSelector() {
  const { selectedNamHocId, setNamHoc, isReadOnly } = useAcademicStore();
  const [namHocs, setNamHocs] = useState<NamHoc[]>([]);

  useEffect(() => {
    academicService.getNamHocs().then((list) => {
      setNamHocs(list);
      academicService.getCauHinhHeThong().then(cauHinh => {
        const current = list.find((nh) => nh.tenNamHoc === cauHinh.tenNamHocHienTai);
        if (current) {
          useAcademicStore.getState().setCurrentNamHoc(current.tenNamHoc, current.namHocId, current.ngayBatDau);
        }
        useAcademicStore.getState().setCurrentHocKy(cauHinh.hocKyHienTaiId);
      }).catch(console.error);
    }).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const nh = namHocs.find((n) => n.namHocId === id);
    if (nh) setNamHoc(nh.tenNamHoc, nh.namHocId, nh.ngayBatDau);
  };

  return (
    <div className="flex items-center space-x-3 mr-4">
      {isReadOnly && (
        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md animate-pulse">
          CHẾ ĐỘ CHỈ XEM
        </span>
      )}
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
        <Calendar className="w-4 h-4 text-slate-500 mr-2" />
        <select
          className="bg-transparent border-none outline-none text-sm font-semibold text-slate-700 cursor-pointer"
          value={selectedNamHocId ?? ''}
          onChange={handleChange}
        >
          {namHocs.map(nh => (
            <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function ParentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  const childContextResolved = useParentContextStore((state) => state.resolved);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user?.requirePasswordChange) {
      navigate('/force-change-password');
      return;
    }

    if (!childContextResolved) {
      navigate('/select-child');
      return;
    }

    if (user && !user.fullName) {
      userService.getMyProfile()
        .then(data => {
          updateUser({ fullName: data.fullName, avatarUrl: data.avatarUrl || undefined });
        })
        .catch(err => console.error("Failed to fetch profile", err));
    }
  }, [user, navigate, updateUser, childContextResolved]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0">
        <div className="p-6 flex items-center justify-center">
          <img 
            src="https://www.titkul.vn/upload/photo/cropped-titkul-logo-header-7055.png" 
            alt="Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-1.5 mt-2 overflow-y-auto">
          <NavItem to="/parent" icon={LayoutDashboard} label="Tổng quan" />
          <NavItem to="/parent/children" icon={Users} label="Hồ sơ con" />
          <NavItem to="/parent/assignments" icon={FileText} label="Bài tập" />
          <NavItem to="/parent/notifications" icon={Bell} label="Thông báo" />
          <NavItem to="/parent/rewards" icon={Award} label="Thành tích" />
          <NavItem to="/parent/grades" icon={Award} label="Bảng điểm" />
        </nav>
        
        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <Link to="/parent/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl mt-2 hover:bg-slate-100 transition cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shrink-0 shadow-sm overflow-hidden border border-slate-200">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <span className="uppercase">{user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'PH'}</span>
               )}
            </div>
            <div className="text-sm overflow-hidden flex-1">
              <p className="font-semibold text-slate-900 truncate" title={user?.fullName || user?.username}>{user?.fullName || user?.username}</p>
              <p className="text-slate-500 text-xs truncate">Phụ huynh</p>
            </div>
          </Link>
          
          <button onClick={handleLogout} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer group mt-1">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
              Đăng xuất
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <ChildSelectorDropdown />
          
          <div className="flex items-center gap-4">
            <AcademicYearSelector />

            <div className="relative">
              <button 
                type="button" 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* Dropdown Thông báo */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-slate-900">Thông báo</h3>
                  </div>
                  <div className="p-8 text-center text-slate-500 text-sm">
                    Chưa có thông báo nào.
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* KHU VỰC NỘI DUNG VÀ FOOTER */}
        <div className="flex-1 overflow-auto flex flex-col bg-slate-50/50">
          <div className="p-8 flex-1 max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>

          {/* FOOTER */}
          <footer className="mt-auto px-8 py-6 border-t border-slate-200 bg-white flex items-center justify-between">
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} <span className="font-semibold text-slate-700">Titkul LMS Parent Portal</span>
            </div>
          </footer>
        </div>

      </main>
    </div>
  );
}
