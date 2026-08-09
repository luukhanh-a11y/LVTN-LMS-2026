import { useState, useEffect } from 'react';
import { Megaphone, Send, FilePlus, Eye, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { teacherService } from '../../services/teacher.service';

export default function Announcements() {
  const [activeTab, setActiveTab] = useState('tao-moi');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [audience, setAudience] = useState<string>('TAT_CA');

  const fetchAnnouncements = async () => {
    try {
      const data = await teacherService.getMyAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const data = await teacherService.getClasses();
      setClasses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchClasses();
  }, []);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await teacherService.createAnnouncement({
        title,
        content,
        audience,
        pinned: false
      });
      toast.success('Đã đăng thông báo thành công!');
      setTitle('');
      setContent('');
      setActiveTab('lich-su');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error('Gửi thông báo thất bại');
    } finally {
      setLoading(false);
    }
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
              <select required value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50">
                <option value="TAT_CA">Tất cả các lớp đang dạy</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name} {cls.grade ? `(Khối ${cls.grade})` : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Tiêu đề thông báo <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề ngắn gọn..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Nội dung chi tiết <span className="text-red-500">*</span></label>
              <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Nhập nội dung thông báo muốn gửi..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none bg-slate-50 leading-relaxed"></textarea>
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
                <button disabled={loading} type="submit" className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm cursor-pointer disabled:opacity-50">
                  <Send className="w-5 h-5" /> Phát hành thông báo
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'lich-su' && (
          <div className="p-8 flex-1 overflow-y-auto bg-slate-50 animate-in fade-in space-y-4">
            {announcements.map((item: any) => (
              <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.tieuDe || item.title}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">Gửi đến: <span className="text-slate-800">{item.audience || item.tenLop || 'Tất cả'}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> {(item.ngayDang || item.createdAt) ? new Date(item.ngayDang || item.createdAt).toLocaleDateString() : 'Gần đây'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{item.noiDung || item.content}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                      <Eye className="w-4 h-4" /> Đã xem: {item.views || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
               <div className="text-center text-slate-500 py-10">Chưa có thông báo nào được gửi.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
