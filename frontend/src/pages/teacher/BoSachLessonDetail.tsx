import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { teacherService, type BaiHocDetail, type BaiHocDetailItem } from '../../services/teacher.service';
import LessonVisual from '../../components/student/LessonVisual';

const LOAI_LABEL: Record<string, string> = {
  TRAC_NGHIEM: 'Trắc nghiệm',
  NOI_CAP: 'Nối cặp',
  DIEN_KHUYET: 'Điền khuyết',
};

function QuizItemCard({ item, index }: { item: BaiHocDetailItem; index: number }) {
  const cauHinh = item.cauHinh;
  const dapAnChuan = item.dapAnChuan;

  return (
    <Card className="border-slate-200/60">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">
            Câu {index}. {item.tenDangBai}
          </h3>
          <div className="flex gap-2">
            {item.loai && <Badge variant="outline" className="text-[11px]">{LOAI_LABEL[item.loai] ?? item.loai}</Badge>}
            {item.xpThuong > 0 && <Badge variant="success" className="text-[11px]">+{item.xpThuong} XP</Badge>}
          </div>
        </div>

        <p className="text-slate-700">{cauHinh?.cauHoi}</p>

        {item.loai === 'TRAC_NGHIEM' && Array.isArray(cauHinh?.luaChon) && (
          <ul className="space-y-1.5">
            {cauHinh.luaChon.map((lc: any) => (
              <li
                key={lc.id}
                className={`text-sm px-3 py-1.5 rounded border ${
                  dapAnChuan?.dapAnDungId === lc.id
                    ? 'border-pro-success bg-pro-success/10 text-pro-success font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                {lc.noiDung}
              </li>
            ))}
          </ul>
        )}

        {item.loai === 'NOI_CAP' && Array.isArray(cauHinh?.cotTrai) && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1.5">
              {cauHinh.cotTrai.map((c: any) => (
                <div key={c.id} className="px-3 py-1.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                  {c.noiDung}
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {cauHinh.cotPhai.map((c: any) => (
                <div key={c.id} className="px-3 py-1.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                  {c.noiDung}
                </div>
              ))}
            </div>
            {dapAnChuan?.capDung && (
              <div className="col-span-2 text-xs text-slate-500 pt-1">
                Đáp án đúng:{' '}
                {dapAnChuan.capDung
                  .map((cap: any) => {
                    const trai = cauHinh.cotTrai.find((c: any) => c.id === cap.traiId)?.noiDung;
                    const phai = cauHinh.cotPhai.find((c: any) => c.id === cap.phaiId)?.noiDung;
                    return `${trai} ↔ ${phai}`;
                  })
                  .join('; ')}
              </div>
            )}
          </div>
        )}

        {item.loai === 'DIEN_KHUYET' && dapAnChuan?.dapAnTheoCho && (
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Đáp án chấp nhận: </span>
            {Object.values(dapAnChuan.dapAnTheoCho)
              .map((accepted: any) => (Array.isArray(accepted) ? accepted.join(' / ') : accepted))
              .join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BoSachLessonDetail() {
  const { baiHocId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<BaiHocDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!baiHocId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    teacherService
      .getBaiHocDetail(Number(baiHocId))
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Không tải được nội dung bài học.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [baiHocId]);

  const lyThuyet = detail?.items.find((it) => it.loai === 'LY_THUYET');
  const quizItems = detail?.items.filter((it) => it.loai !== 'LY_THUYET') ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <Button variant="outline" size="sm" onClick={() => navigate('/teacher/materials')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại Kho học liệu
      </Button>

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Đang tải...
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16 text-red-500 text-sm">{error}</div>
      )}

      {!loading && !error && detail && (
        <>
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{detail.tenSach}</Badge>
              <Badge variant="outline">{detail.tenChuDe}</Badge>
              <Badge variant="outline">Khối {detail.khoiLop}</Badge>
              <Badge variant="outline">{detail.tenMon}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-pro-primary" />
              {detail.tenBaiHoc}
            </h1>
          </div>

          {lyThuyet && (
            <Card className="border-pro-primary/30 bg-pro-primary/5">
              <CardContent className="p-5">
                <h2 className="font-semibold text-pro-primary flex items-center mb-2">
                  <Lightbulb className="h-4 w-4 mr-1.5" /> Lý thuyết
                </h2>
                <LessonVisual data={lyThuyet.cauHinh?.trucQuan} />
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{lyThuyet.cauHinh?.noiDung}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {quizItems.map((item, idx) => (
              <QuizItemCard key={item.id} item={item} index={idx + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
