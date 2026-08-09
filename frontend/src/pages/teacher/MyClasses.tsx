import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, ChevronRight, Star, BookMarked } from 'lucide-react';
import { cn } from '../../lib/utils';
import { teacherService } from '../../services/teacher.service';
import toast from 'react-hot-toast';

export default function MyClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const cls = await teacherService.getClasses();
        const mapped = cls.map((c: any) => ({
          id: c.id,
          name: c.name,
          role: c.role === 'Chủ nhiệm' ? 'Giáo viên chủ nhiệm' : 'Giáo viên bộ môn',
          isHomeroom: c.role === 'Chủ nhiệm',
          isTeaching: c.monHocList && c.monHocList.length > 0,
          semester: c.academicYear || 'Năm học hiện tại',
          subject: (c.monHocList && c.monHocList.length > 0) ? c.monHocList.map((m: any) => m.tenMon).join(', ') : 'Không dạy môn nào (Chỉ CN)',
          studentsCount: c.students || 0
        }));
        setClasses(mapped);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách lớp học');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const homeroomClasses = classes.filter(cls => cls.isHomeroom);
  const teachingClasses = classes.filter(cls => cls.isTeaching);

  const renderClassCard = (cls: any, isHomeroom: boolean) => (
    <div key={cls.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col h-full">
      {isHomeroom && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-400"></div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
            {isHomeroom && (
              <span title="Lớp chủ nhiệm" className="text-orange-500">
                <Star className="w-5 h-5 fill-current" />
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{cls.semester}</p>
        </div>
        
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          isHomeroom ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
        )}>
          {isHomeroom ? <GraduationCap className="w-5 h-5" /> : <BookMarked className="w-5 h-5" />}
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Môn: <strong>{cls.subject}</strong></span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Users className="w-4 h-4 text-slate-400" />
          <span>Sĩ số: <strong>{cls.studentsCount} học sinh</strong></span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex gap-2 mt-auto">
        <Link 
          to={`/teacher/classes/${cls.id}/grades`}
          className="flex-1 px-4 py-2 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition text-center flex items-center justify-center"
        >
          Bảng điểm
        </Link>
        {/* TRUYỀN THÊM STATE isHomeroom VÀ className SANG TRANG CHI TIẾT */}
        <Link 
          to={`/teacher/classes/${cls.id}`} 
          state={{ isHomeroom: isHomeroom, className: cls.name, studentsCount: cls.studentsCount, academicYear: cls.semester }}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1"
        >
          Chi tiết <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Lớp học của tôi</h2>
        <p className="text-sm text-slate-500 mt-1">Danh sách các lớp bạn đang phụ trách giảng dạy và chủ nhiệm</p>
      </div>

      {homeroomClasses.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-slate-900">Lớp Chủ Nhiệm</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeroomClasses.map((cls) => renderClassCard(cls, true))}
          </div>
        </section>
      )}

      {teachingClasses.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-slate-900">Lớp Phụ Trách Giảng Dạy</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachingClasses.map((cls) => renderClassCard(cls, false))}
          </div>
        </section>
      )}
    </div>
  );
}
