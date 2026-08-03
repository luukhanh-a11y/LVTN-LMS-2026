import { useState, useEffect, useRef } from 'react';
import { Download, Award, Loader2, Trophy, GraduationCap } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { parentService } from '../../services/parent.service';
import { useParentContextStore } from '../../stores/useParentContextStore';

const NHAN_HOC_TAP: Record<string, string> = {
  HOAN_THANH_TOT: 'Hoàn thành Tốt',
  HOAN_THANH: 'Hoàn thành',
  CHUA_HOAN_THANH: 'Chưa hoàn thành',
};
const NHAN_REN_LUYEN: Record<string, string> = { TOT: 'Tốt', DAT: 'Đạt', CAN_CO_GANG: 'Cần cố gắng' };
const NHAN_QUYET_DINH: Record<string, string> = { LEN_LOP: 'Lên lớp', O_LAI: 'Ở lại', CHUYEN_CUP: 'Chuyển cấp' };

export default function ParentGrades() {
  const [grades, setGrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState<any[]>([]);
  const [ketQuaCuoiNam, setKetQuaCuoiNam] = useState<any[]>([]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const selectedChild = useParentContextStore((state) => state.selectedChild);
  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedChild) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const fetchGrades = async () => {
      try {
        const data = await parentService.getGrades(selectedChild.id);
        setGrades(data);
      } catch (err) {
        console.error('Failed to fetch grades', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrades();
  }, [selectedChild]);

  useEffect(() => {
    if (!selectedChild) return;
    parentService
      .getRewards(selectedChild.id)
      .then((data) => setBadges((data.huyHieu ?? []).filter((b: any) => b.daMoKhoa)))
      .catch((err) => console.error('Failed to fetch rewards', err));
  }, [selectedChild]);

  useEffect(() => {
    if (!selectedChild) return;
    parentService
      .getKetQuaCuoiNam(selectedChild.id)
      .then(setKetQuaCuoiNam)
      .catch((err) => console.error('Failed to fetch ket qua cuoi nam', err));
  }, [selectedChild]);

  const handleExportPdf = async () => {
    if (!printableRef.current) return;
    setIsExportingPdf(true);
    try {
      // Render qua canvas (font trình duyệt thật) rồi nhúng thành ảnh vào PDF —
      // bộ render text gốc của jsPDF không hỗ trợ đúng dấu tiếng Việt.
      const canvas = await html2canvas(printableRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth() - 48; // trừ lề 24pt mỗi bên
      const pageHeight = doc.internal.pageSize.getHeight() - 48;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 24;
      doc.addImage(imgData, 'PNG', 24, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight - 24;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 24, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save(`bao-cao-diem-${selectedChild?.name ?? 'hoc-sinh'}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Sổ đánh giá & Thành tích</h1>
        <Button variant="outline" onClick={handleExportPdf} isLoading={isExportingPdf} disabled={grades.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả đánh giá thường xuyên</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Môn học</TableHead>
                    <TableHead>Bài tập</TableHead>
                    <TableHead>Hình thức</TableHead>
                    <TableHead>Ngày nộp</TableHead>
                    <TableHead className="text-right">Đánh giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.length > 0 ? grades.map(grade => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium text-pro-primary">{grade.studentName}</TableCell>
                      <TableCell className="font-medium text-slate-800">{grade.subject}</TableCell>
                      <TableCell>{grade.assignment}</TableCell>
                      <TableCell>
                        <Badge variant={grade.type === 'H5P' ? 'default' : 'outline'}>{grade.type}</Badge>
                      </TableCell>
                      <TableCell>{grade.date}</TableCell>
                      <TableCell className="text-right">
                        {grade.score ? (
                          <Badge variant="success">{grade.score}</Badge>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-slate-500">Chưa có dữ liệu đánh giá nào.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-pro-warning" />
                Huy hiệu gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedChild ? (
                <p className="text-sm text-slate-400 italic text-center py-4">
                  Vui lòng chọn hồ sơ con để xem huy hiệu.
                </p>
              ) : badges.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-4">
                  {selectedChild.name} chưa có huy hiệu nào.
                </p>
              ) : (
                <div className="space-y-4">
                  {badges.slice(0, 5).map((b) => (
                    <div key={b.id} className="flex items-center p-3 border border-slate-100 rounded-lg">
                      <div className="h-12 w-12 bg-pro-warning/10 rounded-full flex items-center justify-center text-pro-warning mr-4 shrink-0">
                        {b.icon ? <img src={b.icon} alt={b.ten} className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800 text-sm">{b.ten}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{b.moTa}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {ketQuaCuoiNam.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-pro-primary" />
                  Kết quả cuối năm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ketQuaCuoiNam.map((k) => (
                  <div key={k.ketQuaId} className="p-3 border border-slate-100 rounded-lg space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800">Năm học {k.namHoc} — Lớp {k.tenLop}</span>
                      <Badge variant={k.quyetDinh === 'LEN_LOP' ? 'success' : k.quyetDinh === 'O_LAI' ? 'danger' : 'outline'}>
                        {NHAN_QUYET_DINH[k.quyetDinh] ?? k.quyetDinh}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">Học tập: <span className="font-medium text-slate-700">{NHAN_HOC_TAP[k.ketQuaHocTap] ?? k.ketQuaHocTap}</span></p>
                    <p className="text-xs text-slate-500">Rèn luyện: <span className="font-medium text-slate-700">{NHAN_REN_LUYEN[k.ketQuaRenLuyen] ?? k.ketQuaRenLuyen}</span></p>
                    {k.duocXetDacCach && <p className="text-xs text-amber-600 italic">Được xét đặc cách{k.lyDoDacCach ? `: ${k.lyDoDacCach}` : ''}</p>}
                    <p className="text-xs text-slate-400">GVCN xét: {k.tenGiaoVienXet} • {k.ngayXet}</p>
                    {k.ghiChu && <p className="text-xs text-slate-500 italic">Ghi chú: {k.ghiChu}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mẫu ẩn dùng để xuất PDF — style inline để tránh phụ thuộc Tailwind khi render qua html2canvas */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
        <div ref={printableRef} style={{ width: '800px', padding: '24px', fontFamily: 'Arial, sans-serif', color: '#1e293b' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Sổ đánh giá & Thành tích</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Học sinh: {selectedChild?.name ?? ''} • Ngày xuất: {new Date().toLocaleDateString('vi-VN')}
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                {['Học sinh', 'Môn học', 'Bài tập', 'Hình thức', 'Ngày nộp', 'Đánh giá'].map((h) => (
                  <th key={h} style={{ border: '1px solid #cbd5e1', padding: '6px 8px', background: '#f1f5f9', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{grade.studentName}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{grade.subject}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{grade.assignment}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{grade.type}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{grade.date}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{grade.score ?? 'Chưa có'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
