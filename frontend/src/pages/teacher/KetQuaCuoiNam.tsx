import { useEffect, useState } from 'react';
import { GraduationCap, Loader2, CheckCircle2, Lock, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { teacherService } from '../../services/teacher.service';
import type { ClassRoom } from '../../services/teacher.service';
import { academicService, type CauHinhHeThong } from '../../services/academic.service';
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
  const [cauHinh, setCauHinh] = useState<CauHinhHeThong | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<{ giaoVienId: number } | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const isLocked = !cauHinh?.danhGiaCuoiNamDangMo;
  const namHocDanhGia = cauHinh?.namHocDanhGia ?? cauHinh?.tenNamHocHienTai ?? '';

  useEffect(() => {
    Promise.all([
      teacherService.getClasses(),
      teacherService.getMyTeacherProfile(),
      academicService.getCauHinhHeThong(),
    ])
      .then(([classData, profile, cauHinhData]) => {
        setClasses(classData);
        setTeacherProfile(profile);
        setCauHinh(cauHinhData);
        if (classData.length > 0) setSelectedClassId(classData[0].id);
        else setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const fetchStudents = async () => {
    if (isLocked || !selectedClassId || !namHocDanhGia) {
      setStudents([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const hocSinhs = await teacherService.getHocSinhByLop(selectedClassId as number);
      const enriched = await Promise.all(
        hocSinhs.map(async (hs) => {
          try {
            const ketQua = await teacherService.getKetQuaCuoiNam(hs.hocSinhId, namHocDanhGia);
            return { ...hs, ketQua, daXet: true };
          } catch {
            return { ...hs, ketQua: null, daXet: false };
          }
        })
      );
      setStudents(enriched);
    } catch {
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, namHocDanhGia]);

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <GraduationCap className="w-6 h-6 mr-2 text-pro-primary" />
          Xét kết quả cuối năm
        </h1>
        {isLocked ? (
          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 px-3 py-1.5 text-sm">
            <Lock className="w-4 h-4 mr-1.5 inline" />
            Chưa có đợt đánh giá nào đang mở
          </Badge>
        ) : (
          <Badge variant="success" className="px-3 py-1.5 text-sm">
            Đang mở đợt đánh giá {namHocDanhGia}
          </Badge>
        )}
      </div>

      {isLocked ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center text-center text-slate-500">
            <Lock className="w-10 h-10 mb-3 text-slate-300" />
            <p className="font-medium text-slate-600">Chưa có đợt đánh giá cuối năm nào đang mở.</p>
            <p className="text-sm mt-1">Vui lòng chờ Admin mở đợt đánh giá trong Học vụ.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50 items-center">
            <div className="flex items-center gap-4">
              <div className="font-semibold text-slate-700">Lớp:</div>
              <select
                className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : '')}
              >
                {classes.length === 0 && <option value="">Không có lớp nào</option>}
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
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
                    <TableHead className="text-center">Kết quả học tập</TableHead>
                    <TableHead className="text-center">Rèn luyện</TableHead>
                    <TableHead className="text-center">Quyết định (đề xuất)</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">Lớp chưa có học sinh nào.</TableCell>
                    </TableRow>
                  ) : (
                    students.map((s) => (
                      <TableRow key={s.hocSinhId}>
                        <TableCell className="font-medium text-slate-800">{s.hoTen} <span className="text-xs text-slate-400">({s.maHocSinh})</span></TableCell>
                        <TableCell className="text-center font-medium">{s.ketQua?.ketQuaHocTap ? NHAN_HOC_TAP[s.ketQua.ketQuaHocTap] : '—'}</TableCell>
                        <TableCell className="text-center">{s.ketQua?.ketQuaRenLuyen ?? '—'}</TableCell>
                        <TableCell className="text-center">
                          {s.ketQua?.quyetDinh ? (
                            <Badge variant={s.ketQua.quyetDinh === 'LEN_LOP' ? 'success' : 'outline'}>
                              {NHAN_QUYET_DINH[s.ketQua.quyetDinh]}
                            </Badge>
                          ) : '—'}
                        </TableCell>
                        <TableCell className="text-center">
                          {!s.daXet ? (
                            <Badge variant="outline">Chưa xét</Badge>
                          ) : s.ketQua?.daDuyet ? (
                            <Badge variant="success"><CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />Đã duyệt & chuyển lớp</Badge>
                          ) : (
                            <Badge variant="warning"><Clock className="w-3.5 h-3.5 mr-1 inline" />Chờ Admin duyệt</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedStudent(s)}
                            disabled={s.daXet && s.ketQua?.daDuyet}
                          >
                            {s.daXet ? 'Sửa đề xuất' : 'Đề xuất kết quả'}
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
      )}

      {selectedStudent && selectedClassId && teacherProfile && !isLocked && (
        <KetQuaCuoiNamModal
          classId={selectedClassId as number}
          studentId={selectedStudent.hocSinhId}
          studentName={selectedStudent.hoTen}
          giaoVienId={teacherProfile.giaoVienId}
          namHoc={namHocDanhGia}
          ketQuaId={selectedStudent.ketQua?.ketQuaId}
          existing={selectedStudent.daXet ? {
            ketQuaHocTap: selectedStudent.ketQua.ketQuaHocTap,
            ketQuaRenLuyen: selectedStudent.ketQua.ketQuaRenLuyen,
            quyetDinh: selectedStudent.ketQua.quyetDinh,
            duocXetDacCach: selectedStudent.ketQua.duocXetDacCach,
            lyDoDacCach: selectedStudent.ketQua.lyDoDacCach,
            ghiChu: selectedStudent.ketQua.ghiChu,
          } : undefined}
          onClose={() => setSelectedStudent(null)}
          onSaved={fetchStudents}
        />
      )}
    </div>
  );
}
