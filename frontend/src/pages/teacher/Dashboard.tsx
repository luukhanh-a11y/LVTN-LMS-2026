import { useEffect, useState } from 'react';
import { BookOpen, Clock, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { teacherService } from '../../services/teacher.service';

export default function TeacherDashboard() {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiReportError, setAiReportError] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);

  useEffect(() => {
    teacherService
      .getMorningReport()
      .then((data) => setAiReport(data.summary))
      .catch((err) => setAiReportError(err?.response?.data?.message || 'Không tải được báo cáo AI buổi sáng.'))
      .finally(() => setIsLoadingReport(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Bảng tin Lớp học</h1>

      {/* AI Morning Report */}
      <div className="bg-pro-primary/10 p-6 rounded-xl border border-pro-primary/20 flex items-start">
        <div className="p-3 bg-pro-primary/20 rounded-lg mr-4 shrink-0">
          <Sparkles className="h-6 w-6 text-pro-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-pro-fg mb-2">Báo cáo AI buổi sáng</h3>
          {isLoadingReport ? (
            <div className="flex items-center gap-2 text-pro-fg/70">
              <Loader2 className="h-4 w-4 animate-spin" /> Đang tạo báo cáo...
            </div>
          ) : aiReportError ? (
            <p className="text-red-600 text-sm">{aiReportError}</p>
          ) : (
            <p className="text-pro-fg leading-relaxed">{aiReport}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Bài chờ chấm</h3>
              <Badge variant="danger">12 bài</Badge>
            </div>
            <p className="text-sm text-slate-500 mb-4">Bài tập tự luận "Văn miêu tả"</p>
            <Button variant="pro-primary" className="w-full">Chấm ngay</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Bài tập đang mở</h3>
              <Clock className="h-5 w-5 text-pro-warning" />
            </div>
            <p className="text-sm text-slate-500 mb-4">Quiz H5P "Phân số" (Còn 2 ngày)</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div className="bg-pro-warning h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-slate-500 text-right">24/40 em đã làm</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Học liệu mới tạo</h3>
              <BookOpen className="h-5 w-5 text-pro-success" />
            </div>
            <p className="text-sm text-slate-500 mb-4">Video tương tác "Lịch sử Việt Nam"</p>
            <Button variant="outline" className="w-full">Chỉnh sửa (H5P)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
