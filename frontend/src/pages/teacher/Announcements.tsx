import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Send, Pin, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { teacherService } from '../../services/teacher.service';

const AUDIENCE_LABEL: Record<string, string> = {
  TAT_CA: 'Tất cả',
  PHU_HUYNH: 'Phụ huynh',
  HOC_SINH: 'Học sinh',
};

export default function TeacherAnnouncements() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<'TAT_CA' | 'PHU_HUYNH' | 'HOC_SINH'>('TAT_CA');
  const [pinned, setPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await teacherService.getMyAnnouncements();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch announcements', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
      return;
    }
    setIsSubmitting(true);
    try {
      await teacherService.createAnnouncement({ title, content, audience, pinned });
      toast.success('Đã đăng thông báo!');
      setTitle('');
      setContent('');
      setPinned(false);
      setAudience('TAT_CA');
      fetchHistory();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Đăng thông báo thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">Bảng Tin Lớp Học</h1>

      <Card>
        <CardHeader>
          <CardTitle>Đăng thông báo mới</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Tiêu đề thông báo..." value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-1 resize-none"
            placeholder="Nội dung thông báo..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <select
                className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={audience}
                onChange={(e) => setAudience(e.target.value as typeof audience)}
              >
                <option value="TAT_CA">Gửi tất cả (Phụ huynh & Học sinh)</option>
                <option value="PHU_HUYNH">Chỉ gửi Phụ huynh</option>
                <option value="HOC_SINH">Chỉ gửi Học sinh</option>
              </select>
              <label className="flex items-center text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary rounded border-slate-300 mr-2"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                Ghim lên đầu
              </label>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Đăng ngay
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold text-slate-800">Lịch sử đăng</h3>

        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Đang tải...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl">
            Bạn chưa đăng thông báo nào.
          </div>
        ) : (
          history.map((item) => (
            <Card
              key={item.id}
              className={item.pinned ? 'border-pro-warning/40 bg-pro-warning/10 shadow-sm relative overflow-hidden' : 'border-slate-200 bg-white'}
            >
              <CardContent className="p-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    {item.pinned && (
                      <div className="flex items-center text-pro-warning font-bold bg-pro-warning/20 px-2 py-1 rounded-md text-sm">
                        <Pin className="w-4 h-4 mr-1" />
                        Đã ghim
                      </div>
                    )}
                    <div className="px-2 py-1 bg-white/50 text-pro-warning rounded text-xs border border-pro-warning/30">
                      Gửi: {AUDIENCE_LABEL[item.audience] ?? item.audience}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{item.date}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg">{item.title}</h4>
                <p className="text-sm text-slate-700 mt-2">{item.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
