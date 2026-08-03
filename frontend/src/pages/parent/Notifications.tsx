import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Loader2, Pin } from 'lucide-react';
import { parentService } from '../../services/parent.service';

export default function ParentNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await parentService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await parentService.markNotificationRead(id);
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await parentService.markAllNotificationsRead();
    } catch (err) {
      console.error('Failed to mark all notifications read', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-pro-primary/10 rounded-2xl flex items-center justify-center border-2 border-pro-primary/20">
             <Bell className="w-7 h-7 text-pro-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Thông báo</h1>
            <p className="text-slate-500 font-medium mt-1">
              Bạn có {notifications.filter(n => !n.read).length} thông báo chưa đọc
            </p>
          </div>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-sm font-bold text-pro-primary bg-pro-primary/10 hover:bg-pro-primary/20 px-4 py-2 rounded-xl transition-colors flex items-center"
        >
           <CheckCircle2 className="w-4 h-4 mr-2" />
           Đánh dấu đã đọc tất cả
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((noti) => (
          <div
            key={noti.id}
            onClick={() => !noti.read && handleMarkRead(noti.id)}
            className={`bg-white border rounded-2xl p-5 flex items-start transition-colors relative overflow-hidden ${
            noti.read ? 'border-slate-200' : 'border-pro-primary/40 shadow-sm bg-pro-primary/5 cursor-pointer'
          }`}>
             {!noti.read && (
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-pro-primary"></div>
             )}
             
             <div className="flex-1 ml-2">
               <div className="flex items-center space-x-2 mb-2">
                  {noti.pinned && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-md flex items-center"><Pin className="w-3 h-3 mr-1" /> Ghim</span>}
                  {noti.type === 'KHEN_THUONG' && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-md">Khen thưởng</span>}
                  <span className="text-xs font-semibold text-slate-400">{noti.date}</span>
               </div>
               <h3 className={`text-lg mb-1 ${noti.read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                 {noti.title}
               </h3>
               <p className={`${noti.read ? 'text-slate-500' : 'text-slate-700'} text-sm leading-relaxed`}>
                 {noti.content}
               </p>
             </div>

             {!noti.read && (
                <div className="w-3 h-3 bg-pro-primary rounded-full shrink-0 ml-4 mt-2"></div>
             )}
          </div>
        )) : (
          <div className="bg-white border rounded-2xl p-8 text-center border-dashed">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Chưa có thông báo nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
