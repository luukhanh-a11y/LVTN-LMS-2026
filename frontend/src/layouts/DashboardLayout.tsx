import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Settings, BookOpen,
  FileText, Award, Bell, Upload, ShieldCheck, MessageSquare, Repeat, GraduationCap, ChevronLeft, ChevronRight,
  type LucideIcon
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useParentContextStore } from '../stores/useParentContextStore';
import { userService } from '../services/user.service';
import { ticketService } from '../services/ticket.service';
import { cn } from '../lib/utils';
import SchoolFooter from '../components/layout/SchoolFooter';

type Role = 'admin' | 'teacher' | 'parent';

export default function DashboardLayout({ role }: { role: Role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const selectedChild = useParentContextStore((state) => state.selectedChild);
  const childContextResolved = useParentContextStore((state) => state.resolved);
  const clearSelectedChild = useParentContextStore((state) => state.clearSelectedChild);

  const [pendingTicketsCount, setPendingTicketsCount] = useState(0);
  const [teacherTicketsCount, setTeacherTicketsCount] = useState(0);
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse sidebar based on pathname
  useEffect(() => {
    const isRoot = location.pathname === `/${role}`;
    if (!isRoot) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [location.pathname, role]);

  useEffect(() => {
    if (user?.requirePasswordChange) {
      navigate('/force-change-password');
      return;
    }

    if (role === 'parent' && !childContextResolved) {
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
  }, [user, navigate, updateUser, role, childContextResolved]);

  const handleSwitchChild = () => {
    clearSelectedChild();
    navigate('/select-child');
  };

  useEffect(() => {
    const fetchTicketsCount = () => {
      if (role === 'admin') {
        ticketService.getPendingTickets()
          .then(tickets => {
            // Count only pending tickets (CHO_DUYET)
            const pendingCount = tickets.filter((t: any) => t.status === 'CHO_DUYET').length;
            setPendingTicketsCount(pendingCount);
          })
          .catch(err => console.error("Failed to fetch tickets", err));
      } else if (role === 'teacher') {
        ticketService.getMyTickets()
          .then(tickets => {
            const lastSeenStr = localStorage.getItem('lastSeenTickets');
            const lastSeenTime = lastSeenStr ? parseInt(lastSeenStr, 10) : 0;
            
            // Hiển thị thông báo cho các phiếu đã được xử lý (DA_DUYET hoặc TU_CHOI) VÀ chưa được xem
            const processedCount = tickets.filter((t: any) => {
              const isProcessed = t.status === 'DA_DUYET' || t.status === 'TU_CHOI';
              const timeToCheck = new Date(t.processedAt || t.createdAt).getTime();
              return isProcessed && timeToCheck > lastSeenTime;
            }).length;
            
            setTeacherTicketsCount(processedCount);
          })
          .catch(err => console.error("Failed to fetch teacher tickets", err));
      }
    };

    fetchTicketsCount();

    window.addEventListener('ticketsUpdated', fetchTicketsCount);
    return () => window.removeEventListener('ticketsUpdated', fetchTicketsCount);
  }, [role]);

  interface NavItem {
    name: string;
    path: string;
    icon: LucideIcon;
    badge?: number;
  }

  const navItems: Record<Role, NavItem[]> = {
    admin: [
      { name: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
      { name: 'Tài khoản', path: '/admin/users', icon: Users },
      { name: 'Phiếu hỗ trợ', path: '/admin/tickets', icon: Bell, badge: pendingTicketsCount },
      { name: 'Lớp học', path: '/admin/classes', icon: BookOpen },
      { name: 'Chương trình học', path: '/admin/curriculum', icon: FileText },
      { name: 'Học vụ', path: '/admin/settings', icon: Settings },
    ],
    teacher: [
      { name: 'Tổng quan', path: '/teacher', icon: LayoutDashboard },
      { name: 'Lớp học', path: '/teacher/classes', icon: Users },
      { name: 'Bảng tin', path: '/teacher/announcements', icon: Bell },
      { name: 'Kho học liệu', path: '/teacher/materials', icon: BookOpen },
      { name: 'Xét lên lớp', path: '/teacher/ket-qua-cuoi-nam', icon: GraduationCap },
      { name: 'Chấm bài', path: '/teacher/grading', icon: Award },
      { name: 'Sổ điểm', path: '/teacher/reports', icon: FileText },
      { name: 'Hỗ trợ', path: '/teacher/tickets', icon: MessageSquare, badge: teacherTicketsCount },
    ],
    parent: [
      { name: 'Tổng quan', path: '/parent', icon: LayoutDashboard },
      { name: 'Hồ sơ con', path: '/parent/children', icon: Users },
      { name: 'Bài tập', path: '/parent/assignments', icon: FileText },
      { name: 'Thông báo', path: '/parent/notifications', icon: Bell },
      { name: 'Thành tích', path: '/parent/rewards', icon: Award },
      { name: 'Bảng điểm', path: '/parent/grades', icon: Award },
      { name: 'Tiến trình', path: '/parent/subject-tree', icon: BookOpen },
    ]
  };

  const items = navItems[role];

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex font-pro">
      {/* Sidebar - Premium Minimalist */}
      <aside className={cn(
        "bg-white border-r border-slate-200 flex flex-col fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <div className="p-6 relative">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-indigo-600 shadow-sm z-30"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          
          <Link to={`/${role}`} className={cn("flex items-center group", isCollapsed ? "justify-center space-x-0" : "space-x-3")}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-white font-black text-xl tracking-tighter">T</span>
            </div>
            {!isCollapsed && <span className="text-2xl font-bold text-slate-900 tracking-tight">Titkul Kids</span>}
          </Link>
          
          <div className={cn("mt-8 flex items-center bg-slate-50 rounded-2xl border border-slate-100", isCollapsed ? "p-2 justify-center" : "p-3 space-x-3")}>
             <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <ShieldCheck className="w-5 h-5 text-indigo-600" />
               )}
             </div>
             {!isCollapsed && (
               <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-slate-900 truncate" title={user?.fullName || user?.username}>{user?.fullName || user?.username || 'User'}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {role === 'admin' ? 'Quản trị viên' : role === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}
                  </span>
               </div>
             )}
          </div>

          {role === 'parent' && selectedChild && (
            <button
              onClick={handleSwitchChild}
              className={cn("mt-4 w-full flex items-center justify-center text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors", isCollapsed ? "py-2 px-0" : "py-2 px-3")}
              title="Đổi tài khoản con"
            >
              <Repeat className={cn("w-3.5 h-3.5", isCollapsed ? "" : "mr-1.5")} />
              {!isCollapsed && "Đổi tài khoản"}
            </button>
          )}
        </div>

        <nav className={cn("flex-1 px-4 pb-6 space-y-1.5 overflow-y-auto", isCollapsed ? "px-2" : "px-4")}>
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  'flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group relative',
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-indigo-600',
                  isCollapsed && 'justify-center px-0 py-3'
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                )} />
                
                {!isCollapsed && <span className="ml-3.5 font-semibold text-[15px]">{item.name}</span>}
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    "flex items-center justify-center bg-rose-500 text-white font-bold text-[10px] rounded-full",
                    isCollapsed ? "absolute top-1 right-1 w-4 h-4" : "ml-auto px-2 py-0.5 min-w-[20px]"
                  )}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn("p-4 border-t border-slate-100 bg-slate-50/50 space-y-1.5", isCollapsed ? "px-2" : "px-4")}>
          <Link 
            to={`/${role}/profile`} 
            title={isCollapsed ? "Cài đặt hồ sơ" : undefined}
            className={cn(
              "flex items-center rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 transition-all hover:shadow-sm",
              isCollapsed ? "justify-center py-3 px-0" : "px-4 py-3 text-[15px] font-semibold"
            )}
          >
            <Settings className={cn("shrink-0", isCollapsed ? "h-5 w-5" : "mr-3.5 h-5 w-5 text-slate-400")} />
            {!isCollapsed && "Cài đặt hồ sơ"}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn("flex-1 min-w-0 min-h-[100dvh] relative flex flex-col transition-all duration-300", isCollapsed ? "ml-20" : "ml-72")}>
        {/* Global Academic Year Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-30 shadow-sm gap-4">
           {role === 'parent' && <ChildSelector />}
           <AcademicYearSelector />
        </header>

        <div className="p-10 max-w-[1400px] w-full mx-auto flex-1">
          <Outlet />
        </div>

        {role === 'teacher' && <SchoolFooter />}
      </main>
    </div>
  );
}

// Global Component for Academic Year Dropdown
import { useAcademicStore } from '../stores/useAcademicStore';
import { academicService, type NamHoc } from '../services/academic.service';
import { Calendar } from 'lucide-react';

function AcademicYearSelector() {
  const { selectedNamHocId, setNamHoc, isReadOnly } = useAcademicStore();
  const [namHocs, setNamHocs] = useState<NamHoc[]>([]);

  useEffect(() => {
    academicService.getNamHocs().then((list) => {
      setNamHocs(list);
      // Nguồn thật duy nhất cho "năm học / học kỳ hiện tại" là Cấu hình hệ thống —
      // CauHinhHeThong chỉ trả tên nên phải khớp lại với danh sách để lấy id + ngày bắt đầu.
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
    <div className="flex items-center space-x-3">
      {isReadOnly && (
        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md animate-pulse">
          CHẾ ĐỘ CHỈ XEM (NĂM HỌC CŨ)
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

import { parentService } from '../services/parent.service';

function ChildSelector() {
  const { selectedChild, setSelectedChild } = useParentContextStore();
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    parentService.getChildren().then(data => {
      setChildren(data);
    }).catch(console.error);
  }, []);

  if (children.length === 0) return null;

  return (
    <div className="flex items-center bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 shadow-sm">
      <Users className="w-4 h-4 text-indigo-500 mr-2" />
      <select 
        className="bg-transparent border-none outline-none text-sm font-bold text-indigo-700 cursor-pointer"
        value={selectedChild?.id || ''}
        onChange={(e) => {
          const child = children.find(c => c.id.toString() === e.target.value);
          if (child) setSelectedChild({ id: child.id, name: child.name, className: child.className });
        }}
      >
        <option value="" disabled>-- Chọn con --</option>
        {children.map(child => (
          <option key={child.id} value={child.id}>{child.name}</option>
        ))}
      </select>
    </div>
  );
}
