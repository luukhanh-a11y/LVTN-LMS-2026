import { useState } from 'react';
import { Bell, MessageSquare, AlertCircle, CheckCircle2, Circle, Trash2, Check } from 'lucide-react';
import { notificationsData } from '../mockData';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Notifications() {
  // Mặc định hiển thị thông báo "Chưa đọc" (unread)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('unread');

  // Lọc dữ liệu dựa trên state
  const filteredNotifications = notificationsData.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true; // filter === 'all'
  });

  const handleMarkAsRead = () => {
    toast.success('Đã đánh dấu đọc tất cả thông báo!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Quản lý Thông báo
          </h2>
          <p className="text-sm text-slate-500 mt-1">Xem chi tiết các hoạt động và cập nhật từ hệ thống</p>
        </div>
        <button 
          type="button"
          onClick={handleMarkAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" /> Đánh dấu đọc tất cả
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Bộ lọc (Tabs) */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-100 bg-slate-50/50">
          <button 
            type="button"
            onClick={() => setFilter('unread')}
            className={cn("py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2", filter === 'unread' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Chưa đọc
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">{notificationsData.filter(n => !n.isRead).length}</span>
          </button>
          <button 
            type="button"
            onClick={() => setFilter('all')}
            className={cn("py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer", filter === 'all' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Tất cả
          </button>
          <button 
            type="button"
            onClick={() => setFilter('read')}
            className={cn("py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer", filter === 'read' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
          >
            Đã đọc
          </button>
        </div>

        {/* Danh sách thông báo */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-6 transition hover:bg-slate-50 flex gap-4 group",
                    !notif.isRead ? "bg-blue-50/30" : "bg-white"
                  )}
                >
                  {/* Icon loại thông báo */}
                  <div className="shrink-0 mt-1">
                    {notif.type === 'system' 
                      ? <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><AlertCircle className="w-5 h-5" /></div>
                      : <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><MessageSquare className="w-5 h-5" /></div>
                    }
                  </div>
                  
                  {/* Nội dung */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={cn("text-base", !notif.isRead ? "font-bold text-slate-900" : "font-medium text-slate-700")}>
                        {notif.title}
                      </h3>
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{notif.desc}</p>
                    
                    {/* Thao tác (Chỉ hiện khi hover) */}
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.isRead && (
                        <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition cursor-pointer">
                          <Check className="w-3.5 h-3.5" /> Đánh dấu đã đọc
                        </button>
                      )}
                      <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-600 transition cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                  
                  {/* Chấm tròn báo chưa đọc */}
                  {!notif.isRead && (
                    <div className="shrink-0 flex items-center justify-center">
                      <Circle className="w-3 h-3 fill-blue-600 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
              <Bell className="w-12 h-12 mb-4 text-slate-200" />
              <p>Không có thông báo nào trong mục này.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}