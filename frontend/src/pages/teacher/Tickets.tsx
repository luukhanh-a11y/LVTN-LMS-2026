import { Plus, Clock, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { ticketService } from '../../services/ticket.service';
import toast from 'react-hot-toast';

export default function TeacherTickets() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'RESET_MAT_KHAU',
    description: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const ticketsData = await ticketService.getMyTickets();
      setTickets(ticketsData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Đánh dấu đã xem các thông báo
    localStorage.setItem('lastSeenTickets', Date.now().toString());
    window.dispatchEvent(new Event('ticketsUpdated'));
  }, []);

  const handleCreateTicket = async () => {
    if (!formData.description) {
      toast.error('Vui lòng nhập mô tả!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await ticketService.createTicket(
        formData.studentId ? parseInt(formData.studentId) : null,
        formData.type,
        formData.description
      );
      toast.success('Gửi yêu cầu hỗ trợ thành công!');
      setShowCreateModal(false);
      setFormData({ studentId: '', type: 'RESET_MAT_KHAU', description: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Phiếu Hỗ Trợ (Tickets)</h1>
        <Button className="flex items-center" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo yêu cầu mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu đã gửi cho Quản trị viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã phiếu</TableHead>
                <TableHead>Học sinh liên quan</TableHead>
                <TableHead>Loại yêu cầu</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú từ Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Bạn chưa gửi yêu cầu hỗ trợ nào
                  </TableCell>
                </TableRow>
              ) : tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-slate-900">#{ticket.id}</TableCell>
                  <TableCell>{ticket.studentName || 'Không có'}</TableCell>
                  <TableCell>{ticket.type === 'RESET_MAT_KHAU' ? 'Cấp lại mật khẩu' : ticket.type}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleString('vi-VN')}</TableCell>
                  <TableCell>
                    {ticket.status === 'CHO_DUYET' ? (
                      <Badge variant="warning" className="flex items-center w-fit">
                         <Clock className="w-3 h-3 mr-1" /> Chờ xử lý
                      </Badge>
                    ) : ticket.status === 'DA_DUYET' ? (
                      <Badge variant="success" className="flex items-center w-fit">
                         <CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="flex items-center w-fit">
                         <X className="w-3 h-3 mr-1" /> Bị từ chối
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {ticket.adminNote ? (
                      <span className="text-sm text-slate-600 line-clamp-2" title={ticket.adminNote}>
                        {ticket.adminNote}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Không có</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tạo Yêu cầu mới */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Tạo Phiếu Hỗ Trợ Mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Loại yêu cầu</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="RESET_MAT_KHAU">Cấp lại mật khẩu học sinh</option>
                  <option value="SAI_THONG_TIN">Sửa sai thông tin học sinh</option>
                  <option value="HO_TRO_KY_THUAT">Hỗ trợ kỹ thuật khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">ID Học sinh liên quan (nếu có)</label>
                <input 
                  type="text"
                  placeholder="Nhập User ID của học sinh (nếu có)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm focus:border-primary"
                  value={formData.studentId}
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả chi tiết</label>
                <textarea 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-24 resize-none"
                  placeholder="Nhập mô tả lý do để Admin dễ dàng hỗ trợ..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Hủy bỏ</Button>
                <Button className="bg-primary hover:bg-primary/90" isLoading={isSubmitting} onClick={handleCreateTicket}>Gửi yêu cầu</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
