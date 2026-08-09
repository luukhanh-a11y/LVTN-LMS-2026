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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Thông báo</h2>
          <p className="text-sm text-slate-500 mt-1">
            Bạn có <strong className="text-blue-600">{notifications.filter((n) => !n.read).length}</strong> thông báo chưa đọc
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors flex items-center shadow-sm border border-blue-100"
        >
           <CheckCircle2 className="w-4 h-4 mr-2" />
           Đánh dấu đã đọc tất cả
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
             Bạn chưa có thông báo nào.
          </div>
        ) : notifications.map((noti) => (
          <div
            key={noti.id}
            onClick={() => !noti.read && handleMarkRead(noti.id)}
            className={`bg-white border rounded-2xl p-5 flex items-start transition-colors relative overflow-hidden ${
            noti.read ? 'border-slate-200' : 'border-blue-200 shadow-sm bg-blue-50/30 cursor-pointer hover:border-blue-300'
          }`}>
             {!noti.read && (
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500"></div>
             )}
             
             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mr-4">
                <Bell className="w-5 h-5" />
             </div>

             <div className="flex-1">
               <div className="flex items-center space-x-2 mb-1.5">
                  {noti.pinned && <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-md flex items-center"><Pin className="w-3 h-3 mr-1" /> Ghim</span>}
                  {noti.type === 'KHEN_THUONG' && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-md">Khen thưởng</span>}
                  <span className="text-xs font-semibold text-slate-400">{noti.date || new Date(noti.createdAt).toLocaleDateString('vi-VN')}</span>
               </div>
               <h3 className={`text-[15px] mb-1 ${noti.read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                 {noti.title}
               </h3>
               <p className={`${noti.read ? 'text-slate-500' : 'text-slate-600'} text-sm leading-relaxed`}>
                 {noti.content}
               </p>
             </div>

             {!noti.read && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 ml-4 mt-2"></div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}
