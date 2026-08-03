import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trophy, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { teacherService } from '../../../services/teacher.service';

interface Props {
  studentId: number;
  studentName: string;
  onClose: () => void;
}

export function RewardModal({ studentId, studentName, onClose }: Props) {
  const [badges, setBadges] = useState<{ huyHieuId: number; tenHuyHieu: string; moTa: string | null; iconUrl: string | null }[]>([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState<number | null>(null);
  const [complimentLetter, setComplimentLetter] = useState(`Cô/Thầy rất tuyên dương ${studentName} tuần này!`);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    teacherService
      .getBadges()
      .then((data) => {
        setBadges(data);
        if (data.length > 0) setSelectedBadgeId(data[0].huyHieuId);
      })
      .catch(() => toast.error('Không tải được danh sách huy hiệu.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!selectedBadgeId) {
      toast.error('Vui lòng chọn huy hiệu.');
      return;
    }
    setIsSubmitting(true);
    try {
      await teacherService.awardBadge(studentId, { huyHieuId: selectedBadgeId, thuKhen: complimentLetter });
      toast.success(`Đã trao huy hiệu cho ${studentName}!`);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Trao huy hiệu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-[500px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
          <h3 className="font-bold text-amber-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-amber-500" /> Tặng Huy Hiệu & Thư Khen
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center mb-2">
            <p className="text-sm text-slate-500">Học sinh nhận thưởng</p>
            <p className="text-lg font-bold text-slate-800">{studentName}</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">1. Chọn loại Huy hiệu</label>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.huyHieuId}
                    onClick={() => setSelectedBadgeId(badge.huyHieuId)}
                    className={`border-2 rounded-lg p-3 text-center cursor-pointer relative ${
                      selectedBadgeId === badge.huyHieuId ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {selectedBadgeId === badge.huyHieuId && (
                      <div className="absolute top-1 right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                    )}
                    <Trophy className={`w-8 h-8 mx-auto mb-1 ${selectedBadgeId === badge.huyHieuId ? 'text-amber-500' : 'text-slate-400'}`} />
                    <p className={`text-xs font-bold ${selectedBadgeId === badge.huyHieuId ? 'text-amber-900' : 'text-slate-600'}`}>{badge.tenHuyHieu}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">2. Nội dung Thư khen (Tùy chọn)</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-sm h-20 resize-none bg-slate-50"
              placeholder="Ghi nhận xét động viên học sinh..."
              value={complimentLetter}
              onChange={(e) => setComplimentLetter(e.target.value)}
            />
          </div>

          <div className="p-3 bg-pro-primary/10 border border-pro-primary/20 rounded-lg flex items-start">
            <AlertCircle className="w-4 h-4 text-pro-primary mr-2 shrink-0 mt-0.5" />
            <p className="text-xs text-pro-fg">
              Thư khen và huy hiệu sẽ được hiển thị trên Bộ Sưu Tập của học sinh. Nếu tài khoản phụ huynh có email nhận thông báo, hệ thống sẽ gửi email ngay.
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading || !selectedBadgeId}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi thưởng ngay'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
