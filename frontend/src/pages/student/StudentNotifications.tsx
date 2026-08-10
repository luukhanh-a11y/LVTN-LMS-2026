import { useState, useEffect } from 'react';
import { ChevronLeft, MailPlus, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { studentService } from '../../services/student.service';

export default function StudentNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notiList = await studentService.getNotifications();
        const mappedList = notiList.map((n: any) => {
          const isRead = n.read;
          let amThanh = n.title;
          let mauSac = isRead ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-[#E8F5E9] border-[#81C784] text-[#1B5E20]';
          let iconChuaDoc = '💌';
          let iconDaDoc = '✅';
          let nhan = isRead ? 'Đã mở' : 'Thư mới!';
          let link = '/student';

          if (n.type === 'THUONG') {
            mauSac = isRead ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-[#FFF3E0] border-[#FFB74D] text-[#E65100]';
            iconChuaDoc = '🎁';
            iconDaDoc = '✨';
            nhan = isRead ? 'Đã mở' : 'Quà mới!';
            link = '/student/trophies';
          } else if (n.type === 'BÀI_TẬP' || n.type === 'BAI_TAP') {
            link = '/student/tasks';
          }

          return {
            id: n.id,
            amThanh: amThanh,
            daDoc: isRead,
            mauSac: mauSac,
            iconChuaDoc: iconChuaDoc,
            iconDaDoc: iconDaDoc,
            nhan: nhan,
            link: link
          };
        });
        setNotifications(mappedList.length > 0 ? mappedList : [
            { id: 1, amThanh: 'Hệ thống chưa có thư mới cho em!', daDoc: true, mauSac: 'bg-slate-100 border-slate-200 text-slate-400', iconChuaDoc: '💌', iconDaDoc: '📭', nhan: 'Đã mở', link: '/student' }
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  const handleOpenLetter = async (id: number, amThanh: string, link: string) => {
    // Đổi trạng thái thành Đã đọc
    setNotifications(notifications.map(n => n.id === id ? { ...n, daDoc: true, mauSac: 'bg-slate-100 border-slate-200 text-slate-400', nhan: 'Đã mở' } : n));
    try {
      await studentService.markNotificationRead(id);
    } catch (e) {}
    
    toast(`🔊 "${amThanh}"`, { 
      icon: '🦉', 

      duration: 3500,
      style: { borderRadius: '20px', padding: '16px', fontWeight: 'bold' }
    });

    setTimeout(() => {
      navigate(link);
    }, 2500);
  };

  // LỌC DỮ LIỆU: Phân tách rõ ràng Chưa đọc và Đã đọc
  const unreadNotes = notifications.filter(n => !n.daDoc);
  // Chỉ lấy tối đa 4 thư đã đọc gần nhất để màn hình không bị quá dài
  const readNotes = notifications.filter(n => n.daDoc).slice(0, 4); 

  return (
    <div className="min-h-screen bg-[#F0FDF4] pb-24 font-sans flex flex-col items-center overflow-x-hidden relative">
      
      {/* Background dễ thương */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-100 to-transparent pointer-events-none"></div>

      {/* HEADER */}
      <header className="w-full max-w-4xl px-6 py-8 flex items-center justify-between z-10 sticky top-0">
        <Link 
          to="/student"
          className="w-14 h-14 rounded-full bg-white border-4 border-green-200 flex items-center justify-center text-green-600 hover:scale-110 transition-transform shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8 -ml-1" />
        </Link>

        <div className="bg-white px-8 py-3 rounded-full border-4 border-green-200 shadow-sm flex items-center gap-3">
          <MailPlus className="w-6 h-6 text-green-500" />
          <h1 className="font-black text-green-700 tracking-wide uppercase">
            Hộp Thư Của Bé 
            {unreadNotes.length > 0 && (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-sm ml-2 animate-pulse">
                {unreadNotes.length}
              </span>
            )}
          </h1>
        </div>
        
        <div className="w-14"></div>
      </header>

      <main className="w-full max-w-4xl px-6 py-4 z-10 flex flex-col items-center">
        
        {/* PHẦN 1: THƯ MỚI CHƯA BÓC (To đùng, nổi bật) */}
        {unreadNotes.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-4 w-full">
            {unreadNotes.map(note => (
              <button 
                key={note.id}
                onClick={() => handleOpenLetter(note.id, note.amThanh, note.link)}
                className={cn(
                  "relative w-40 h-48 sm:w-48 sm:h-56 rounded-[2.5rem] border-4 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer shadow-md group",
                  `${note.mauSac} hover:-translate-y-3 hover:shadow-xl` 
                )}
              >
                {/* Dấu chấm đỏ báo thư mới */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce z-20 shadow-sm">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                </div>

                <div className="text-[5rem] sm:text-[6rem] drop-shadow-md transition-transform duration-300 z-10 group-hover:scale-110 group-hover:rotate-6">
                  {note.iconChuaDoc}
                </div>

                <div className="absolute bottom-4 font-black px-4 py-1.5 rounded-full text-sm sm:text-base border-2 bg-white/90 border-white/50 backdrop-blur-sm">
                  {note.nhan}
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Trạng thái trống khi bé đã đọc hết thư mới
          <div className="flex flex-col items-center justify-center py-10 opacity-70">
            <div className="text-7xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-green-700">Bé đã mở hết quà rồi!</h2>
          </div>
        )}

        {/* ĐƯỜNG KẺ NGĂN CÁCH (Chỉ hiện khi có thư cũ) */}
        {readNotes.length > 0 && (
          <div className="w-full max-w-lg mt-16 mb-8 border-t-4 border-green-200/50 border-dashed relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-4 bg-[#F0FDF4] px-4 font-bold text-green-600/50 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Đã mở gần đây
            </span>
          </div>
        )}

        {/* PHẦN 2: THƯ ĐÃ BÓC (Thu nhỏ lại, làm mờ, giới hạn số lượng) */}
        {readNotes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {readNotes.map(note => (
              <div 
                key={note.id}
                className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-4 bg-slate-50 border-slate-200 opacity-60 flex flex-col items-center justify-center text-center shadow-none cursor-default"
              >
                <div className="text-4xl sm:text-5xl grayscale opacity-70">
                  {note.iconDaDoc}
                </div>
                <div className="mt-2 font-bold text-slate-400 text-xs bg-slate-200/50 px-2 py-1 rounded-full">
                  {note.nhan}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
