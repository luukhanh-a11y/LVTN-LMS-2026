import { useState } from 'react';
import { Send, Ticket, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import { cn } from '../../lib/utils';
import { useOutletContext } from 'react-router-dom';
import { childrenData } from '../../mockParentData';

// Giả lập dữ liệu ticket của phụ huynh
const mockMyTickets = [
  { id: 1, type: 'Xin phép nghỉ học', content: 'Xin cho bé nghỉ ốm ngày 12/08', status: 'Đã phê duyệt', date: '11/08/2026' },
  { id: 2, type: 'Hỏi bài tập', content: 'Cô cho em hỏi bài tập Toán bài 3 trang 15', status: 'Chờ xử lý', date: '12/08/2026' },
];

export default function ParentSupport() {
  const { activeChildId } = useOutletContext<{ activeChildId: number }>();
  const activeChild = childrenData.find(c => c.id === activeChildId) || childrenData[0];
  const [type, setType] = useState('Xin phép nghỉ học');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Đã gửi yêu cầu hỗ trợ thành công!');
      setContent('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Gửi Hỗ Trợ</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gửi tin nhắn hoặc yêu cầu hỗ trợ liên quan đến học sinh <strong className="text-slate-700">{activeChild.name}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        
        {/* FORM GỬI YÊU CẦU */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="p-5 border-b border-slate-100 bg-blue-50/50">
              <h3 className="font-bold text-blue-800 flex items-center gap-2">
              <Send className="w-5 h-5" />
              Gửi yêu cầu mới
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Loại yêu cầu</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-slate-50 font-medium"
              >
                <option value="Xin phép nghỉ học">Xin phép nghỉ học</option>
                <option value="Hỏi bài tập">Hỏi bài tập</option>
                <option value="Thắc mắc điểm số">Thắc mắc điểm số</option>
                <option value="Góp ý">Góp ý</option>
                <option value="Khác">Khác...</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nội dung</label>
              <textarea 
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung yêu cầu của bạn..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
              ></textarea>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </form>
        </div>

        {/* LỊCH SỬ YÊU CẦU */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Lịch sử gửi
            </h3>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {mockMyTickets.map(ticket => (
              <div key={ticket.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600">
                    {ticket.type}
                  </span>
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-bold",
                    ticket.status === 'Chờ xử lý' ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {ticket.status === 'Chờ xử lý' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800">{ticket.content}</p>
                <p className="text-xs text-slate-400 mt-2">{ticket.date}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
