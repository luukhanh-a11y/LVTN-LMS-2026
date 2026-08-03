import { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';

export default function TeacherClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await teacherService.getClasses();
        setClasses(data);
      } catch (err) {
        console.error('Failed to fetch classes', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Lớp học của tôi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map(cls => (
          <Card key={cls.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-primary">{cls.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{cls.role}</p>
                </div>
                <div className="flex items-center text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-sm">
                  <Users className="h-4 w-4 mr-2 text-slate-500" />
                  <span className="font-bold">{cls.students}</span> HS
                </div>
              </div>
              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <Link to={`/teacher/classes/${cls.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">Danh sách Học sinh chi tiết</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
