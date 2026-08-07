import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ArrowRightLeft, History, Plus, Trash2, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

import { classService, type ClassRoom } from '../../services/class.service';
import { adminService } from '../../services/admin.service';

export default function ClassDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [classData, setClassData] = useState<ClassRoom | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [allClasses, setAllClasses] = useState<ClassRoom[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [transferClassId, setTransferClassId] = useState('');

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyStudent, setHistoryStudent] = useState<any>(null);
  const [transferHistory, setTransferHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [phanCongs, setPhanCongs] = useState<any[]>([]);
  const [showPhanCongModal, setShowPhanCongModal] = useState(false);
  const [pcMonHocId, setPcMonHocId] = useState('');
  const [pcGiaoVienId, setPcGiaoVienId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const handleCreatePhanCong = async () => {
    if (!id || !pcMonHocId || !pcGiaoVienId) {
      toast.error('Vui lòng nhập đầy đủ ID Môn học và ID Giáo viên!');
      return;
    }
    setIsAssigning(true);
    try {
      await classService.createPhanCong({
        giaoVienId: pcGiaoVienId,
        monHocId: Number(pcMonHocId),
        lopHocId: Number(id)
      });
      toast.success('Đã thêm phân công giảng dạy!');
      setShowPhanCongModal(false);
      setPcMonHocId('');
      setPcGiaoVienId('');
      classService.getPhanCongByLop(parseInt(id)).then(setPhanCongs).catch(() => {});
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi tạo phân công giảng dạy');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDeletePhanCong = async (pcId: number) => {
    if (!id) return;
    try {
      await classService.deletePhanCong(pcId);
      toast.success('Đã hủy phân công');
      classService.getPhanCongByLop(parseInt(id)).then(setPhanCongs).catch(() => {});
    } catch {
      toast.error('Không thể hủy phân công');
    }
  };

  const fetchData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [cls, stus, clsList, pcs] = await Promise.all([
        classService.getClassById(parseInt(id)),
        classService.getStudentsByClass(parseInt(id)),
        classService.getAllClasses(),
        classService.getPhanCongByLop(parseInt(id)).catch(() => [])
      ]);
      setClassData(cls);
      setStudents(stus);
      setAllClasses(clsList);
      setPhanCongs(pcs || []);
    } catch (err) {
      toast.error('Không thể tải dữ liệu lớp học');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleOpenTransferModal = (student: any) => {
    setSelectedStudent(student);
    setTransferClassId('');
    setShowTransferModal(true);
  };

  const handleOpenHistoryModal = async (student: any) => {
    setHistoryStudent(student);
    setShowHistoryModal(true);
    setIsLoadingHistory(true);
    try {
      const data = await adminService.getClassTransferHistory(student.id);
      setTransferHistory(data);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải lịch sử chuyển lớp');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleTransferClass = async () => {
    if (!transferClassId || !selectedStudent) return;
    setIsTransferring(true);
    try {
      await adminService.transferClass(selectedStudent.id, parseInt(transferClassId));
      toast.success('Chuyển lớp thành công!');
      setShowTransferModal(false);
      fetchData(); // Reload data
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi chuyển lớp');
    } finally {
      setIsTransferring(false);
    }
  };

  if (!classData && isLoading) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>;
  }

  if (!classData && !isLoading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-slate-500">Không tìm thấy lớp học</div>
        <Button variant="outline" onClick={() => navigate('/admin/classes')}>Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/admin/classes" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-800">Chi tiết lớp: {classData?.tenLop}</h1>
            <Badge variant={classData?.trangThai === 'ACTIVE' ? 'success' : 'outline'}>
              {classData?.trangThai === 'ACTIVE' ? 'Đang hoạt động' : 'Đóng băng'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Niên khóa {classData?.namHoc?.tenNamHoc} • GVCN: {classData?.giaoVienChuNhiem?.hoTen || 'Chưa phân công'}
          </p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div className="flex items-center space-x-2 text-slate-700 font-medium">
            <Users className="h-5 w-5 text-primary" />
            <span>Danh sách học sinh ({students.length} / {classData?.siSoToiDa})</span>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HS</TableHead>
                <TableHead>Họ và Tên</TableHead>
                <TableHead>Phụ huynh</TableHead>
                <TableHead>SĐT liên hệ</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Chưa có học sinh nào trong lớp này.</TableCell>
                </TableRow>
              ) : (
                students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium text-primary">{student.code}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.parentName || <span className="text-slate-400 italic">Chưa liên kết</span>}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenHistoryModal(student)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                        <History className="h-4 w-4 mr-1.5" />
                        Lịch sử
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenTransferModal(student)} className="text-pro-primary hover:text-pro-primary hover:bg-pro-primary/10">
                        <ArrowRightLeft className="h-4 w-4 mr-1.5" />
                        Chuyển lớp
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div className="flex items-center space-x-2 text-slate-700 font-medium">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Phân công giảng dạy bộ môn ({phanCongs.length})</span>
          </div>
          <Button size="sm" onClick={() => setShowPhanCongModal(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Thêm Phân công
          </Button>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Môn học</TableHead>
                <TableHead>Giáo viên phụ trách</TableHead>
                <TableHead>Năm học</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {phanCongs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">Chưa có phân công bộ môn nào cho lớp này.</TableCell>
                </TableRow>
              ) : (
                phanCongs.map((pc: any) => (
                  <TableRow key={pc.phanCongId || pc.id}>
                    <TableCell className="font-medium text-slate-800">{pc.tenMonHoc || `Môn ID: ${pc.monHocId}`}</TableCell>
                    <TableCell>{pc.tenGiaoVien || `GV ID: ${pc.giaoVienId}`}</TableCell>
                    <TableCell>{pc.namHoc || classData?.namHoc?.tenNamHoc || '---'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePhanCong(pc.phanCongId || pc.id)} className="text-pro-destructive hover:bg-pro-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Chuyển lớp Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Chuyển lớp học sinh"
      >
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg text-sm mb-4">
            <p><strong>Học sinh:</strong> {selectedStudent?.name} ({selectedStudent?.code})</p>
            <p><strong>Lớp hiện tại:</strong> {classData?.tenLop}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn lớp chuyển đến</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
              value={transferClassId}
              onChange={(e) => setTransferClassId(e.target.value)}
            >
              <option value="">-- Chọn lớp --</option>
              {allClasses.filter(c => c.lopHocId !== classData?.lopHocId && c.trangThai === 'ACTIVE').map(c => (
                <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop} (Khối {c.khoiLop})</option>
              ))}
            </select>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
            <Button type="button" variant="outline" onClick={() => setShowTransferModal(false)}>Hủy bỏ</Button>
            <Button onClick={handleTransferClass} isLoading={isTransferring} disabled={!transferClassId}>Xác nhận chuyển</Button>
          </div>
        </div>
      </Modal>

      {/* Lịch sử chuyển lớp Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Lịch sử chuyển lớp"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            <strong>Học sinh:</strong> {historyStudent?.name} ({historyStudent?.code})
          </p>

          {isLoadingHistory ? (
            <div className="text-center py-6 text-slate-500 text-sm">Đang tải...</div>
          ) : transferHistory.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">Chưa có lịch sử chuyển lớp nào.</div>
          ) : (
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {transferHistory.map((h) => (
                <div key={h.id} className="p-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-800">
                      {h.lopCu ? `${h.lopCu} (${h.namHocCu})` : 'Chưa có lớp'} → {h.lopMoi} ({h.namHocMoi})
                    </span>
                    <span className="text-xs text-slate-400">{h.thoiDiemChuyen}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Lý do: {h.lyDo} {h.ghiChu ? `— ${h.ghiChu}` : ''} • Thực hiện bởi: {h.nguoiThucHien}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex justify-end border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setShowHistoryModal(false)}>Đóng</Button>
          </div>
        </div>
      </Modal>

      {/* Phân công giảng dạy Modal */}
      <Modal
        isOpen={showPhanCongModal}
        onClose={() => setShowPhanCongModal(false)}
        title="Thêm Phân công Giảng dạy"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ID Môn học</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
              placeholder="VD: 1 (Toán), 2 (Tiếng Việt)..."
              value={pcMonHocId}
              onChange={(e) => setPcMonHocId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ID / Mã Giáo viên</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
              placeholder="Nhập ID hoặc UUID của Giáo viên"
              value={pcGiaoVienId}
              onChange={(e) => setPcGiaoVienId(e.target.value)}
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
            <Button type="button" variant="outline" onClick={() => setShowPhanCongModal(false)}>Hủy bỏ</Button>
            <Button onClick={handleCreatePhanCong} isLoading={isAssigning}>Xác nhận phân công</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
