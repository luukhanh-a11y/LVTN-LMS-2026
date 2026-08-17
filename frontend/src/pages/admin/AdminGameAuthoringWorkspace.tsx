import { useParams, useNavigate, useLocation } from 'react-router-dom';
import GameAuthoringForm from './components/GameAuthoringForm';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function AdminGameAuthoringWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = location.pathname.includes('/edit/');
  const dangBaiId = isEdit ? Number(id) : 0;
  const baiHocId = isEdit ? 0 : Number(id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full bg-slate-100 hover:bg-slate-200">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isEdit ? 'Chỉnh sửa Bài tập / Game' : 'Tạo mới Bài tập / Game'}
            </h2>
            <p className="text-slate-500 mt-1">Soạn thảo nội dung và cấu hình luật chơi</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <GameAuthoringForm
          dangBaiId={dangBaiId}
          baiHocId={baiHocId}
          onSaveSuccess={() => navigate(-1)}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
