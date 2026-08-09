import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Home, Users, BookOpen, CheckSquare, Bell, LayoutGrid, HelpCircle, X, Send, MessageSquare, AlertCircle, Maximize2, Phone, Mail, Megaphone, Library } from 'lucide-react';
import { cn } from './lib/utils';
import { notificationsData } from './mockData';

// Import các trang
import Dashboard from './pages/Dashboard';
import GradingWorkspace from './pages/GradingWorkspace';
import AssignmentList from './pages/AssignmentList';
import CreateAssignment from './pages/CreateAssignment';
import MyClasses from './pages/MyClasses';
import ClassDetail from './pages/ClassDetail';
import TeacherProfile from './pages/TeacherProfile';
import ForgotPassword from './pages/ForgotPassword';
import Notifications from './pages/Notifications';
import Gradebook from './pages/Gradebook';
import Materials from './pages/Materials';
import Announcements from './pages/Announcements';

// Import Admin components
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminClasses from './pages/admin/AdminClasses';
import AdminClassDetail from './pages/admin/AdminClassDetail';
import AdminSupport from './pages/admin/AdminSupport';
import AdminSettings from './pages/admin/AdminSettings';

// Import Parent components
import ParentLayout from './components/ParentLayout';
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentGrades from './pages/parent/ParentGrades';
import ParentAchievements from './pages/parent/ParentAchievements';
import ParentSupport from './pages/parent/ParentSupport';

function NavItem({ to, icon: Icon, label }: { to: string, icon: React.ElementType, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/assignments' && location.pathname.startsWith('/assignments')) || (to === '/classes' && location.pathname.startsWith('/classes'));
  
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

function Layout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  
  const unreadCount = notificationsData.filter(n => !n.isRead).length;

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã gửi phiếu hỗ trợ! Admin sẽ phản hồi bạn sớm nhất.');
    setShowSupportModal(false);
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
        
        <nav className="flex-1 px-4 flex flex-col gap-1">
          <NavItem to="/" icon={Home} label="Tổng quan" />
          <NavItem to="/classes" icon={Users} label="Lớp học của tôi" />
          <NavItem to="/assignments" icon={BookOpen} label="Quản lý Bài tập" />
          <NavItem to="/grading" icon={CheckSquare} label="Chấm bài" />
          <NavItem to="/materials" icon={Library} label="Kho Học liệu" />
          <NavItem to="/announcements" icon={Megaphone} label="Thông báo chung" />
        </nav>
        
        {/* Vùng dưới cùng Sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button 
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium text-sm cursor-pointer text-left"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            Gửi yêu cầu hỗ trợ
          </button>

          <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">GV</div>
            <div className="text-sm overflow-hidden">
              <p className="font-semibold text-slate-900 truncate">Trần Lê A</p>
              <p className="text-slate-500 text-xs truncate">Giáo viên Toán</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="text-sm text-slate-500 font-medium">Hệ thống Quản lý Giảng dạy</div>
          
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            {/* Dropdown Thông báo */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-bold text-slate-900">Thông báo</h3>
                  <div className="flex items-center gap-3">
                    <button type="button" className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">Đã đọc</button>
                    <Link 
                      to="/notifications" 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
                      title="Mở toàn màn hình"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationsData.map(notif => (
                    <div key={notif.id} className={cn("p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer flex gap-3", !notif.isRead ? "bg-blue-50/30" : "")}>
                      <div className="mt-1 shrink-0">
                        {notif.type === 'system' ? <AlertCircle className="w-5 h-5 text-orange-500" /> : <MessageSquare className="w-5 h-5 text-blue-500" />}
                      </div>
                      <div>
                        <p className={cn("text-sm", !notif.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700")}>{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                        <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link 
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="block w-full text-center p-3 text-sm font-medium text-blue-600 hover:bg-slate-50 transition bg-white"
                >
                  Xem tất cả thông báo
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* KHU VỰC CUỘN NỘI DUNG VÀ FOOTER */}
        <div className="flex-1 overflow-auto flex flex-col">
          {/* Main Router Content */}
          <div className="p-8 flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/grading" element={<GradingWorkspace />} />
              <Route path="/assignments" element={<AssignmentList />} />
              <Route path="/assignments/create" element={<CreateAssignment />} />
              <Route path="/classes" element={<MyClasses />} />
              <Route path="/classes/:id" element={<ClassDetail />} />
              <Route path="/classes/:id/grades" element={<Gradebook />} />
              <Route path="/profile" element={<TeacherProfile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/announcements" element={<Announcements />} />
            </Routes>
          </div>

          {/* FOOTER */}
          <footer className="mt-auto px-8 py-6 border-t border-slate-200 bg-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} <span className="font-semibold text-slate-700">EduTeacher</span>. Hệ thống Quản lý Giảng dạy.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> Hotline: 1900 1234</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /> hotro@eduteacher.edu.vn</span>
            </div>
          </footer>
        </div>

      </main>

      {/* MODAL HỖ TRỢ */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Gửi phiếu hỗ trợ (Ticket)</h3>
                <p className="text-sm text-slate-500 mt-1">Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải.</p>
              </div>
              <button type="button" onClick={() => setShowSupportModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendSupport} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Chủ đề cần hỗ trợ</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                  <option>Lỗi không thấy danh sách lớp</option>
                  <option>Lỗi trong quá trình chấm điểm</option>
                  <option>Quên mật khẩu / Lỗi tài khoản</option>
                  <option>Yêu cầu chức năng khác</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Mô tả chi tiết</label>
                <textarea 
                  required
                  rows={4} 
                  placeholder="Mô tả các bước bạn đã làm trước khi gặp lỗi..." 
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowSupportModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer">Hủy</button>
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 rounded-lg transition shadow-sm cursor-pointer">
                  <Send className="w-4 h-4" /> Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Nhóm Route cho Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="classes/:id" element={<AdminClassDetail />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Parent Routes */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="grades" element={<ParentGrades />} />
          <Route path="achievements" element={<ParentAchievements />} />
          <Route path="support" element={<ParentSupport />} />
        </Route>

        {/* Nhóm Route cho Giáo viên (Mặc định) */}
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}