import { useEffect, useState } from 'react';
import { GraduationCap, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { teacherService } from '../../services/teacher.service';
import type { ClassRoom } from '../../services/teacher.service';
import { KetQuaCuoiNamModal } from './components/KetQuaCuoiNamModal';

const NHAN_HOC_TAP: Record<string, string> = {
  HOAN_THANH_TOT: 'Hoàn thành Tốt',
  HOAN_THANH: 'Hoàn thành',
  CHUA_HOAN_THANH: 'Chưa hoàn thành',
};

const NHAN_QUYET_DINH: Record<string, string> = {
  LEN_LOP: 'Lên lớp',
  O_LAI: 'Ở lại',
  CHUYEN_CUP: 'Chuyển cấp',
};

export default function TeacherKetQuaCuoiNam() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    teacherService.getClasses()
      .then((data) => {
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0].id);
        else setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const fetchStudents = () => {
    if (!selectedClassId) return;
    setIsLoading(true);
    teacherService.getDanhSachXetLopHoc(selectedClassId as number)
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId]);

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center">
        <GraduationCap className="w-6 h-6 mr-2 text-pro-primary" />
        Xét kết quả cuối năm
      </h1>

      <Card>
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50 items-center">
          <div className="font-semibold text-slate-700 mr-2">Lớp:</div>
          <select
            className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : '')}
          >
            {classes.length === 0 && <option value="">Không có lớp nào</option>}
            {classes.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Học sinh</TableHead>
                  <TableHead className="text-center">Gợi ý học tập</TableHead>
                  <TableHead className="text-center">Kết quả học tập</TableHead>
                  <TableHead className="text-center">Rèn luyện</TableHead>
                  <TableHead className="text-center">Quyết định</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">Lớp chưa có học sinh nào.</TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => (
                    <TableRow key={s.hocSinhId}>
                      <TableCell className="font-medium text-slate-800">{s.hoTen} <span className="text-xs text-slate-400">({s.maHocSinh})</span></TableCell>
                      <TableCell className="text-center text-xs text-slate-400 italic">
                        {s.goiYKetQuaHocTap ? NHAN_HOC_TAP[s.goiYKetQuaHocTap] : 'Chưa có dữ liệu'}
                      </TableCell>
                      <TableCell className="text-center">{s.ketQuaHocTap ? NHAN_HOC_TAP[s.ketQuaHocTap] : '—'}</TableCell>
                      <TableCell className="text-center">{s.ketQuaRenLuyen ?? '—'}</TableCell>
                      <TableCell className="text-center">{s.quyetDinh ? NHAN_QUYET_DINH[s.quyetDinh] : '—'}</TableCell>
                      <TableCell className="text-center">
                        {s.daXet ? (
                          <Badge variant="success"><CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />Đã xét</Badge>
                        ) : (
                          <Badge variant="outline">Chưa xét</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" variant="outline" onClick={() => setSelectedStudent(s)}>
                          {s.daXet ? 'Sửa kết quả' : 'Xét kết quả'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedStudent && selectedClassId && (
        <KetQuaCuoiNamModal
          classId={selectedClassId as number}
          studentId={selectedStudent.hocSinhId}
          studentName={selectedStudent.hoTen}
          goiYKetQuaHocTap={selectedStudent.goiYKetQuaHocTap}
          existing={selectedStudent.daXet ? {
            ketQuaHocTap: selectedStudent.ketQuaHocTap,
            ketQuaRenLuyen: selectedStudent.ketQuaRenLuyen,
            quyetDinh: selectedStudent.quyetDinh,
            duocXetDacCach: selectedStudent.duocXetDacCach,
            lyDoDacCach: selectedStudent.lyDoDacCach,
            ghiChu: selectedStudent.ghiChu,
          } : undefined}
          onClose={() => setSelectedStudent(null)}
          onSaved={fetchStudents}
        />
      )}
    </div>
  );
}
