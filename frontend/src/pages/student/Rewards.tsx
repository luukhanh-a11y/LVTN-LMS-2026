import { useState, useEffect } from 'react';
import { ArrowLeft, MailOpen, Award, Mail, Trophy, Gem, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/student.service';

export default function StudentRewards() {
  const [activeTab, setActiveTab] = useState('badges');
  const [rewardsData, setRewardsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const data = await studentService.getRewards();
        setRewardsData(data);
      } catch (err) {
        console.error('Failed to fetch rewards', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const badges = rewardsData?.huyHieu || [];
  const letters = rewardsData?.thuKhen || [];
  const unlockedBadgeCount = badges.filter((b: any) => b.daMoKhoa).length;
  const totalXp = rewardsData?.tongXp ?? 0;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link to="/student" className="inline-flex items-center text-slate-500 hover:text-slate-700 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại
      </Link>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="flex items-center mb-6 md:mb-0 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-400 rounded-2xl flex items-center justify-center mr-6 shadow-lg shadow-amber-200/50 border-2 border-white">
             <Trophy className="w-12 h-12 animate-bounce-subtle text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-1">Kho báu của em</h1>
            <p className="text-slate-500 font-medium">Em đã sưu tập được {unlockedBadgeCount} huy hiệu và {letters.length} thư khen!</p>
          </div>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl border-2 border-amber-100 shadow-sm text-center relative z-10">
           <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Tổng điểm thưởng</div>
           <div className="text-3xl font-black text-amber-500 flex items-center justify-center">
             {totalXp.toLocaleString('vi-VN')} <Gem className="w-8 h-8 ml-2 text-cyan-500 fill-cyan-100" />
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl inline-flex">
         <button
           onClick={() => setActiveTab('badges')}
           className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'badges' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Award className="w-4 h-4" /> Huy hiệu
         </button>
         <button
           onClick={() => setActiveTab('letters')}
           className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'letters' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
           <Mail className="w-4 h-4" /> Hộp thư khen
         </button>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-amber-500">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : activeTab === 'badges' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {badges.map((badge: any) => (
            <div key={badge.id} className={`bg-white rounded-3xl p-6 border-2 flex flex-col items-center text-center transition-all ${
              badge.daMoKhoa
                ? 'border-amber-100 hover:border-amber-200 shadow-sm hover:shadow-md hover:-translate-y-1'
                : 'border-slate-100 bg-slate-50/50 opacity-70 grayscale'
            }`}>
               <div className="w-28 h-28 relative mb-4">
                  <img src={badge.icon} alt={badge.ten} className="w-full h-full object-contain relative z-10 drop-shadow-md" />
                  {!badge.daMoKhoa && (
                     <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100/80 rounded-full backdrop-blur-sm border-4 border-slate-200">
                        <Lock className="w-8 h-8 opacity-50 text-slate-500" />
                     </div>
                  )}
               </div>
               <h3 className={`text-xl font-black mb-2 ${badge.daMoKhoa ? 'text-slate-800' : 'text-slate-500'}`}>{badge.ten}</h3>
               <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">{badge.moTa}</p>

               {badge.daMoKhoa ? (
                  <div className="mt-auto inline-flex items-center text-student-success bg-student-success/10 px-4 py-2 rounded-xl text-sm font-bold border border-student-success/30 w-full justify-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Đạt: {badge.ngayTrao}
                  </div>
               ) : (
                  <div className="mt-auto inline-flex items-center text-slate-400 bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold w-full justify-center border border-slate-200">
                    Chưa mở khóa
                  </div>
               )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
           {letters.map((letter: any) => (
              <div key={letter.id} className="bg-gradient-to-br from-pink-50 to-red-50 p-1 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                 <div className="bg-white rounded-[22px] p-6 h-full border border-pink-100 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-bl-full -z-10"></div>
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                             <MailOpen className="w-5 h-5" />
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-800">{letter.giaoVien}</h3>
                             <p className="text-xs font-semibold text-pink-600">{letter.monHoc}</p>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{letter.ngayTrao}</span>
                    </div>
                    <div className="text-slate-700 font-medium leading-relaxed italic relative z-10 bg-pink-50/50 p-4 rounded-xl border border-pink-100/50">
                       "{letter.noiDung}"
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}
      </div>
    </div>
  );
}
