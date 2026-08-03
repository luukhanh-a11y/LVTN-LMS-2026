import { useState, useEffect } from 'react';
import { Loader2, FileText, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { parentService } from '../../services/parent.service';
import { useParentContextStore } from '../../stores/useParentContextStore';

export default function ParentAssignments() {
  const selectedChild = useParentContextStore((state) => state.selectedChild);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedChild) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await parentService.getAssignments(selectedChild.id);
        setAssignments(data);
      } catch (err) {
        console.error('Failed to fetch assignments', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, [selectedChild]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bài tập về nhà</h1>
          <p className="text-slate-500 mt-1">
            {selectedChild ? `Theo dõi tiến độ làm bài của ${selectedChild.name}` : 'Theo dõi tiến độ làm bài của con'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-pro-primary" />
        </div>
      ) : !selectedChild ? (
        <Card className="bg-slate-50 border-dashed border-2">
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <FileText className="w-12 h-12 mb-4 text-slate-300" />
            <p>Bạn chưa có học sinh nào được liên kết.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên bài tập</TableHead>
                  <TableHead>Loại bài</TableHead>
                  <TableHead>Hạn nộp</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead className="text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length > 0 ? assignments.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium text-slate-900">{a.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.type}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{a.deadline}</TableCell>
                    <TableCell>
                      {a.status === 'DA_NOP' ? (
                        <span className="text-green-500 flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" /> Đã hoàn thành
                        </span>
                      ) : a.status === 'QUA_HAN' ? (
                        <span className="text-red-500 flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1" /> Quá hạn
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1" /> {a.timeRemaining}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {a.status === 'DA_NOP' ? (
                        <Badge variant="success">Đã nộp</Badge>
                      ) : a.status === 'QUA_HAN' ? (
                        <Badge variant="danger">Quá hạn</Badge>
                      ) : (
                        <Badge variant="warning">Chưa nộp</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      Chưa có bài tập nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
