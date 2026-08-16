import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import { Library, FileText, CheckSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MaterialWorkspaceLayout() {
  const location = useLocation();

  // Redirect /teacher/materials to /teacher/materials/library
  if (location.pathname === '/teacher/materials' || location.pathname === '/teacher/materials/') {
    return <Navigate to="/teacher/materials/library" replace />;
  }

  const tabs = [
    { to: '/teacher/materials/library', label: 'Kho học liệu', icon: Library },
    { to: '/teacher/materials/assignments', label: 'Giao bài tập', icon: FileText },
    { to: '/teacher/materials/grading', label: 'Chấm bài', icon: CheckSquare },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-200">
      {/* Browser Tab Bar */}
      <div className="pt-3 px-4 flex items-end gap-1">
        {tabs.map((tab, index) => {
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => {
                const active = isActive || (location.pathname.startsWith(tab.to) && tab.to !== '/teacher/materials');
                return cn(
                  "relative px-4 py-2.5 text-sm font-semibold flex items-center gap-2 rounded-t-xl transition-all w-48 group cursor-pointer",
                  active
                    ? "bg-slate-50 text-blue-700 z-10"
                    : "bg-transparent text-slate-600 hover:bg-slate-300/70 hover:text-slate-900"
                );
              }}
            >
              {({ isActive }) => {
                const active = isActive || (location.pathname.startsWith(tab.to) && tab.to !== '/teacher/materials');
                return (
                  <>
                    <tab.icon className={cn("w-4 h-4 shrink-0", active ? "text-blue-700" : "text-slate-500")} />
                    <span className="truncate">{tab.label}</span>
                    
                    {/* Flares for active tab */}
                    {active && (
                      <>
                        <div className="absolute bottom-0 -left-4 w-4 h-4 bg-transparent rounded-br-xl shadow-[8px_8px_0_0_#f8fafc] pointer-events-none" />
                        <div className="absolute bottom-0 -right-4 w-4 h-4 bg-transparent rounded-bl-xl shadow-[-8px_8px_0_0_#f8fafc] pointer-events-none" />
                      </>
                    )}
                    {/* Separator for inactive tabs */}
                    {!active && index < tabs.length - 1 && (
                      <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-slate-300 group-hover:opacity-0 transition-opacity pointer-events-none" />
                    )}
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50">
        <Outlet />
      </div>
    </div>
  );
}
