import React, { useState, useEffect } from 'react';
import { Bell, Plus, Pin, Paperclip, Send, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { adminService } from '../../services/admin.service';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAcademicStore } from '../../stores/useAcademicStore';

export default function AdminThongBao() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    tieuDe: '',
    noiDung: '',
    dinhKem: '',
    ghim: false,
    loaiNguoiNhan: 'TAT_CA', // TAT_CA, GIAO_VIEN, PHU_HUYNH, HOC_SINH
  });

  const { user } = useAuthStore();
  const { selectedNamHocId } = useAcademicStore();
  const [thongBaoList, setThongBaoList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchThongBao = async () => {
    try {
      const data = await adminService.getThongBaos();
      setThongBaoList(data || []);
    } catch (err) {
      toast.error('Lỗi tải thông báo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThongBao();
  }, [selectedNamHocId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tieuDe || !formData.noiDung) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }
    
    try {
      if (editingId) {
        await adminService.updateThongBao(editingId, {
          tieuDe: formData.tieuDe,
          noiDung: formData.noiDung,
          loaiNguoiNhan: formData.loaiNguoiNhan,
          nguoiDangId: user?.id || user?.userId,
          laGhim: formData.ghim
        });
        toast.success('Cập nhật thông báo thành công');
      } else {
        await adminService.createThongBao({
          tieuDe: formData.tieuDe,
          noiDung: formData.noiDung,
          loaiNguoiNhan: formData.loaiNguoiNhan,
          nguoiDangId: user?.id || user?.userId,
          laGhim: formData.ghim
        });
        toast.success('Gửi thông báo thành công');
      }
      setFormData({ tieuDe: '', noiDung: '', dinhKem: '', ghim: false, loaiNguoiNhan: 'TAT_CA' });
      setIsEditorOpen(false);
      setEditingId(null);
      fetchThongBao();
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu thông báo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;
    try {
      await adminService.deleteThongBao(id);
      toast.success('Đã xóa thông báo');
      fetchThongBao();
    } catch (err) {
      toast.error('Lỗi khi xóa thông báo');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Thông báo Toàn trường
          </h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý và gửi thông báo chung cho giáo viên, học sinh, phụ huynh.</p>
        </div>
        {!isEditorOpen && (
          <Button onClick={() => {
            setFormData({ tieuDe: '', noiDung: '', dinhKem: '', ghim: false, loaiNguoiNhan: 'TAT_CA' });
            setEditingId(null);
            setIsEditorOpen(true);
          }} leftIcon={<Plus className="w-4 h-4" />}>
            Tạo Thông Báo Mới
          </Button>
        )}
      </div>

      {isEditorOpen && (
        <Card className="border-blue-200 shadow-md ring-1 ring-blue-50">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100 p-5 flex flex-row items-center justify-between">
            <CardTitle className="text-blue-900 font-bold flex items-center gap-2">
              {editingId ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Send className="w-5 h-5 text-blue-600" />}
              {editingId ? 'Chỉnh Sửa Thông Báo' : 'Soạn Thông Báo Mới'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tiêu đề thông báo</label>
                <input 
                  type="text" 
                  value={formData.tieuDe}
                  onChange={e => setFormData({...formData, tieuDe: e.target.value})}
                  placeholder="Nhập tiêu đề..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 hover:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Đối tượng nhận</label>
                <select 
                  value={formData.loaiNguoiNhan}
                  onChange={e => setFormData({...formData, loaiNguoiNhan: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 hover:bg-white transition-colors"
                >
                  <option value="TAT_CA">Toàn trường (Tất cả mọi người)</option>
                  <option value="GIAO_VIEN">Chỉ Giáo viên</option>
                  <option value="HOC_SINH">Chỉ Học sinh</option>
                  <option value="PHU_HUYNH">Chỉ Phụ huynh</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nội dung</label>
                <textarea 
                  rows={6}
                  value={formData.noiDung}
                  onChange={e => setFormData({...formData, noiDung: e.target.value})}
                  placeholder="Nhập nội dung chi tiết thông báo..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 hover:bg-white transition-colors resize-y"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                    <Paperclip className="w-4 h-4 text-slate-400" />
                    Đính kèm File
                    <input type="file" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({...formData, dinhKem: e.target.files[0].name});
                      }
                    }} />
                  </label>
                  {formData.dinhKem && (
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md max-w-[150px] truncate">
                      {formData.dinhKem}
                    </span>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.ghim}
                    onChange={e => setFormData({...formData, ghim: e.target.checked})}
                    className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Pin className="w-4 h-4 text-amber-500" /> Ghim lên đầu
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => { setIsEditorOpen(false); setEditingId(null); }}>Hủy</Button>
                <Button type="submit" leftIcon={editingId ? <Edit2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}>
                  {editingId ? 'Lưu Thay Đổi' : 'Đăng Thông Báo'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
          <CardTitle className="text-slate-900 font-bold text-lg">Danh sách thông báo đã gửi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {thongBaoList.map((tb) => (
              <div key={tb.thongBaoId} className={`group p-6 hover:bg-slate-50/50 transition-colors ${tb.laGhim ? 'bg-amber-50/20' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-lg">{tb.tieuDe}</h3>
                      {tb.laGhim && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          <Pin className="w-3 h-3 mr-1" /> Đã ghim
                        </span>
                      )}
                      {new Date(tb.ngayDang).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Mới
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{tb.noiDung}</p>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-1">
                      <span>{new Date(tb.ngayDang).toLocaleDateString('vi-VN')} {new Date(tb.ngayDang).toLocaleTimeString('vi-VN')}</span>
                      <span>•</span>
                      <span>Đến: {tb.loaiNguoiNhan === 'TAT_CA' ? 'Toàn trường' : tb.loaiNguoiNhan === 'GIAO_VIEN' ? 'Giáo viên' : tb.loaiNguoiNhan === 'HOC_SINH' ? 'Học sinh' : 'Phụ huynh'}</span>
                      {tb.dinhKem && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-blue-600">
                            <Paperclip className="w-3 h-3" /> 1 File đính kèm
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setFormData({
                            tieuDe: tb.tieuDe,
                            noiDung: tb.noiDung,
                            dinhKem: tb.dinhKem || '',
                            ghim: !!tb.laGhim,
                            loaiNguoiNhan: tb.loaiNguoiNhan || 'TAT_CA'
                          });
                          setEditingId(tb.thongBaoId);
                          setIsEditorOpen(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(tb.thongBaoId)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                </div>
              </div>
            ))}
            {thongBaoList.length === 0 && (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
                <p>Chưa có thông báo nào được tạo.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
