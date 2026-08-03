import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, Cloud, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import titiMascot from '../../assets/titi-2d.png';
import { studentService } from '../../services/student.service';

export default function StudentAdventureMap() {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;
    setIsLoading(true);
    studentService
      .getSubjectTree(Number(subjectId))
      .then((data) => {
        setChapters(data.chapters ?? []);
        setSubjectName(data.subjectName ?? '');
      })
      .catch((err) => console.error('Failed to fetch subject tree', err))
      .finally(() => setIsLoading(false));
  }, [subjectId]);

  const nodes = chapters.flatMap((chapter: any) => chapter.lessons ?? []);
  const NODE_SPACING = 190;
  const mapHeight = Math.max(600, nodes.length * NODE_SPACING + 200);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-student-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative hide-scrollbar overflow-y-auto">
      {/* Nút quay lại */}
      <div className="absolute top-6 left-6 z-20">
        <Link to={`/student/subject/${subjectId}`}>
          <Button variant="outline" className="bg-white border-student-border text-student-fg hover:bg-student-primary/5 rounded-full px-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại Bản đồ Chính
          </Button>
        </Link>
      </div>

      {/* Tên Hành tinh */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-student-primary border border-student-primary/50 px-6 py-2 rounded-full shadow-clay-sm">
          <h2 className="text-xl font-black text-white">{subjectName || 'Hành trình học tập'}</h2>
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pt-24">
          <p className="text-slate-400 font-medium">Môn học này chưa có bài giảng nào cho lớp của em.</p>
        </div>
      ) : (
        <div className="relative w-full mt-24" style={{ height: `${mapHeight}px` }}>
          {/* Đường nối trung tâm */}
          <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 rounded-full bg-student-primary/10" />

          {/* Các Nodes */}
          {nodes.map((node: any, idx: number) => {
            const top = `${140 + idx * NODE_SPACING}px`;
            const left = `${50 + 26 * Math.sin(idx * 1.05)}%`;
            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
                style={{ top, left }}
              >
                {/* Nhãn Tên Bài */}
                <div className={`mb-3 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg transition-transform ${
                  node.status === 'locked' ? 'bg-slate-200 text-slate-400' :
                  node.status === 'current' ? 'bg-amber-500 text-amber-900 scale-110 animate-bounce-subtle' :
                  'bg-student-primary text-white'
                }`}>
                  {node.title}
                </div>

                {/* Nút Node */}
                {node.status === 'locked' ? (
                  <div className="w-20 h-20 bg-slate-100 rounded-full border-4 border-slate-300 flex items-center justify-center relative shadow-inner">
                    <Cloud className="absolute -top-4 -left-4 w-12 h-12 text-slate-300" />
                    <Cloud className="absolute -bottom-2 -right-4 w-10 h-10 text-slate-300" />
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                ) : node.status === 'current' ? (
                  <Link to={`/student/lesson/${node.id}?subjectId=${subjectId}`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full border-4 border-white flex items-center justify-center shadow-[0_0_30px_#f59e0b] animate-pulse-glow cursor-pointer hover:scale-110 transition-transform relative">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/50 animate-[spin_4s_linear_infinite]"></div>
                    </div>
                  </Link>
                ) : (
                  <Link to={`/student/lesson/${node.id}?subjectId=${subjectId}`}>
                    <div className="w-20 h-20 bg-gradient-to-br from-student-primary to-student-accent rounded-full border-4 border-white flex flex-col items-center justify-center shadow-[0_0_20px_rgba(75,158,255,0.5)] cursor-pointer hover:scale-110 transition-transform relative">
                      <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-student-success bg-white rounded-full" />
                    </div>
                  </Link>
                )}
              </div>
            );
          })}

          {/* Mascot Tit */}
          <div className="absolute bottom-20 right-6 flex items-end animate-float-delayed z-20">
            <div className="bg-white text-student-fg px-4 py-3 rounded-2xl rounded-br-none shadow-xl mb-4 mr-4 font-bold max-w-[200px] border-2 border-student-primary/20">
              Cố lên, em sắp chinh phục hết {subjectName || 'môn học'} rồi!
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-clay-md overflow-hidden">
              <img src={titiMascot} alt="Tit - người bạn đồng hành học tập" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
