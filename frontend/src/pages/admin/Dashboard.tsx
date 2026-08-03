import { useState, useEffect } from 'react';
import { Users, BookOpen, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

import { adminService } from '../../services/admin.service';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalClasses: 0,
    activeClasses: 0,
    trafficData: [] as number[],
    systemWarnings: [] as string[]
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const kpis = [
    { title: 'Tổng số Học sinh', value: stats.totalStudents, icon: Users, bg: 'bg-pro-primary/10', color: 'text-pro-primary' },
    { title: 'Giáo viên', value: stats.totalTeachers, icon: UserCheck, bg: 'bg-pro-success/10', color: 'text-pro-success' },
    { title: 'Phụ huynh', value: stats.totalParents, icon: Users, bg: 'bg-pro-accent/10', color: 'text-pro-accent' },
    { title: 'Lớp học (Đang hoạt động)', value: `${stats.activeClasses} / ${stats.totalClasses}`, icon: BookOpen, bg: 'bg-pro-warning/10', color: 'text-pro-warning' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tổng quan toàn trường</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="flex items-center p-6">
              <div className={`p-4 rounded-full ${kpi.bg} mr-4`}>
                <Icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lưu lượng truy cập (7 ngày qua)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between bg-slate-50 rounded-lg border border-slate-200 p-4 pt-10">
              {stats.trafficData?.map((val, idx) => {
                const max = Math.max(...(stats.trafficData || [1]), 1);
                const heightPercent = (val / max) * 100;
                const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
                return (
                  <div key={idx} className="flex flex-col items-center w-full gap-2 group">
                    <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">{val}</span>
                    <div
                      className="w-8 md:w-12 bg-pro-primary hover:bg-pro-primary/90 rounded-t-md transition-all duration-300 relative"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-xs font-medium text-slate-600 mt-2">{days[idx]}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cảnh báo hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats.systemWarnings?.map((warning, idx) => {
                const isError = warning.toLowerCase().includes('chưa');
                return (
                  <li key={idx} className={`flex items-start p-3 rounded-lg ${isError ? 'bg-pro-destructive/10 text-pro-destructive' : 'bg-pro-success/10 text-pro-success'}`}>
                    <AlertCircle className={`h-5 w-5 mr-3 shrink-0 mt-0.5 ${isError ? 'text-pro-destructive' : 'text-pro-success'}`} />
                    <div>
                      <p className="font-medium">{isError ? 'Cần chú ý' : 'Tuyệt vời'}</p>
                      <p className={`text-sm mt-1 ${isError ? 'text-pro-destructive' : 'text-pro-success'}`}>{warning}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
