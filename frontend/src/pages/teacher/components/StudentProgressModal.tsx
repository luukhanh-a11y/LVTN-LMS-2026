import { memo, useEffect, useState } from 'react';
import { Activity, X, Loader2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { teacherService } from '../../../services/teacher.service';

interface Props {
  studentId: number;
  studentName: string;
  onClose: () => void;
}

export const StudentProgressModal = memo(function StudentProgressModal({ studentId, studentName, onClose }: Props) {
  const [data, setData] = useState<any>(null);
  const [diemTB, setDiemTB] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      teacherService.getStudentProgress(studentId).then(setData).catch(() => null),
      teacherService.getDiemTrungBinhMon(studentId, 1).then(setDiemTB).catch(() => setDiemTB([]))
    ]).finally(() => setIsLoading(false));
  }, [studentId]);

  const subjectProgress = data?.subjectProgress ?? [];
  const recentSubmissions = data?.recentSubmissions ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-[600px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-pro-primary/10">
          <h3 className="font-bold text-pro-fg flex items-center">
            <Activity className="w-5 h-5 mr-2 text-pro-primary" /> Báo cáo Tiến độ Học tập
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pro-primary/10 rounded-full flex items-center justify-center text-pro-primary font-bold text-xl">
                {studentName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{studentName}</h3>
                <p className="text-sm text-slate-500">
                  {data?.studentCode ? `Mã: ${data.studentCode}` : ''}{data?.className ? ` • Lớp ${data.className}` : ''}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-700 text-sm mb-3">Tỷ lệ hoàn thành Sơ đồ Bài giảng H5P</h4>
              {subjectProgress.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Chưa có dữ liệu tiến độ.</p>
              ) : (
                <div className="space-y-4">
                  {subjectProgress.map((sp: any) => (
                    <div key={sp.subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 font-medium">{sp.subject}</span>
                        <span className={`font-bold ${sp.percent === 100 ? 'text-pro-success' : 'text-pro-primary'}`}>
                          {sp.percent}% (Bài {sp.completed}/{sp.total})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                          className={`${sp.percent === 100 ? 'bg-pro-success' : 'bg-pro-primary'} h-2.5 rounded-full`}
                          style={{ width: `${sp.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-700 text-sm mb-2">Điểm trung bình các môn học (Học kỳ 1)</h4>
              {diemTB.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Chưa có dữ liệu điểm trung bình môn.</p>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-700 border-b">
                      <tr>
                        <th className="py-2 px-3 text-left font-semibold">Môn học</th>
                        <th className="py-2 px-3 text-center font-semibold">TB Bài tập</th>
                        <th className="py-2 px-3 text-center font-semibold">TB Tự học</th>
                        <th className="py-2 px-3 text-center font-bold text-primary">TB Chung</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {diemTB.map((dtb: any) => (
                        <tr key={dtb.monHocId || dtb.tenMon} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-medium text-slate-800">{dtb.tenMon || `Môn #${dtb.monHocId}`}</td>
                          <td className="py-2 px-3 text-center text-slate-600">{dtb.diemTrungBinhBaiTap ? dtb.diemTrungBinhBaiTap.toFixed(1) : '—'}</td>
                          <td className="py-2 px-3 text-center text-slate-600">{dtb.diemTrungBinhTuHoc ? dtb.diemTrungBinhTuHoc.toFixed(1) : '—'}</td>
                          <td className="py-2 px-3 text-center font-bold text-primary">{dtb.diemTrungBinhChung ? dtb.diemTrungBinhChung.toFixed(1) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-700 text-sm mb-3">Lịch sử Nộp bài gần đây</h4>
              {recentSubmissions.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Chưa có bài nộp nào.</p>
              ) : (
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {recentSubmissions.map((sub: any, idx: number) => (
                    <div key={idx} className={`p-3 flex items-center justify-between hover:bg-slate-50 ${sub.late ? 'bg-red-50/50' : ''}`}>
                      <div className="flex items-center">
                        <Badge variant={sub.late ? 'danger' : 'success'} className="mr-3 w-20 justify-center">
                          {sub.late ? 'Nộp trễ' : 'Đúng hạn'}
                        </Badge>
                        <span className="text-sm font-medium text-slate-700">{sub.title}</span>
                      </div>
                      <span className={`text-xs ${sub.late ? 'text-red-500 font-medium' : 'text-slate-500'}`}>{sub.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 text-center">
              <Button variant="outline" className="w-full text-pro-primary border-pro-primary/30 hover:bg-pro-primary/10" onClick={onClose}>
                Đóng báo cáo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
