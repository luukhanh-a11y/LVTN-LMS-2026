import { useState, useEffect } from 'react';
import { GraduationCap, Award, FileText, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useParentContextStore } from '../../stores/useParentContextStore';
import { parentService } from '../../services/parent.service';
import toast from 'react-hot-toast';

export default function ParentGrades() {
  const { selectedChild } = useParentContextStore();
  const [gradeData, setGradeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChild?.id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const dtb = await parentService.getDiemTrungBinhMon(selectedChild.id, 1);
          const kq = await parentService.getKetQuaCuoiNam(selectedChild.id);
          
          setGradeData({
            semester: 'Học kỳ 1',
            subjects: dtb.map((d: any) => ({
              id: d.monHocId,
              name: d.tenMon,
              scoreHomework: d.diem || 0,
              scoreSelfStudy: d.diem || 0,
              finalScore: d.diem || 0
            })),
            finalResult: kq ? {
              academic: kq.ketQuaHocTap || 'Chưa xét',
              conduct: kq.ketQuaRenLuyen || 'Chưa xét',
              decision: kq.quyetDinh === 'LEN_LOP' ? 'LÊN LỚP' : (kq.quyetDinh === 'O_LAI' ? 'Ở LẠI' : 'Chưa quyết định'),
              teacher: kq.nguoiDanhGiaTieuDe || 'Giáo viên',
              note: kq.ghiChu || 'Không có nhận xét'
            } : null
          });
        } catch (error) {
          console.error(error);
          setGradeData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedChild?.id]);

  const activeChild = selectedChild || { name: 'Học sinh' };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bảng Điểm</h2>
          <p className="text-sm text-slate-500 mt-1">
            Xem điểm trung bình môn và kết quả tổng kết năm học của <strong className="text-slate-700">{activeChild.name}</strong>.
          </p>
        </div>
      </div>

      {!gradeData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-white border border-slate-200 border-dashed rounded-2xl p-12">
          <FileText className="w-16 h-16 text-slate-200 mb-4" />
          <p className="font-bold text-lg text-slate-700">Chưa có dữ liệu bảng điểm</p>
          <p className="text-sm mt-1">Học sinh chưa có điểm tổng kết cho học kỳ này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* CHI TIẾT BẢNG ĐIỂM */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2 text-blue-700 font-bold">
                  <GraduationCap className="w-5 h-5" />
                  <span>Điểm Trung Bình Các Môn</span>
                </div>
                <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700">
                  {gradeData.semester}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm">
                      <th className="p-4 font-bold border-b border-slate-100">Môn Học</th>
                      <th className="p-4 font-bold border-b border-slate-100 text-center">ĐTB Bài Tập</th>
                      <th className="p-4 font-bold border-b border-slate-100 text-center">ĐTB Tự Học</th>
                      <th className="p-4 font-bold border-b border-slate-100 text-center text-blue-700">ĐTB Môn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeData.subjects.map((subject, idx) => (
                      <tr key={subject.id} className="hover:bg-blue-50/30 transition border-b border-slate-50 last:border-0">
                        <td className="p-4">
                          <span className="font-bold text-slate-800">{subject.name}</span>
                        </td>
                        <td className="p-4 text-center text-slate-600 font-medium">
                          {subject.scoreHomework.toFixed(1)}
                        </td>
                        <td className="p-4 text-center text-slate-600 font-medium">
                          {subject.scoreSelfStudy.toFixed(1)}
                        </td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            "inline-block px-2.5 py-1 rounded-lg font-bold min-w-[3rem]",
                            subject.finalScore >= 8.0 ? "bg-emerald-100 text-emerald-700" :
                            subject.finalScore >= 5.0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                          )}>
                            {subject.finalScore.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* KẾT QUẢ TỔNG KẾT */}
          <div className="space-y-6">
            <div className="bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-blue-100 bg-blue-50 flex items-center gap-2 text-blue-800 font-bold">
                <Award className="w-5 h-5" />
                <span>Kết Quả Tổng Kết</span>
              </div>
              
              <div className="p-6 space-y-5">
                {gradeData.finalResult ? (
                  <>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Học lực:</span>
                      <span className={cn(
                        "font-black text-lg",
                        gradeData.finalResult.academic === 'TỐT' || gradeData.finalResult.academic === 'GIỎI' ? "text-emerald-600" : "text-blue-600"
                      )}>
                        {gradeData.finalResult.academic}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Hạnh kiểm:</span>
                      <span className="font-black text-lg text-emerald-600">
                        {gradeData.finalResult.conduct}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Quyết định:</span>
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5",
                        gradeData.finalResult.decision === 'LÊN LỚP' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                      )}>
                        {gradeData.finalResult.decision === 'LÊN LỚP' && <CheckCircle className="w-4 h-4" />}
                        {gradeData.finalResult.decision}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block mb-2">Nhận xét của GVCN ({gradeData.finalResult.teacher}):</span>
                      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 italic border border-slate-100 relative">
                        <span className="absolute -top-2 left-4 text-2xl text-slate-300">"</span>
                        {gradeData.finalResult.note}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    Chưa có kết quả xét duyệt cuối năm.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
