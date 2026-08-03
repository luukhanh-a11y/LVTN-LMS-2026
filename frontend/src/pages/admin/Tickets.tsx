import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { ticketService } from '../../services/ticket.service';
import toast from 'react-hot-toast';

export default function AdminTickets() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await ticketService.getPendingTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleProcess = async (ticketId: number, status: string) => {
    if (status === 'TU_CHOI' && !rejectNote && selectedTicket) {
      toast.error('Vui lòng nhập lý do từ chối!');
      return;
    }
    
    setIsProcessing(true);
    try {
      await ticketService.processTicket(ticketId, status, rejectNote);
      toast.success(status === 'DA_DUYET' ? 'Đã duyệt yêu cầu thành công!' : 'Đã từ chối yêu cầu!');
      setSelectedTicket(null);
      setRejectNote('');
      fetchTickets();
      window.dispatchEvent(new Event('ticketsUpdated'));
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi xử lý phiếu');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Phiếu Hỗ Trợ (Tickets)</h1>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã phiếu</TableHead>
                <TableHead>Học sinh liên quan</TableHead>
                <TableHead>Giáo viên yêu cầu</TableHead>
                <TableHead>Loại yêu cầu</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Không có phiếu hỗ trợ nào đang chờ duyệt
                  </TableCell>
                </TableRow>
              ) : tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-slate-900">#{ticket.id}</TableCell>
                  <TableCell className="font-medium text-slate-800">{ticket.studentName}</TableCell>
                  <TableCell>{ticket.teacherName}</TableCell>
                  <TableCell>{ticket.type === 'RESET_MAT_KHAU' ? 'Cấp lại mật khẩu' : ticket.type}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleString('vi-VN')}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === 'CHO_DUYET' ? 'warning' : ticket.status === 'DA_DUYET' ? 'success' : 'danger'}>
                      {ticket.status === 'CHO_DUYET' ? 'Chờ duyệt' : ticket.status === 'DA_DUYET' ? 'Đã duyệt' : 'Từ chối'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedTicket(ticket)}>Chi tiết</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Chi tiết Ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Chi tiết Phiếu hỗ trợ #{selectedTicket.id}</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Trạng thái:</span>
                  <Badge variant={selectedTicket.status === 'CHO_DUYET' ? 'warning' : 'success'}>
                    {selectedTicket.status === 'CHO_DUYET' ? 'Chờ duyệt' : 'Đã duyệt'}
                  </Badge>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Học sinh liên quan:</span>
                  <span className="font-bold text-slate-800">{selectedTicket.studentName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Giáo viên yêu cầu:</span>
                  <span className="font-medium text-slate-800">{selectedTicket.teacherName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Loại yêu cầu:</span>
                  <span className="font-medium text-slate-800">{selectedTicket.type === 'RESET_MAT_KHAU' ? 'Cấp lại mật khẩu' : selectedTicket.type}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Thời gian:</span>
                  <span className="text-slate-800">{new Date(selectedTicket.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                
                <div className="pt-2">
                  <span className="text-slate-500 text-sm block mb-1">Chi tiết lỗi/Mô tả từ GV:</span>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded text-sm text-slate-700 min-h-[60px]">
                    {selectedTicket.description || 'Không có mô tả thêm.'}
                  </div>
                </div>

                {selectedTicket.status === 'CHO_DUYET' && (
                  <div className="pt-2">
                    <span className="text-slate-500 text-sm block mb-1">Ghi chú từ chối (nếu có):</span>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm focus:border-primary"
                      placeholder="Nhập lý do nếu bạn từ chối phiếu này..."
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-4">
                <Button variant="outline" onClick={() => { setSelectedTicket(null); setRejectNote(''); }}>Đóng</Button>
                {selectedTicket.status === 'CHO_DUYET' && (
                  <>
                    <Button variant="danger" isLoading={isProcessing} onClick={() => handleProcess(selectedTicket.id, 'TU_CHOI')}>Từ chối</Button>
                    <Button className="bg-pro-success hover:brightness-95" isLoading={isProcessing} onClick={() => handleProcess(selectedTicket.id, 'DA_DUYET')}>Duyệt yêu cầu</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
