import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { teacherService } from '../../services/teacher.service';

export default function Gradebook({ embedded = false, classId: propClassId }: { embedded?: boolean, classId?: number }) {
  const { classId: paramClassId } = useParams();
  const classId = propClassId || paramClassId;
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await teacherService.getReports(classId ? Number(classId) : undefined);
        setReportData(data);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải dữ liệu bảng điểm');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [classId]);

  const handleExport = () => {
    toast.success('Đang xuất bảng điểm ra file Excel...');
  };

  const isHomeroom = reportData?.isHomeroomTeacher || reportData?.homeroomTeacher;
  const students = reportData?.students || [];

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter((s: any) => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [students, searchTerm]);

  // Extract all unique assignment columns for Detailed view
  const assignmentColumns = useMemo(() => {
    if (isHomeroom && selectedSubject === 'all') return [];
    const assignmentMap = new Map<number, string>();
    students.forEach((student: any) => {
      student.subjectGrades?.forEach((subject: any) => {
        if (!isHomeroom || subject.subjectName === selectedSubject) {
          subject.assignments?.forEach((assignment: any) => {
            assignmentMap.set(assignment.assignmentId, assignment.title);
          });
        }
      });
    });
    return Array.from(assignmentMap.entries()).map(([id, title]) => ({ id, title }));
  }, [students, isHomeroom, selectedSubject]);

  // Extract all unique subject columns for GVCN view
  const subjectColumns = useMemo(() => {
    if (!isHomeroom) return [];
    const subjectSet = new Set<string>();
    students.forEach((student: any) => {
      student.homeroomGrades?.subjectAverages?.forEach((sa: any) => {
        subjectSet.add(sa.subjectName);
      });
    });
    return Array.from(subjectSet);
  }, [students, isHomeroom]);

  return (
    <div className={embedded ? "flex-1 flex flex-col w-full bg-white" : "max-w-6xl mx-auto space-y-6 flex flex-col min-h-[calc(100vh-8rem)]"}>
      {/* Header */}
      {!embedded && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Bảng điểm {reportData?.className ? `- Lớp ${reportData.className}` : ''}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isHomeroom 
                ? 'Tổng hợp điểm trung bình các môn học (Vai trò: GVCN)'
                : 'Kết quả học tập môn bạn phụ trách (Vai trò: GVBM)'}
            </p>
          </div>
          <button 
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
          </button>
        </div>
      </div>
      )}

      {/* Main Content Area */}
      <div className={embedded ? "flex-1 flex flex-col min-h-0" : "flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden"}>
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm tên học sinh..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            {embedded && (
              <button 
                type="button"
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
              </button>
            )}
            {isHomeroom && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">Môn học:</span>
                <select 
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px] cursor-pointer"
                >
                  <option value="all">Tất cả môn học</option>
                  {subjectColumns.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
              Sĩ số: <strong className="text-slate-900">{filteredStudents.length}</strong>
            </div>
          </div>
        </div>

        {/* Bảng điểm */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white border-b border-slate-200 text-slate-600 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold w-16 text-center">STT</th>
                  <th className="px-6 py-4 font-semibold w-24">Mã HS</th>
                  <th className="px-6 py-4 font-semibold">Họ và tên</th>
                  
                  {isHomeroom && selectedSubject === 'all' ? (
                    <>
                      {/* GVCN Columns - All Subjects */}
                      {subjectColumns.map(sub => (
                        <th key={sub} className="px-6 py-4 font-semibold text-center">{sub}</th>
                      ))}
                      <th className="px-6 py-4 font-semibold text-center bg-blue-50">Trung bình Học kỳ</th>
                      <th className="px-6 py-4 font-semibold text-center bg-indigo-50">Tiến độ chung (%)</th>
                    </>
                  ) : (
                    <>
                      {/* GVBM Columns */}
                      {assignmentColumns.map(col => (
                        <th key={col.id} className="px-6 py-4 font-semibold text-center truncate max-w-[120px]" title={col.title}>
                          {col.title}
                        </th>
                      ))}
                      <th className="px-6 py-4 font-semibold text-center bg-slate-50">TB Bài tập</th>
                      <th className="px-6 py-4 font-semibold text-center bg-green-50">Tiến độ học liệu (%)</th>
                      <th className="px-6 py-4 font-semibold text-center bg-green-50">Số bài tự luyện</th>
                      <th className="px-6 py-4 font-semibold text-center bg-green-50">TB Tự học</th>
                      <th className="px-6 py-4 font-semibold text-center bg-blue-50">ĐTB Môn</th>
                    </>
                  )}
                  <th className="px-6 py-4 font-semibold text-center">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredStudents.length > 0 ? filteredStudents.map((student: any, index: number) => {
                  return (
                    <tr key={student.studentId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-center text-slate-400 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{student.studentCode}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{student.fullName}</td>
                      
                      {isHomeroom && selectedSubject === 'all' ? (
                        <>
                          {/* GVCN Data - All Subjects */}
                          {subjectColumns.map(sub => {
                            const sa = student.homeroomGrades?.subjectAverages?.find((s: any) => s.subjectName === sub);
                            return (
                              <td key={sub} className="px-6 py-4 text-center font-medium">
                                {sa?.finalSubjectScore !== undefined && sa?.finalSubjectScore !== null ? sa.finalSubjectScore.toFixed(1) : '-'}
                              </td>
                            );
                          })}
                          <td className="px-6 py-4 text-center bg-blue-50/20 font-bold text-blue-700">
                            {student.homeroomGrades?.semesterAverage?.toFixed(1) || '-'}
                          </td>
                          <td className="px-6 py-4 text-center bg-indigo-50/20 font-medium text-indigo-700">
                            {student.homeroomGrades?.overallProgress ? Math.round(student.homeroomGrades.overallProgress) + '%' : '-'}
                          </td>
                        </>
                      ) : (
                        <>
                          {/* Detailed Data (GVBM or GVCN with selected subject) */}
                          {(() => {
                            const subject = isHomeroom 
                                ? student.subjectGrades?.find((s: any) => s.subjectName === selectedSubject)
                                : student.subjectGrades?.[0];
                            return (
                              <>
                                {assignmentColumns.map(col => {
                                  const assignment = subject?.assignments?.find((a: any) => a.assignmentId === Number(col.id));
                                  return (
                                    <td key={col.id} className="px-6 py-4 text-center font-medium">
                                      {assignment?.score !== undefined && assignment?.score !== null ? assignment.score.toFixed(1) : '-'}
                                    </td>
                                  );
                                })}
                                <td className="px-6 py-4 text-center bg-slate-50 font-semibold">
                                  {subject?.averageAssignmentScore !== undefined && subject?.averageAssignmentScore !== null ? subject.averageAssignmentScore.toFixed(1) : '-'}
                                </td>
                                <td className="px-6 py-4 text-center bg-green-50/30 text-green-700 font-medium">
                                  {subject?.selfStudyProgress !== undefined && subject?.selfStudyProgress !== null ? subject.selfStudyProgress + '%' : '-'}
                                </td>
                                <td className="px-6 py-4 text-center bg-green-50/30 font-medium">
                                  {subject?.selfStudyCount || 0}
                                </td>
                                <td className="px-6 py-4 text-center bg-green-50/30 font-semibold text-green-700">
                                  {subject?.averageSelfStudyScore !== undefined && subject?.averageSelfStudyScore !== null ? subject.averageSelfStudyScore.toFixed(1) : '-'}
                                </td>
                                <td className="px-6 py-4 text-center bg-blue-50/30 font-bold text-blue-700 text-lg">
                                  {subject?.finalSubjectScore !== undefined && subject?.finalSubjectScore !== null ? subject.finalSubjectScore.toFixed(1) : '-'}
                                </td>
                              </>
                            );
                          })()}
                        </>
                      )}

                      <td className="px-6 py-4 text-center">
                        {student.status === 'Đạt' ? (
                          <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                            {student.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" /> {student.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={15} className="px-6 py-8 text-center text-slate-500">Chưa có dữ liệu điểm số.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
