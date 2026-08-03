import { useState, useEffect } from 'react';
import { Bell, TrendingUp, AlertCircle, MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { parentService } from '../../services/parent.service';
import { useParentContextStore } from '../../stores/useParentContextStore';

// --- Subcomponents (KISS / SRP) ---

const ActivityItem = ({ title, type, badge }: { title: string, type: string, badge: string }) => (
  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
    <div>
      <p className="font-medium text-slate-800">{title}</p>
      <p className="text-sm text-slate-500">{type}</p>
    </div>
    <Badge variant="success">{badge}</Badge>
  </div>
);

const AlertItem = ({ title, description }: { title: string, description: string }) => (
  <li className="flex items-start p-4 border border-pro-warning/30 bg-pro-warning/10 rounded-lg">
    <AlertCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5 text-pro-warning" />
    <div>
      <p className="font-medium text-pro-fg">{title}</p>
      <p className="text-sm mt-1 text-pro-warning">{description}</p>
    </div>
  </li>
);

const AnnouncementItem = ({ title, content, date, tag }: { title: string, content: string, date: string, tag: string }) => (
  <div className="p-4 border border-pro-primary/20 bg-pro-primary/5 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <Badge variant="outline" className="border-pro-primary/40 text-pro-primary bg-pro-primary/10">{tag}</Badge>
      <span className="text-xs text-slate-500">{date}</span>
    </div>
    <h4 className="font-bold text-slate-800">{title}</h4>
    <p className="text-sm text-slate-600 mt-2">{content}</p>
  </div>
);

// --- Main Component ---

export default function ParentDashboard() {
  const selectedChild = useParentContextStore((state) => state.selectedChild);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedChild) return;
    setIsLoading(true);
    const fetchDashboard = async () => {
      try {
        const data = await parentService.getDashboard(selectedChild.id);
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [selectedChild]);

  if (!selectedChild) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Vui lòng chọn hồ sơ con để xem tiến độ học tập.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tiến độ học tập ({dashboardData?.fullName})</h1>
        {selectedChild && (
          <div className="px-4 py-2 bg-pro-primary/10 text-pro-primary rounded-lg font-bold">
            Đang xem: {selectedChild.name}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Kết quả học tập gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.recentActivities?.length > 0 ? (
                dashboardData.recentActivities.map((act: any, idx: number) => (
                    <ActivityItem key={idx} title={act.title} type={act.type} badge={act.badge} />
                ))
            ) : (
                <p className="text-slate-500 text-sm">Chưa có kết quả học tập nào gần đây.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-pro-warning" />
              Thông báo & Nhắc nhở
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {dashboardData?.alerts?.length > 0 ? (
                  dashboardData.alerts.map((alert: any, idx: number) => (
                      <AlertItem key={idx} title={alert.title} description={alert.description} />
                  ))
              ) : (
                  <p className="text-slate-500 text-sm">Không có nhắc nhở nào.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-pro-primary" />
              Bảng tin từ Nhà trường
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.announcements?.length > 0 ? (
                dashboardData.announcements.map((ann: any, idx: number) => (
                    <AnnouncementItem key={idx} title={ann.title} content={ann.content} date={ann.date} tag={ann.tag} />
                ))
            ) : (
                <p className="text-slate-500 text-sm">Không có bảng tin mới nào.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
