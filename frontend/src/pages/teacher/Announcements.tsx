import { useState, useEffect } from 'react';
import { Megaphone, Send, FilePlus, Eye, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { teacherService } from '../../services/teacher.service';

export default function Announcements() {
  const [activeTab, setActiveTab] = useState('tao-moi');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [audience, setAudience] = useState<string>('TAT_CA');

  const [file, setFile] = useState<File | null>(null);

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

  const filteredAnnouncements = announcements.filter(item => {
    if (timeFilter === 'all') return true;
    const dateStr = item.ngayDang || item.createdAt;
    if (!dateStr) return true;
    const time = new Date(dateStr).getTime();
    const now = Date.now();
    if (timeFilter === 'week') {
      return now - time <= 7 * 24 * 60 * 60 * 1000;
    }
    if (timeFilter === 'month') {
      return now - time <= 30 * 24 * 60 * 60 * 1000;
    }
    return true;
  });

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let fileDinhKem = null;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('http://localhost:8080/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.code === 200 || uploadData.data) {
          fileDinhKem = 'http://localhost:8080' + uploadData.data;
        } else {
          toast.error('Lỗi khi tải file lên');
          setLoading(false);
          return;
        }
      }

      await teacherService.createAnnouncement({
        title,
        content,
        audience,
        fileDinhKem,
        pinned: false
      });
      toast.success('Đã đăng thông báo thành công!');
      setTitle('');
      setContent('');
      setFile(null);
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
              <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer bg-slate-50 relative"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {!file ? (
                  <>
                    <FilePlus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600">Kéo thả file vào đây hoặc <span className="text-blue-600">Bấm để chọn file</span></p>
                    <p className="text-xs text-slate-400 mt-1">Hỗ trợ PDF, DOCX, JPG (Tối đa 10MB)</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-bold text-blue-600 mb-1">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="mt-2 text-xs text-red-500 hover:underline"
                    >
                      Xóa file
                    </button>
                  </div>
                )}
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
          <div className="flex flex-col flex-1 overflow-hidden bg-slate-50 animate-in fade-in">
            <div className="px-8 pt-6 pb-2 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-slate-800">Lịch sử thông báo đã gửi</h3>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer shadow-sm"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
              </select>
            </div>
            <div className="p-8 pt-4 flex-1 overflow-y-auto space-y-4">
              {filteredAnnouncements.map((item: any) => (
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
                      {item.fileDinhKem && (
                        <a 
                          href={item.fileDinhKem} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
                        >
                          <FilePlus className="w-4 h-4" /> Tệp đính kèm
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredAnnouncements.length === 0 && (
                 <div className="text-center text-slate-500 py-10 bg-white rounded-xl border border-dashed border-slate-200">Không tìm thấy thông báo nào trong khoảng thời gian này.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
