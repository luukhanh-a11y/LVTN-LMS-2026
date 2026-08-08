import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, KeySquare, Award, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import toast from 'react-hot-toast';

import { classService } from '../../services/class.service';
import { ticketService } from '../../services/ticket.service';
import { teacherService } from '../../services/teacher.service';

const NHAN_GIOI_TINH: Record<string, string> = {
  NAM: 'Nam',
  NU: 'Nữ',
  KHAC: 'Khác',
};

export default function TeacherClassDetails() {
  const { classId } = useParams();
  const [resetStudent, setResetStudent] = useState<any>(null);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketDescription, setTicketDescription] = useState('Phụ huynh báo quên mật khẩu, nhờ Admin cấp lại mật khẩu mặc định.');

  const fetchData = async () => {
    if (!classId) return;
    setIsLoading(true);
    try {
      // Chỉ lấy các lớp giáo viên được phân công trong học kỳ hiện tại — đồng bộ với "Lớp học của tôi".
      const classes = await teacherService.getClasses();
      const currentClass = classes.find((c) => c.id === Number(classId));
      if (currentClass) {
        const studentsData = await classService.getStudentsByClass(Number(classId));
        setClassInfo({
          tenLop: currentClass.name,
          studentsCount: studentsData.length,
          role: currentClass.role || 'Chưa phân công'
        });
        setStudents(studentsData);
      } else {
        setClassInfo(null);
        setStudents([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classId]);

  const handleSendTicket = async () => {
    if (!resetStudent) return;
    setIsSubmitting(true);
    try {
      await ticketService.createTicket(
        resetStudent.id,
        'RESET_MAT_KHAU',
        ticketDescription
      );
      toast.success('Gửi yêu cầu cấp lại mật khẩu thành công!');
      setResetStudent(null);
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-slate-500">Đang tải dữ liệu lớp học...</div>;
  }

  if (!classInfo) {
    return <div className="text-center py-8 text-slate-500">Không tìm thấy thông tin lớp học.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/teacher/classes">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
            <ChevronLeft className="w-5 h-5 mr-1" /> Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Chi tiết Lớp {classInfo.tenLop}</h1>
          <p className="text-sm text-slate-500">Sĩ số: {classInfo.studentsCount} Học sinh | Vai trò: {classInfo.role}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HS</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>XP</TableHead>
                <TableHead className="text-right">Hỗ trợ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Lớp học chưa có học sinh nào.</TableCell>
                </TableRow>
              ) : students.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-slate-500">{student.maHocSinh}</TableCell>
                  <TableCell className="font-bold text-slate-800">{student.fullName}</TableCell>
                  <TableCell className="text-sm">{student.ngaySinh || '—'}</TableCell>
                  <TableCell className="text-sm">{student.gioiTinh ? NHAN_GIOI_TINH[student.gioiTinh] ?? student.gioiTinh : '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      <Award className="w-4 h-4 mr-1" /> {student.tongXp} XP
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="text-pro-warning border-pro-warning/30 hover:bg-pro-warning/10" onClick={() => setResetStudent(student)}>
                      <KeySquare className="w-4 h-4 mr-1" /> Cấp lại MK
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Yêu Cầu Cấp Lại Mật Khẩu */}
      {resetStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-pro-warning/10">
              <h3 className="font-bold text-pro-warning">Yêu cầu cấp lại Mật khẩu</h3>
              <button onClick={() => setResetStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Học sinh:</p>
                <p className="font-bold text-slate-800">{resetStudent.fullName} ({resetStudent.maHocSinh})</p>
                <p className="text-xs text-slate-500 mt-1">Lớp {classInfo.tenLop}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Lý do (Sẽ gửi cho Admin)</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm h-24 resize-none"
                  placeholder="VD: Phụ huynh báo quên mật khẩu..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-2">
                <Button variant="outline" onClick={() => setResetStudent(null)}>Hủy bỏ</Button>
                <Button className="bg-pro-warning hover:brightness-95" isLoading={isSubmitting} onClick={handleSendTicket}>Gửi Ticket</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
