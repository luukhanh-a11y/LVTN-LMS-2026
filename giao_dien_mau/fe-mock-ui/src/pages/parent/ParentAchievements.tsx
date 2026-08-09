import { useOutletContext } from 'react-router-dom';
import { Award, Star } from 'lucide-react';
import { badgesData, childrenData } from '../../mockParentData';
import { cn } from '../../lib/utils';

export default function ParentAchievements() {
  const { activeChildId } = useOutletContext<{ activeChildId: number }>();
  const activeChild = childrenData.find(c => c.id === activeChildId) || childrenData[0];
  const badges = badgesData[activeChildId as keyof typeof badgesData] || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Góc Thành Tích</h2>
          <p className="text-sm text-slate-500 mt-1">
            Bộ sưu tập huy hiệu khen thưởng của <strong className="text-slate-700">{activeChild.name}</strong>.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex-1">
        
        {badges.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Star className="w-16 h-16 text-slate-200 mb-4" />
            <p className="font-bold text-lg text-slate-700">Chưa có huy hiệu nào</p>
            <p className="text-sm mt-1">Bé hãy cố gắng học tập thật tốt để nhận huy hiệu từ giáo viên nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map(badge => (
              <div key={badge.id} className="border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-blue-300 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity">
                  <Award className="w-16 h-16" />
                </div>
                
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300", badge.color)}>
                  {badge.icon}
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg mb-1">{badge.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{badge.date}</p>
                
                <p className="text-sm text-slate-600 line-clamp-3 italic relative">
                  "{badge.message}"
                </p>
                
                <div className="mt-4 pt-4 border-t border-slate-100 w-full text-xs font-medium text-slate-500">
                  Trao bởi: <span className="text-slate-700 font-bold">{badge.teacher}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
