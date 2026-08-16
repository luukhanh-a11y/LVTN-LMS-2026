import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminTickets from './AdminSupport';
import AdminKetQuaCuoiNam from './KetQuaCuoiNam';

type TabKey = 'tickets' | 'evaluations';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'tickets', label: 'Phiếu hỗ trợ' },
  { key: 'evaluations', label: 'Đánh giá cuối năm' }
];

export default function AdminOperations() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('tickets');

  useEffect(() => {
    if (location.hash === '#evaluations') {
      setActiveTab('evaluations');
    } else if (location.hash === '#tickets') {
      setActiveTab('tickets');
    }
  }, [location.hash]);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    navigate(`/admin/operations#${key}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-slate-900">Nghiệp vụ & Vận hành</h2>
        <p className="text-sm text-slate-500 mt-1">Xử lý yêu cầu hỗ trợ và các quy trình đánh giá định kỳ.</p>
      </div>

      <div className="flex border-b border-slate-200 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`pb-3 pt-4 px-6 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
              activeTab === t.key 
                ? 'border-blue-600 text-blue-600 font-semibold' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pt-2 flex-1 min-h-0">
        {activeTab === 'tickets' && (
          <div className="animate-in fade-in h-full">
            <AdminTickets isInsideTab={true} />
          </div>
        )}
        
        {activeTab === 'evaluations' && (
          <div className="animate-in fade-in h-full">
            <AdminKetQuaCuoiNam isInsideTab={true} />
          </div>
        )}
      </div>
    </div>
  );
}
