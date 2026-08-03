import { useEffect, useState } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { adminService } from '../../services/admin.service';
import { GRADES } from '../../constants';

const NHAN_HOC_TAP: Record<string, string> = {
  HOAN_THANH_TOT: 'Hoàn thành Tốt',
  HOAN_THANH: 'Hoàn thành',
  CHUA_HOAN_THANH: 'Chưa hoàn thành',
};
const NHAN_REN_LUYEN: Record<string, string> = { TOT: 'Tốt', DAT: 'Đạt', CAN_CO_GANG: 'Cần cố gắng' };
const NHAN_QUYET_DINH: Record<string, string> = { LEN_LOP: 'Lên lớp', O_LAI: 'Ở lại', CHUYEN_CUP: 'Chuyển cấp' };

export default function AdminKetQuaCuoiNam() {
  const [namHoc, setNamHoc] = useState('');
  const [khoiLop, setKhoiLop] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    adminService.getTongHopKetQuaCuoiNam(namHoc || undefined, khoiLop ? Number(khoiLop) : undefined)
      .then(setRows)
      .catch(() => { setRows([]); setIsError(true); })
      .finally(() => setIsLoading(false));
  }, [namHoc, khoiLop]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center">
        <GraduationCap className="w-6 h-6 mr-2 text-primary" />
        Kết quả cuối năm — Toàn trường
      </h1>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50 items-center">
          <div className="font-semibold text-slate-700 mr-2">Bộ lọc:</div>
          <input
            className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Năm học (VD: 2025-2026)"
            value={namHoc}
            onChange={(e) => setNamHoc(e.target.value)}
          />
          <select
            className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={khoiLop}
            onChange={(e) => setKhoiLop(e.target.value)}
          >
            <option value="">Tất cả khối</option>
            {GRADES.filter((g) => g.value !== 'all').map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Năm học</TableHead>
                    <TableHead className="text-center">Học tập</TableHead>
                    <TableHead className="text-center">Rèn luyện</TableHead>
                    <TableHead className="text-center">Quyết định</TableHead>
                    <TableHead>GVCN xét</TableHead>
                    <TableHead>Ngày xét</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                        {isError ? 'Không tải được dữ liệu, vui lòng thử lại.' : 'Chưa có kết quả nào phù hợp bộ lọc.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r) => (
                      <TableRow key={r.ketQuaId}>
                        <TableCell className="font-medium text-slate-800">{r.hoTenHocSinh} <span className="text-xs text-slate-500">({r.maHocSinh})</span></TableCell>
                        <TableCell>{r.tenLop}</TableCell>
                        <TableCell>{r.namHoc}</TableCell>
                        <TableCell className="text-center">{NHAN_HOC_TAP[r.ketQuaHocTap] ?? r.ketQuaHocTap}</TableCell>
                        <TableCell className="text-center">{NHAN_REN_LUYEN[r.ketQuaRenLuyen] ?? r.ketQuaRenLuyen}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={r.quyetDinh === 'LEN_LOP' ? 'success' : r.quyetDinh === 'O_LAI' ? 'danger' : 'outline'}>
                            {NHAN_QUYET_DINH[r.quyetDinh] ?? r.quyetDinh}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.tenGiaoVienXet}</TableCell>
                        <TableCell>{r.ngayXet}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
