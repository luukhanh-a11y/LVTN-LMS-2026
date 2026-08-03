import { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { teacherService } from '../../services/teacher.service';
import type { ClassRoom, Submission, Assignment } from '../../services/teacher.service';
import { GradedDetailsModal } from './components/GradedDetailsModal';
import { useGradingSystem } from './hooks/useGradingSystem';

export default function TeacherGrading() {
  const navigate = useNavigate();
  const { viewGradedDetails, handleViewDetails, closeDetails } = useGradingSystem();
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);

  const openGradedDetails = async (submissionId: number) => {
    setLoadingDetailId(submissionId);
    try {
      const detail = await teacherService.getSubmissionDetail(submissionId);
      handleViewDetails(detail);
    } catch {
      // silent — modal chỉ đơn giản không mở nếu lỗi
    } finally {
      setLoadingDetailId(null);
    }
  };

  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Bước 1: Lấy danh sách lớp
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await teacherService.getClasses();
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0].id);
      } catch (err) {
        console.error('Lỗi tải danh sách lớp', err);
      } finally {
        setIsLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  // Bước 2: Khi chọn lớp, lấy danh sách bài tập
  useEffect(() => {
    if (!selectedClassId) return;
    const fetchAssignments = async () => {
      try {
        const data = await teacherService.getAssignmentsByClass(selectedClassId);
        setAssignments(data);
        setSelectedAssignmentId(data.length > 0 ? data[0].baiTapId : null);
        setSubmissions([]);
      } catch (err) {
        console.error('Lỗi tải bài tập', err);
      }
    };
    fetchAssignments();
  }, [selectedClassId]);

  // Bước 3: Khi chọn bài tập, lấy danh sách bài nộp
  useEffect(() => {
    if (!selectedAssignmentId) return;
    const fetchSubmissions = async () => {
      setIsLoadingSubmissions(true);
      try {
        const data = await teacherService.getSubmissions(selectedAssignmentId);
        setSubmissions(data);
      } catch (err) {
        console.error('Lỗi tải bài nộp', err);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };
    fetchSubmissions();
  }, [selectedAssignmentId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Chấm bài & Phản hồi</h1>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Tìm kiếm học sinh..." />
          </div>
          <div className="flex items-center space-x-2">
            {isLoadingClasses ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <select
                aria-label="Chọn lớp học"
                className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary font-bold text-pro-primary bg-pro-bg"
                value={selectedClassId ?? ''}
                onChange={(e) => setSelectedClassId(Number(e.target.value))}
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            )}
            <Filter className="h-4 w-4 text-slate-400 ml-2" />
            <select
              aria-label="Chọn bài tập"
              className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
              value={selectedAssignmentId ?? ''}
              onChange={(e) => setSelectedAssignmentId(Number(e.target.value))}
            >
              {assignments.length === 0 ? (
                <option value="">-- Chưa có bài tập --</option>
              ) : (
                assignments.map((asgn) => (
                  <option key={asgn.baiTapId} value={asgn.baiTapId}>{asgn.tieuDe}</option>
                ))
              )}
            </select>
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Bài nộp</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Thời gian nộp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingSubmissions ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Đang tải bài nộp...
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    Chưa có học sinh nộp bài cho bài tập này.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow key={sub.baiNopId}>
                    <TableCell className="font-medium">#{sub.baiNopId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.diemTuDong !== null ? 'H5P Auto' : 'Tự luận'}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {sub.thoiDiemNop ? new Date(sub.thoiDiemNop).toLocaleString('vi-VN') : '—'}
                    </TableCell>
                    <TableCell>
                      {sub.trangThai === 'DA_NOP' && (
                        <Badge variant={sub.laNopTre ? 'danger' : 'warning'}>
                          {sub.laNopTre ? 'Nộp trễ' : 'Chờ chấm'}
                        </Badge>
                      )}
                      {sub.trangThai === 'DA_CHAM' && <Badge variant="success">Đã chấm</Badge>}
                      {sub.trangThai === 'YC_LAM_LAI' && <Badge variant="danger">Làm lại</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {sub.trangThai === 'DA_CHAM' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          isLoading={loadingDetailId === sub.baiNopId}
                          onClick={() => openGradedDetails(sub.baiNopId)}
                        >
                          Xem chi tiết
                        </Button>
                      ) : sub.diemTuDong !== null ? (
                        <Button variant="ghost" size="sm">Xem tiến độ</Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/grading/${sub.baiNopId}`)}>
                          Chấm bài
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <GradedDetailsModal submission={viewGradedDetails} onClose={closeDetails} />
    </div>
  );
}
