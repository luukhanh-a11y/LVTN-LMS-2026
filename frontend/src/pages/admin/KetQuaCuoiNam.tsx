import { useEffect, useState } from 'react';
import { GraduationCap, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';
import { classService } from '../../services/class.service';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAcademicStore } from '../../stores/useAcademicStore';

export default function AdminKetQuaCuoiNam() {
  const { user } = useAuthStore();
  const [classes, setClasses] = useState<any[]>([]);
  const [namHocCu, setNamHocCu] = useState('');
  const [lopCuId, setLopCuId] = useState<string>('');
  
  const [targetClassId, setTargetClassId] = useState('');
  const [targetNamHoc, setTargetNamHoc] = useState('');
  
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    classService.getAllClasses().then(setClasses).catch(console.error);
  }, []);

  const handleSearch = async () => {
    if (!namHocCu) {
      toast.error('Vui lòng nhập năm học cũ!');
      return;
    }
    setIsLoading(true);
    try {
      // Gọi getTongHopKetQuaCuoiNam và tự filter bằng lopCuId ở frontend nếu API backend chưa hỗ trợ param lớp
      const allResults = await adminService.getTongHopKetQuaCuoiNam(namHocCu);
      const filtered = allResults.filter(
        (r) => 
          r.quyetDinh === 'LEN_LOP' && 
          (!lopCuId || r.lopHocId === Number(lopCuId) || r.tenLop === classes.find(c => c.lopHocId === Number(lopCuId))?.tenLop)
      );
      setStudents(filtered);
      if (filtered.length === 0) {
        toast.success('Không tìm thấy học sinh nào đủ điều kiện lên lớp trong danh sách này.');
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tải danh sách kết quả');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteBulkTransition = async () => {
    if (students.length === 0) return;
    if (!targetClassId || !targetNamHoc) {
      toast.error('Vui lòng chọn Lớp mới và điền Năm học mới!');
      return;
    }
    
    setIsProcessing(true);
    try {
      const payload = {
        hocSinhIds: students.map(s => s.hocSinhId),
        lopHocMoiId: Number(targetClassId),
        lyDo: 'Chuyển lớp hàng loạt đầu năm',
      };

      await adminService.bulkThucHienChuyenLop(payload);
      toast.success(`Đã chuyển lớp thành công cho ${students.length} học sinh!`);
      setStudents([]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi xử lý chuyển lớp hàng loạt');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenEvaluation = async () => {
    if (!namHocCu) {
      toast.error('Vui lòng nhập năm học cũ để mở đợt đánh giá!');
      return;
    }
    try {
      await adminService.thongBaoMoDanhGia(namHocCu);
      useAcademicStore.getState().setEvaluationOpen(true);
      toast.success(`Đã gửi thông báo mở đợt đánh giá cho năm học ${namHocCu} đến tất cả GVCN.`);
    } catch (err) {
      toast.error('Có lỗi xảy ra khi mở đợt đánh giá.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <GraduationCap className="w-6 h-6 mr-2 text-primary" />
          Quản Lý Kết Quả & Chuyển Lớp
        </h1>
        <Button onClick={handleOpenEvaluation} variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          Mở Đợt Đánh Giá Cuối Năm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BƯỚC 1: TÌM KIẾM DỮ LIỆU */}
        <Card>
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-700">Bước 1: Lấy danh sách đạt điều kiện Lên Lớp</h2>
          </div>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Năm học cũ (Ví dụ: 2024-2025)</label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={namHocCu}
                onChange={(e) => setNamHocCu(e.target.value)}
                placeholder="Nhập năm học..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lớp cũ</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={lopCuId}
                onChange={(e) => setLopCuId(e.target.value)}
              >
                <option value="">-- Chọn lớp cũ --</option>
                {classes.map(c => (
                  <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleSearch} isLoading={isLoading} className="w-full">
              Lấy Danh Sách
            </Button>
          </CardContent>
        </Card>

        {/* BƯỚC 2: CHUYỂN LỚP */}
        <Card className={students.length === 0 ? 'opacity-50 pointer-events-none' : ''}>
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-700">Bước 2: Chỉ định Lớp Mới</h2>
          </div>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Năm học mới</label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={targetNamHoc}
                onChange={(e) => setTargetNamHoc(e.target.value)}
                placeholder="Nhập năm học..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lớp mới</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
              >
                <option value="">-- Chọn lớp mới --</option>
                {classes.map(c => (
                  <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop}</option>
                ))}
              </select>
            </div>
            <Button 
              onClick={handleExecuteBulkTransition} 
              isLoading={isProcessing} 
              className="w-full"
              variant="default"
            >
              Thực Hiện Chuyển {students.length} Học Sinh
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-700">Danh sách chờ chuyển lớp ({students.length} học sinh)</h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[400px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Lớp cũ</TableHead>
                  <TableHead>Năm học cũ</TableHead>
                  <TableHead className="text-center">Học tập</TableHead>
                  <TableHead className="text-center">Quyết định</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Chưa có dữ liệu. Hãy tìm kiếm ở Bước 1.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-slate-800">{r.hoTenHocSinh} <span className="text-xs text-slate-500">({r.maHocSinh})</span></TableCell>
                      <TableCell>{r.tenLop}</TableCell>
                      <TableCell>{r.namHoc}</TableCell>
                      <TableCell className="text-center">{r.ketQuaHocTap}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="success">Lên lớp</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
