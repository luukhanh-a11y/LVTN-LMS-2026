import { useState } from 'react';
import { Upload, FileType, CheckCircle, AlertCircle, Loader2, Download, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { useExcelImport } from '../hooks/useExcelImport';
import { cn } from '../../../lib/utils';
import { adminService } from '../../../services/admin.service';
import toast from 'react-hot-toast';

type ImportTabType = 'student' | 'teacher' | 'parent';

const TABS: { key: ImportTabType; label: string }[] = [
  { key: 'student', label: 'Nhập Học sinh' },
  { key: 'teacher', label: 'Nhập Giáo viên' },
  { key: 'parent', label: 'Nhập Phụ huynh' },
];

interface ExcelImportBoardProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export function ExcelImportBoard({ onBack, onSuccess }: ExcelImportBoardProps) {
  const [activeTab, setActiveTab] = useState<ImportTabType>('student');

  const {
    previewData, isUploading, uploadResult, fileInputRef, hasErrors,
    handleFileSelect, handleUpload, triggerFileInput, resetUpload
  } = useExcelImport(activeTab);

  const handleTabChange = (key: ImportTabType) => {
    setActiveTab(key);
    resetUpload();
  };

  const handleImportClick = async () => {
    await handleUpload();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack} className="mr-4 px-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
              </Button>
              <span>Nhập dữ liệu từ Excel</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adminService.downloadTemplate().catch(() => toast.error('Không tải được file mẫu'))}
            >
              <Download className="w-4 h-4 mr-2" /> Tải file Excel mẫu
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-xl w-fit mb-6">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-bold transition-all',
                  activeTab === key
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-10 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={triggerFileInput}
          >
            <FileType className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">Tải file Excel (.xlsx) lên đây</h3>
            
            <div className="mt-6 w-full border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white cursor-default" onClick={e => e.stopPropagation()}>
              <div className="bg-amber-50 border-b border-slate-200 p-3 text-sm text-amber-800 font-medium">
                Cấu trúc file mẫu bắt buộc cho {activeTab === 'student' ? 'Học sinh' : activeTab === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}:
                <ul className="list-disc pl-5 mt-1 font-normal text-amber-700 space-y-1">
                  <li><strong>Cột A (Vai trò):</strong> Bắt buộc nhập <b>{activeTab === 'student' ? 'HOC_SINH' : activeTab === 'teacher' ? 'GIAO_VIEN' : 'PHU_HUYNH'}</b></li>
                  <li><strong>Cột B (Tên đăng nhập):</strong> Bắt buộc.</li>
                  <li><strong>Cột C (Mật khẩu):</strong> Để trống sẽ lấy mặc định.</li>
                  <li><strong>Cột D (Họ tên):</strong> Bắt buộc.</li>
                  <li><strong>Cột E (Email), Cột F (SĐT):</strong> Tùy chọn.</li>
                  {activeTab === 'student' && <li><strong>Cột G (Giới tính), Cột H (Ngày sinh), Cột I (Mã HS), Cột J (Lớp):</strong> Có thể nhập thêm để tạo hồ sơ tự động.</li>}
                  {activeTab === 'teacher' && <li><strong>Cột G (Giới tính), Cột H (Ngày sinh), Cột I (Mã GV), Cột J (Bộ môn):</strong> Có thể nhập thêm để tạo hồ sơ.</li>}
                  {activeTab === 'parent' && <li><strong>Cột K (Mã con):</strong> Bắt buộc nhập Mã học sinh hoặc Tên đăng nhập của con để liên kết.</li>}
                </ul>
              </div>
            </div>

            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <Button variant="outline" className="mt-6" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
              <Upload className="w-4 h-4 mr-2" /> Chọn file từ máy tính
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewData.length > 0 && !uploadResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bản xem trước ({previewData.length} dòng)</CardTitle>
            <Button onClick={handleImportClick} disabled={isUploading || hasErrors}>
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Tiến hành Import
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Họ Tên</TableHead>
                  {activeTab === 'student' && <TableHead>Mã HS / Lớp</TableHead>}
                  {activeTab === 'teacher' && <TableHead>Mã GV / Bộ môn</TableHead>}
                  {activeTab === 'parent' && <TableHead>Mã con</TableHead>}
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 10).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold text-slate-700">{row.vaiTro}</TableCell>
                    <TableCell className="font-medium text-indigo-600">{row.tenDangNhap}</TableCell>
                    <TableCell>{row.hoTen}</TableCell>
                    {(activeTab === 'student' || activeTab === 'teacher') && (
                      <TableCell>{row.ma} {row.boMonLop && `(${row.boMonLop})`}</TableCell>
                    )}
                    {activeTab === 'parent' && (
                      <TableCell className="font-semibold text-amber-600">{row.maCon}</TableCell>
                    )}
                    <TableCell>
                      {row.isValid ? (
                        <CheckCircle className="w-5 h-5 text-pro-success" />
                      ) : (
                        <div className="flex items-center text-pro-destructive font-medium" title={row.errors.join(' | ')}>
                          <AlertCircle className="w-5 h-5 mr-1" /> Lỗi
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {previewData.length > 10 && (
              <p className="text-center text-sm text-slate-500 mt-4">Hiển thị 10 dòng đầu tiên...</p>
            )}
          </CardContent>
        </Card>
      )}

      {uploadResult && (
        <Card>
          <CardHeader><CardTitle>Kết quả Import</CardTitle></CardHeader>
          <CardContent>
            <div className="flex space-x-6 mb-6">
              <StatBox label="Tổng số dòng" value={uploadResult.totalRows || 0} color="bg-slate-50" textColor="text-slate-800" />
              <StatBox label="Thành công" value={uploadResult.successCount || 0} color="bg-pro-success/10" textColor="text-pro-success" labelColor="text-pro-success" />
              <StatBox label="Thất bại" value={uploadResult.failureCount || 0} color="bg-pro-destructive/10" textColor="text-pro-destructive" labelColor="text-pro-destructive" />
            </div>

            {uploadResult.failures?.length > 0 && (
              <div>
                <h4 className="font-medium text-pro-destructive mb-2">Chi tiết lỗi:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dòng</TableHead>
                      <TableHead>Lý do lỗi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadResult.failures.map((f: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>#{f.rowNumber}</TableCell>
                        <TableCell className="text-pro-destructive font-medium">{f.errorMsg}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatBox({ label, value, color, textColor, labelColor = 'text-slate-500' }: {
  label: string; value: number; color: string; textColor: string; labelColor?: string;
}) {
  return (
    <div className={`${color} p-4 rounded-lg flex-1`}>
      <p className={`text-sm ${labelColor}`}>{label}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
