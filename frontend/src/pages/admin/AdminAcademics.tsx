import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminCurriculum from './Curriculum';
import AdminClasses from './AdminClasses';
import AdminSubjects from './AdminSubjects';

type TabKey = 'curriculum' | 'classes' | 'subjects';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'curriculum', label: 'Chương trình học' },
  { key: 'classes', label: 'Lớp học' },
  { key: 'subjects', label: 'Môn học' }
];

export default function AdminAcademics() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('curriculum');

  useEffect(() => {
    if (location.hash === '#classes') {
      setActiveTab('classes');
    } else if (location.hash === '#curriculum') {
      setActiveTab('curriculum');
    } else if (location.hash === '#subjects') {
      setActiveTab('subjects');
    }
  }, [location.hash]);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    navigate(`/admin/academics#${key}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Quản lý Học vụ</h2>
        <p className="text-sm text-slate-500 mt-1">Điều hành chương trình đào tạo và danh sách lớp học của trường.</p>
      </div>

      <div className="flex border-b border-slate-200">
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

      <div className="pt-2">
        {activeTab === 'curriculum' && (
          <div className="animate-in fade-in">
            <AdminCurriculum isInsideTab={true} />
          </div>
        )}
        
        {activeTab === 'classes' && (
          <div className="animate-in fade-in">
            <AdminClasses isInsideTab={true} />
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="animate-in fade-in">
            <AdminSubjects isInsideTab={true} />
          </div>
        )}
      </div>
    </div>
  );
}
