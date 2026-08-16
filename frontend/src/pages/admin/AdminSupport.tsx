import { useState, useEffect } from 'react';
import { Ticket, Search, Filter, CheckCircle2, MessageSquare, Clock, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import { ticketService } from '../../services/ticket.service';
import { useAcademicStore } from '../../stores/useAcademicStore';

export default function AdminSupport({ isInsideTab = false }: { isInsideTab?: boolean }) {
  const { selectedNamHocId } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [rejectTicketId, setRejectTicketId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const statusMap: Record<string, string> = {
        'Tất cả': '',
        'Chờ xử lý': 'CHO_DUYET',
        'Đã phê duyệt': 'DA_DUYET',
        'Đã từ chối': 'TU_CHOI'
      };

      const res = await ticketService.searchTickets({
        keyword: debouncedSearch,
        trangThai: statusMap[statusFilter],
        page: 0,
        size: 50
      });

      const mapped = res.content.map((t: any) => ({
        id: t.id,
        sender: t.teacherName || 'Giáo viên',
        description: t.description,
        status: t.status === 'CHO_DUYET' ? 'Chờ xử lý' : t.status === 'DA_DUYET' ? 'Đã phê duyệt' : 'Đã từ chối',
        type: t.type === 'RESET_MAT_KHAU' ? 'Reset mật khẩu' : t.type === 'HO_TRO_KY_THUAT' ? 'Hỗ trợ kỹ thuật' : 'Thay đổi thông tin',
        date: new Date(t.createdAt).toLocaleDateString('vi-VN')
      }));
      setTickets(mapped);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách phiếu hỗ trợ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [debouncedSearch, statusFilter, selectedNamHocId]);

  const filteredTickets = tickets;

  const handleApprove = async (id: number) => {
    try {
      await ticketService.processTicket(id, 'DA_DUYET');
      toast.success(`Đã phê duyệt phiếu #${id}`);
      fetchTickets();
    } catch (err) {
      toast.error('Có lỗi xảy ra khi phê duyệt');
    }
  };

  const openRejectModal = (id: number) => {
    setRejectTicketId(id);
    setRejectReason(''); // Reset reason
  };

  const confirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectTicketId) {
      try {
        await ticketService.processTicket(rejectTicketId, 'TU_CHOI', rejectReason);
        toast.success(`Đã từ chối phiếu #${rejectTicketId} thành công.`);
        setRejectTicketId(null);
        fetchTickets();
      } catch (err) {
        toast.error('Có lỗi xảy ra khi từ chối phiếu');
      }
    }
  };

  return (
    <div className={cn("max-w-6xl mx-auto space-y-6 h-full flex flex-col", !isInsideTab && "animate-in fade-in")}>
      {!isInsideTab && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quản lý Yêu cầu & Hỗ trợ</h2>
            <p className="text-sm text-slate-500 mt-1">Xử lý các yêu cầu từ Giáo viên và Phụ huynh.</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm theo người gửi hoặc nội dung..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đã phê duyệt">Đã phê duyệt</option>
              <option value="Đã từ chối">Đã từ chối</option>
            </select>
          </div>
        </div>

        {/* Danh sách Ticket */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50/30">
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 justify-between group hover:border-blue-300 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-slate-400">#{ticket.id}</span>
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold",
                      ticket.type === 'Reset mật khẩu' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {ticket.type}
                    </span>
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-bold",
                      ticket.status === 'Chờ xử lý' ? "text-amber-600" : 
                      ticket.status === 'Đã phê duyệt' ? "text-emerald-600" : "text-red-600"
                    )}>
                      {ticket.status === 'Chờ xử lý' && <Clock className="w-3.5 h-3.5" />}
                      {ticket.status === 'Đã phê duyệt' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {ticket.status === 'Đã từ chối' && <XCircle className="w-3.5 h-3.5" />}
                      {ticket.status}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 text-lg mb-2">{ticket.description}</h4>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      Người gửi: <strong className="text-slate-700">{ticket.sender}</strong>
                    </span>
                    <span>•</span>
                    <span>{ticket.date}</span>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-end gap-2">
                  {ticket.status === 'Chờ xử lý' ? (
                    <>
                      <Button 
                        onClick={() => openRejectModal(ticket.id)}
                        variant="danger"
                      >
                        Từ chối
                      </Button>
                      <Button 
                        onClick={() => handleApprove(ticket.id)}
                        variant="primary"
                      >
                        Phê duyệt
                      </Button>
                    </>
                  ) : (
                    <button className="px-5 py-2.5 bg-slate-100 text-slate-400 font-bold text-sm rounded-xl cursor-not-allowed">
                      {ticket.status}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 border-dashed rounded-2xl">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>Không có phiếu hỗ trợ nào phù hợp.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL TỪ CHỐI YÊU CẦU */}
      {rejectTicketId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-red-50/30">
              <div>
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <XCircle className="w-6 h-6" />
                  Từ chối phiếu hỗ trợ
                </h3>
                <p className="text-sm text-slate-500 mt-1">Phiếu #{rejectTicketId}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setRejectTicketId(null)} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={confirmReject} className="p-6 bg-slate-50/50 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Lý do từ chối</label>
                <select 
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                  required
                >
                  <option value="" disabled>-- Chọn lý do --</option>
                  <option value="Thông tin cung cấp chưa đầy đủ">Thông tin cung cấp chưa đầy đủ</option>
                  <option value="Yêu cầu sai quy định">Yêu cầu sai quy định</option>
                  <option value="Không thuộc thẩm quyền giải quyết">Không thuộc thẩm quyền giải quyết</option>
                  <option value="Khác">Lý do khác...</option>
                </select>
              </div>

              {rejectReason === 'Khác' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-bold text-slate-700">Nhập lý do cụ thể</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none bg-white resize-none"
                    placeholder="Nhập lý do từ chối..."
                    required
                  ></textarea>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setRejectTicketId(null)} 
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  variant="danger"
                >
                  Xác nhận từ chối
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
