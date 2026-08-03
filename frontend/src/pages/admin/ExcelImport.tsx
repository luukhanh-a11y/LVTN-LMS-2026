import { Upload, FileType, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { useExcelImport } from './hooks/useExcelImport';

export default function ExcelImport() {
  const {
    previewData, isUploading, uploadResult, fileInputRef, hasErrors,
    handleFileSelect, handleUpload, triggerFileInput,
  } = useExcelImport();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nhập danh sách Học sinh & Phụ huynh</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-10 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={triggerFileInput}
          >
            <FileType className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">Tải file Excel (.xlsx) lên đây</h3>
            <p className="text-sm text-slate-500 mb-4">
              Mẫu file gồm 7 cột: Lớp, Mã HS, Tên HS, Ngày sinh, Tên PH, SĐT PH, Email PH
            </p>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
              <Upload className="w-4 h-4 mr-2" /> Chọn file
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewData.length > 0 && !uploadResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bản xem trước ({previewData.length} dòng)</CardTitle>
            <Button onClick={handleUpload} disabled={isUploading || hasErrors}>
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Tiến hành Import
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Mã HS</TableHead>
                  <TableHead>Tên Học sinh</TableHead>
                  <TableHead>Phụ huynh</TableHead>
                  <TableHead>SĐT PH</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 10).map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.className}</TableCell>
                    <TableCell className="font-medium">{row.studentCode}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>{row.parentName}</TableCell>
                    <TableCell>{row.parentPhone}</TableCell>
                    <TableCell>
                      {row.isValid ? (
                        <CheckCircle className="w-5 h-5 text-pro-success" />
                      ) : (
                        <div className="flex items-center text-pro-destructive" title={row.errors.join(', ')}>
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
              <StatBox label="Tổng số dòng" value={uploadResult.totalRows} color="bg-slate-50" textColor="text-slate-800" />
              <StatBox label="Thành công" value={uploadResult.successCount} color="bg-pro-success/10" textColor="text-pro-success" labelColor="text-pro-success" />
              <StatBox label="Thất bại" value={uploadResult.failureCount} color="bg-pro-destructive/10" textColor="text-pro-destructive" labelColor="text-pro-destructive" />
            </div>

            {uploadResult.failures?.length > 0 && (
              <div>
                <h4 className="font-medium text-pro-destructive mb-2">Chi tiết lỗi:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dòng</TableHead>
                      <TableHead>Mã HS</TableHead>
                      <TableHead>Họ Tên</TableHead>
                      <TableHead>Lý do lỗi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadResult.failures.map((f: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>#{f.rowNumber}</TableCell>
                        <TableCell>{f.studentCode}</TableCell>
                        <TableCell>{f.studentName}</TableCell>
                        <TableCell className="text-pro-destructive">{f.errorMsg}</TableCell>
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
