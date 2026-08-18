import { useEffect, useState } from 'react';
import { GraduationCap, ArrowRight, Lock, Unlock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';
import { classService } from '../../services/class.service';
import { academicService, type CauHinhHeThong, type NamHoc } from '../../services/academic.service';
import { useAcademicStore } from '../../stores/useAcademicStore';
import { cn } from '../../lib/utils';

const NHAN_QUYET_DINH: Record<string, { label: string; variant: 'success' | 'outline' | 'danger' }> = {
  LEN_LOP: { label: 'Lên lớp', variant: 'success' },
  O_LAI: { label: 'Ở lại', variant: 'outline' },
  CHUYEN_CUP: { label: 'Chuyển cấp', variant: 'danger' },
};

export default function AdminKetQuaCuoiNam({ isInsideTab = false }: { isInsideTab?: boolean }) {
  const [classes, setClasses] = useState<any[]>([]);
  const [targetClasses, setTargetClasses] = useState<any[]>([]);
  const [namHocList, setNamHocList] = useState<NamHoc[]>([]);
  const [cauHinh, setCauHinh] = useState<CauHinhHeThong | null>(null);
  
  const currentNamHoc = useAcademicStore((state) => state.selectedNamHoc);
  const isReadOnly = useAcademicStore((state) => state.isReadOnly);
  const [namHocCu, setNamHocCu] = useState('');

  const [targetClassId, setTargetClassId] = useState('');
  const [targetNamHoc, setTargetNamHoc] = useState('');

  const [pendingRecords, setPendingRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [newDanhGiaNamHoc, setNewDanhGiaNamHoc] = useState('');

  const [filterKhoiLop, setFilterKhoiLop] = useState('');
  const [filterLop, setFilterLop] = useState('');
  const [filterQuyetDinh, setFilterQuyetDinh] = useState('');
  const [selectedKetQuaIds, setSelectedKetQuaIds] = useState<number[]>([]);

  const loadCauHinh = () => {
    academicService.getCauHinhHeThong().then((c) => {
      setCauHinh(c);
      if (c.namHocDanhGia) {
        setNamHocCu(c.namHocDanhGia);
      } else if (currentNamHoc) {
        setNamHocCu(currentNamHoc);
      }
    }).catch(console.error);
  };

  useEffect(() => {
    classService.getAllClasses().then(setClasses).catch(console.error);
    academicService.getNamHocs().then(setNamHocList).catch(console.error);
    loadCauHinh();
  }, []);

  useEffect(() => {
    if (targetNamHoc) {
      const selectedYear = namHocList.find(nh => nh.tenNamHoc === targetNamHoc);
      if (selectedYear) {
        classService.getAllClasses(selectedYear.namHocId).then(setTargetClasses).catch(console.error);
      } else {
        setTargetClasses([]);
      }
    } else {
      setTargetClasses([]);
    }
  }, [targetNamHoc, namHocList]);

  const isDangMo = !!cauHinh?.danhGiaCuoiNamDangMo;

  const handleSearch = async () => {
    if (!namHocCu) {
      toast.error('Vui lòng nhập năm học!');
      return;
    }
    setIsLoading(true);
    try {
      const all = await adminService.getAllKetQuaCuoiNam();
      // Nếu đang ở chế độ CHỈ XEM (năm cũ), ta hiển thị danh sách ĐÃ DUYỆT. Ngược lại, hiển thị CHƯA DUYỆT.
      const filtered = all.filter((r) => r.namHoc === namHocCu && (isReadOnly ? r.daDuyet : !r.daDuyet));
      setPendingRecords(filtered);
      if (filtered.length === 0) {
        toast.success(isReadOnly ? 'Không có danh sách đã duyệt cho năm học này.' : 'Không có đề xuất nào đang chờ duyệt cho năm học này.');
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tải danh sách kết quả');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = pendingRecords.filter((r) => {
    let match = true;
    if (filterLop && String(r.lopHocId) !== filterLop) match = false;
    if (filterQuyetDinh && r.quyetDinh !== filterQuyetDinh) match = false;
    if (filterKhoiLop) {
      const cls = classes.find((c) => c.lopHocId === r.lopHocId);
      if (String(cls?.khoiLop) !== filterKhoiLop) match = false;
    }
    return match;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredRecords.map((r) => r.ketQuaId);
      setSelectedKetQuaIds(Array.from(new Set([...selectedKetQuaIds, ...allIds])));
    } else {
      const allIds = filteredRecords.map((r) => r.ketQuaId);
      setSelectedKetQuaIds(selectedKetQuaIds.filter((id) => !allIds.includes(id)));
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedKetQuaIds([...selectedKetQuaIds, id]);
    } else {
      setSelectedKetQuaIds(selectedKetQuaIds.filter((x) => x !== id));
    }
  };

  const isAllSelected = filteredRecords.length > 0 && filteredRecords.every((r) => selectedKetQuaIds.includes(r.ketQuaId));

  const handleOpenEvaluation = async () => {};

  const handleCloseEvaluation = async () => {
    try {
      await adminService.setDotDanhGia(1, false, cauHinh?.namHocDanhGia ?? namHocCu);
      toast.success('Đã đóng đợt đánh giá. Giáo viên không thể sửa đề xuất nữa.');
      loadCauHinh();
    } catch (err) {
      toast.error('Có lỗi xảy ra khi đóng đợt đánh giá.');
    }
  };

  const handleDuyet = async () => {
    if (selectedKetQuaIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 học sinh để duyệt!');
      return;
    }
    const selectedRecords = pendingRecords.filter(r => selectedKetQuaIds.includes(r.ketQuaId));
    const lenLopRecords = selectedRecords.filter((r) => r.quyetDinh === 'LEN_LOP');
    if (lenLopRecords.length > 0 && !targetClassId) {
      toast.error('Vui lòng chọn Lớp mới cho các học sinh Lên lớp!');
      return;
    }

    setIsProcessing(true);
    try {
      const requests = selectedRecords.map((r) => ({
        ketQuaId: r.ketQuaId,
        lopMoiId: r.quyetDinh === 'LEN_LOP' ? Number(targetClassId) : undefined,
        namHocMoi: targetNamHoc || undefined,
      }));
      await adminService.duyetKetQuaCuoiNamHangLoat(requests);
      toast.success(`Đã duyệt & chuyển lớp cho ${requests.length} học sinh!`);
      setPendingRecords(pendingRecords.filter(r => !selectedKetQuaIds.includes(r.ketQuaId)));
      setSelectedKetQuaIds([]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi duyệt hàng loạt');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn("space-y-6 slide-in-from-bottom-4 duration-500", !isInsideTab && "animate-in fade-in")}>
      {!isInsideTab && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">Xét kết quả cuối năm</h1>
            {cauHinh && (
              <Badge variant={isDangMo ? 'success' : 'outline'} className="px-3 py-1.5">
                {isDangMo ? <Unlock className="w-3.5 h-3.5 mr-1.5 inline" /> : <Lock className="w-3.5 h-3.5 mr-1.5 inline" />}
                {isDangMo ? `Đang mở đợt (${cauHinh.namHocDanhGia})` : 'Đang đóng'}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {!isReadOnly && (
              isDangMo ? (
                <Button size="sm" onClick={handleCloseEvaluation} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  Đóng Đợt Đánh Giá
                </Button>
              ) : (
                <Button size="sm" onClick={() => setShowOpenModal(true)} variant="primary" className="bg-emerald-600 hover:bg-emerald-700">
                  Mở Đợt Đánh Giá Mới
                </Button>
              )
            )}
          </div>
        </div>
      )}

      {isInsideTab && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {cauHinh && (
              <Badge variant={isDangMo ? 'success' : 'outline'} className="px-3 py-1.5">
                {isDangMo ? <Unlock className="w-3.5 h-3.5 mr-1.5 inline" /> : <Lock className="w-3.5 h-3.5 mr-1.5 inline" />}
                {isDangMo ? `Đang mở đợt (${cauHinh.namHocDanhGia})` : 'Đang đóng'}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {!isReadOnly && (
              isDangMo ? (
                <Button size="sm" onClick={handleCloseEvaluation} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  Đóng Đợt Đánh Giá
                </Button>
              ) : (
                <Button size="sm" onClick={() => setShowOpenModal(true)} variant="primary" className="bg-emerald-600 hover:bg-emerald-700">
                  Mở Đợt Đánh Giá Mới
                </Button>
              )
            )}
          </div>
        </div>
      )}

      <div className={pendingRecords.length > 0 ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}>
        <Card>
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-700">{isReadOnly ? 'Lấy danh sách đã duyệt' : 'Bước 1: Lấy danh sách đề xuất chờ duyệt'}</h2>
          </div>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Năm học</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={namHocCu}
                onChange={(e) => setNamHocCu(e.target.value)}
              >
                <option value="">-- Chọn năm học --</option>
                {namHocList.map((nh) => (
                  <option key={nh.namHocId} value={nh.tenNamHoc}>{nh.tenNamHoc}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-2">
              <Button size="sm" onClick={handleSearch} isLoading={isLoading}>
                {isReadOnly ? 'Lấy Danh Sách Đã Duyệt' : 'Lấy Danh Sách Chờ Duyệt'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {!isReadOnly && pendingRecords.length > 0 && (
          <Card>
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-700">Bước 2: Chỉ định Lớp Mới (cho nhóm Lên lớp)</h2>
            </div>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Năm học mới</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={targetNamHoc}
                  onChange={(e) => setTargetNamHoc(e.target.value)}
                >
                  <option value="">-- Chọn năm học mới --</option>
                  {namHocList.map((nh) => (
                    <option key={nh.namHocId} value={nh.tenNamHoc}>{nh.tenNamHoc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lớp mới</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                >
                  <option value="">-- Chọn lớp mới --</option>
                  {targetClasses.map((c) => (
                    <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={handleDuyet} isLoading={isProcessing} variant="primary">
                  Duyệt & Chuyển lớp {selectedKetQuaIds.length} Học Sinh
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-700">{isReadOnly ? 'Danh sách đã duyệt' : 'Danh sách chờ duyệt'} ({filteredRecords.length} học sinh)</h2>
        </div>
        <CardContent className="p-0">
          <div className="p-4 bg-white border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              value={filterKhoiLop}
              onChange={e => setFilterKhoiLop(e.target.value)}
            >
              <option value="">-- Tất cả Khối --</option>
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Khối {i+1}</option>)}
            </select>
            <select
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              value={filterLop}
              onChange={e => setFilterLop(e.target.value)}
            >
              <option value="">-- Tất cả Lớp --</option>
              {classes.filter(c => !filterKhoiLop || String(c.khoiLop) === filterKhoiLop).map(c => (
                <option key={c.lopHocId} value={c.lopHocId}>{c.tenLop}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              value={filterQuyetDinh}
              onChange={e => setFilterQuyetDinh(e.target.value)}
            >
              <option value="">-- Tất cả Quyết định --</option>
              <option value="LEN_LOP">Lên lớp</option>
              <option value="O_LAI">Ở lại</option>
              <option value="CHUYEN_CUP">Chuyển cấp</option>
            </select>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow>
                  {!isReadOnly && (
                    <TableHead className="w-12 text-center">
                      <input type="checkbox" className="rounded border-slate-300 cursor-pointer" checked={isAllSelected} onChange={handleSelectAll} />
                    </TableHead>
                  )}
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Năm học</TableHead>
                  <TableHead className="text-center">Học tập</TableHead>
                  <TableHead className="text-center">Quyết định (GV đề xuất)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isReadOnly ? 5 : 6} className="text-center py-8 text-slate-500">
                      Chưa có dữ liệu. Hãy tìm kiếm ở Bước 1.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((r) => (
                    <TableRow key={r.ketQuaId}>
                      {!isReadOnly && (
                        <TableCell className="text-center">
                          <input type="checkbox" className="rounded border-slate-300 cursor-pointer" checked={selectedKetQuaIds.includes(r.ketQuaId)} onChange={e => handleSelectOne(r.ketQuaId, e.target.checked)} />
                        </TableCell>
                      )}
                      <TableCell className="font-medium text-slate-800">{r.hoTenHocSinh}</TableCell>
                      <TableCell>{r.tenLop}</TableCell>
                      <TableCell>{r.namHoc}</TableCell>
                      <TableCell className="text-center">{r.ketQuaHocTap}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={NHAN_QUYET_DINH[r.quyetDinh]?.variant ?? 'outline'}>
                          {NHAN_QUYET_DINH[r.quyetDinh]?.label ?? r.quyetDinh}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-slate-400 flex items-center gap-1.5">
        <GraduationCap className="w-3.5 h-3.5" /> Giáo viên chủ nhiệm đề xuất kết quả từng học sinh — Admin duyệt lần cuối ở đây mới thật sự chuyển lớp.
      </div>

      <Modal isOpen={showOpenModal} onClose={() => setShowOpenModal(false)} title="Mở đợt đánh giá mới">
        <div className="p-4 space-y-4">
          <p className="text-sm text-slate-600">Bạn chuẩn bị mở đợt đánh giá cuối năm cho năm học hiện tại: <span className="font-bold text-slate-800">{currentNamHoc || 'Hệ thống'}</span>.</p>
          <p className="text-sm text-slate-600">Khi mở đợt, giáo viên có thể bắt đầu đánh giá học sinh.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowOpenModal(false)}>Hủy</Button>
            <Button variant="primary" onClick={() => {
              const year = currentNamHoc;
              if (!year) {
                toast.error('Không xác định được năm học hiện tại');
                return;
              }
              adminService.setDotDanhGia(1, true, year)
                .then(() => adminService.thongBaoMoDanhGia(year))
                .then(() => {
                  toast.success('Đã mở đợt đánh giá!');
                  setShowOpenModal(false);
                  loadCauHinh();
                }).catch(() => toast.error('Lỗi khi mở đợt'));
            }}>Mở Đợt</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
