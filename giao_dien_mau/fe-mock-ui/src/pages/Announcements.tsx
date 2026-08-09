import { useState } from 'react';
import { Megaphone, Send, FilePlus, Eye, Clock } from 'lucide-react';
import { sentAnnouncementsData } from '../mockData';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

export default function Announcements() {
  const [activeTab, setActiveTab] = useState('tao-moi');

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã đăng thông báo thành công!');
    setActiveTab('lich-su');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-blue-600" /> Thông báo chung
        </h2>
        <p className="text-sm text-slate-500 mt-1">Đăng thông báo tới học sinh và xem lịch sử các thông báo đã gửi.</p>
      </div>

      <div className="flex items-center gap-6 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('tao-moi')}
          className={cn("pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer", activeTab === 'tao-moi' ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          Soạn thông báo
        </button>
        <button 
          onClick={() => setActiveTab('lich-su')}
          className={cn("pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer", activeTab === 'lich-su' ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700")}
        >
          Lịch sử đã gửi
        </button>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {activeTab === 'tao-moi' && (
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handlePostAnnouncement} className="p-8 space-y-6 animate-in fade-in max-w-3xl mx-auto">
              <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Gửi đến <span className="text-red-500">*</span></label>
              <select required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50">
                <option value="">Chọn đối tượng nhận thông báo...</option>
                <option>Tất cả các lớp đang dạy</option>
                <option>Toán 10A1</option>
                <option>Toán 10A2</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Tiêu đề thông báo <span className="text-red-500">*</span></label>
              <input type="text" required placeholder="Nhập tiêu đề ngắn gọn..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Nội dung chi tiết <span className="text-red-500">*</span></label>
              <textarea required rows={6} placeholder="Nhập nội dung thông báo muốn gửi..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none bg-slate-50 leading-relaxed"></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Đính kèm tệp tin</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer bg-slate-50">
                <FilePlus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Kéo thả file vào đây hoặc <span className="text-blue-600">Bấm để chọn file</span></p>
                <p className="text-xs text-slate-400 mt-1">Hỗ trợ PDF, DOCX, JPG (Tối đa 10MB)</p>
              </div>
            </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm cursor-pointer">
                  <Send className="w-5 h-5" /> Phát hành thông báo
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'lich-su' && (
          <div className="p-8 flex-1 overflow-y-auto bg-slate-50 animate-in fade-in space-y-4">
            {sentAnnouncementsData.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">Gửi đến: <span className="text-slate-800">{item.target}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> {item.time}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                      <Eye className="w-4 h-4" /> Đã xem: {item.views}
                    </span>
                    {item.file && (
                      <span className="text-sm font-medium text-slate-600 px-3 py-1 bg-slate-100 rounded-lg flex items-center gap-2">
                        <FilePlus className="w-4 h-4 text-slate-400" /> {item.file}
                      </span>
                    )}
                  </div>
                  <button type="button" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition cursor-pointer">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
