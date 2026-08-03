import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users } from 'lucide-react';
import { parentService } from '../../services/parent.service';
import { useParentContextStore } from '../../stores/useParentContextStore';
import { useAuthStore } from '../../stores/useAuthStore';

export default function SelectChild() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setSelectedChild = useParentContextStore((state) => state.setSelectedChild);
  const markNoChildren = useParentContextStore((state) => state.markNoChildren);

  const [children, setChildren] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'PHU_HUYNH') {
      navigate('/');
      return;
    }

    parentService.getChildren()
      .then((data) => {
        if (!data || data.length === 0) {
          markNoChildren();
          navigate('/parent', { replace: true });
        } else if (data.length === 1) {
          setSelectedChild({ id: data[0].id, name: data[0].name, className: data[0].className });
          navigate('/parent', { replace: true });
        } else {
          setChildren(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch children', err);
        markNoChildren();
        navigate('/parent', { replace: true });
      });
  }, [user, navigate, setSelectedChild, markNoChildren]);

  const handleSelect = (child: any) => {
    setSelectedChild({ id: child.id, name: child.name, className: child.className });
    navigate('/parent', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800">Chọn hồ sơ con</h1>
          <p className="text-slate-500 mt-2">
            Bạn có {children.length} con đang liên kết. Chọn một hồ sơ để tiếp tục.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => handleSelect(child)}
              className="bg-white border-2 border-slate-100 hover:border-pro-primary/50 hover:shadow-lg rounded-2xl p-6 flex flex-col items-center text-center transition-all active:scale-[0.98]"
            >
              <div className="w-16 h-16 rounded-full bg-pro-primary/10 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-pro-primary" />
              </div>
              <span className="font-bold text-lg text-slate-800">{child.name}</span>
              <span className="text-sm text-slate-500 mt-1">{child.className}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
