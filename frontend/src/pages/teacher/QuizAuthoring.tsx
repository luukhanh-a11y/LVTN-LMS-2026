import { useEffect, useState } from 'react';
import { ListChecks, Loader2, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { teacherService } from '../../services/teacher.service';
import type { Subject } from '../../services/teacher.service';
import { GRADES } from '../../constants';

type Loai = 'TRAC_NGHIEM' | 'NOI_CAP' | 'DIEN_KHUYET';

interface LuaChon { id: string; noiDung: string }
interface CotItem { id: string; noiDung: string }
interface CapDung { traiId: string; phaiId: string }
interface ChoTrong { id: string; vanBanTruoc: string; vanBanSau: string; dapAn: string }

let uidCounter = 0;
const uid = () => `id${Date.now()}_${uidCounter++}`;

export default function QuizAuthoring() {
  const [grade, setGrade] = useState('');
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDangBaiId, setSelectedDangBaiId] = useState<number | ''>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [loai, setLoai] = useState<Loai>('TRAC_NGHIEM');
  const [cauHoi, setCauHoi] = useState('');

  const [luaChon, setLuaChon] = useState<LuaChon[]>([{ id: uid(), noiDung: '' }, { id: uid(), noiDung: '' }]);
  const [dapAnDungId, setDapAnDungId] = useState('');

  const [cotTrai, setCotTrai] = useState<CotItem[]>([{ id: uid(), noiDung: '' }]);
  const [cotPhai, setCotPhai] = useState<CotItem[]>([{ id: uid(), noiDung: '' }]);
  const [capDung, setCapDung] = useState<CapDung[]>([]);

  const [danhSachCho, setDanhSachCho] = useState<ChoTrong[]>([{ id: uid(), vanBanTruoc: '', vanBanSau: '', dapAn: '' }]);

  useEffect(() => {
    teacherService.getSubjects().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  useEffect(() => {
    if (!subjectId || !grade) {
      setSlots([]);
      return;
    }
    setIsLoadingSlots(true);
    setSelectedDangBaiId('');
    teacherService
      .getQuizSlots(subjectId as number, Number(grade))
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setIsLoadingSlots(false));
  }, [subjectId, grade]);

  const resetForm = () => {
    setCauHoi('');
    setLuaChon([{ id: uid(), noiDung: '' }, { id: uid(), noiDung: '' }]);
    setDapAnDungId('');
    setCotTrai([{ id: uid(), noiDung: '' }]);
    setCotPhai([{ id: uid(), noiDung: '' }]);
    setCapDung([]);
    setDanhSachCho([{ id: uid(), vanBanTruoc: '', vanBanSau: '', dapAn: '' }]);
  };

  useEffect(() => {
    if (!selectedDangBaiId) {
      resetForm();
      return;
    }
    setIsLoadingContent(true);
    teacherService
      .getQuizContent(selectedDangBaiId as number)
      .then((data) => {
        if (!data.loai) {
          resetForm();
          return;
        }
        setLoai(data.loai);
        const ch = data.cauHinh || {};
        const da = data.dapAnChuan || {};
        setCauHoi(ch.cauHoi || '');
        if (data.loai === 'TRAC_NGHIEM') {
          setLuaChon(ch.luaChon?.length ? ch.luaChon : [{ id: uid(), noiDung: '' }, { id: uid(), noiDung: '' }]);
          setDapAnDungId(da.dapAnDungId || '');
        } else if (data.loai === 'NOI_CAP') {
          setCotTrai(ch.cotTrai?.length ? ch.cotTrai : [{ id: uid(), noiDung: '' }]);
          setCotPhai(ch.cotPhai?.length ? ch.cotPhai : [{ id: uid(), noiDung: '' }]);
          setCapDung(da.capDung || []);
        } else if (data.loai === 'DIEN_KHUYET') {
          const choArr = (ch.danhSachCho || []).map((c: any) => ({
            ...c,
            dapAn: (da.dapAnTheoCho?.[c.id] || []).join(', '),
          }));
          setDanhSachCho(choArr.length ? choArr : [{ id: uid(), vanBanTruoc: '', vanBanSau: '', dapAn: '' }]);
        }
      })
      .catch(() => toast.error('Không tải được nội dung bài này'))
      .finally(() => setIsLoadingContent(false));
  }, [selectedDangBaiId]);

  const handleSave = async () => {
    if (!selectedDangBaiId) return;
    if (!cauHoi.trim()) {
      toast.error('Vui lòng nhập câu hỏi/yêu cầu');
      return;
    }

    let cauHinh: any = { cauHoi };
    let dapAnChuan: any = {};

    if (loai === 'TRAC_NGHIEM') {
      if (luaChon.some((l) => !l.noiDung.trim()) || !dapAnDungId) {
        toast.error('Vui lòng nhập đủ các lựa chọn và chọn đáp án đúng');
        return;
      }
      cauHinh.luaChon = luaChon;
      dapAnChuan.dapAnDungId = dapAnDungId;
    } else if (loai === 'NOI_CAP') {
      if (cotTrai.some((c) => !c.noiDung.trim()) || cotPhai.some((c) => !c.noiDung.trim()) || capDung.length === 0) {
        toast.error('Vui lòng nhập đủ 2 cột và nối ít nhất 1 cặp đúng');
        return;
      }
      cauHinh.cotTrai = cotTrai;
      cauHinh.cotPhai = cotPhai;
      dapAnChuan.capDung = capDung;
    } else {
      if (danhSachCho.some((c) => !c.vanBanTruoc.trim() || !c.dapAn.trim())) {
        toast.error('Vui lòng nhập đủ nội dung và đáp án cho từng chỗ trống');
        return;
      }
      cauHinh.danhSachCho = danhSachCho.map(({ dapAn, ...rest }) => rest);
      dapAnChuan.dapAnTheoCho = Object.fromEntries(
        danhSachCho.map((c) => [c.id, c.dapAn.split(',').map((s) => s.trim()).filter(Boolean)])
      );
    }

    setIsSaving(true);
    try {
      await teacherService.saveQuizContent(selectedDangBaiId as number, { loai, cauHinh, dapAnChuan });
      toast.success('Đã lưu nội dung quiz!');
      const updated = await teacherService.getQuizSlots(subjectId as number, Number(grade));
      setSlots(updated);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lưu thất bại, vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCapDung = (traiId: string, phaiId: string) => {
    setCapDung((prev) => {
      const exists = prev.find((c) => c.traiId === traiId);
      if (exists?.phaiId === phaiId) return prev.filter((c) => c.traiId !== traiId);
      return [...prev.filter((c) => c.traiId !== traiId), { traiId, phaiId }];
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center">
        <ListChecks className="w-6 h-6 mr-2 text-pro-primary" />
        Soạn quiz bài tập bộ sách
      </h1>

      <Card>
        <CardHeader><CardTitle>Chọn bài</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Khối</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option value="">-- Chọn khối --</option>
                {GRADES.filter((g) => g.value !== 'all').map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Môn học</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" value={subjectId} onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : '')}>
                <option value="">-- Chọn môn --</option>
                {subjects.map((s) => <option key={s.monHocId} value={s.monHocId}>{s.tenMon}</option>)}
              </select>
            </div>
          </div>

          {isLoadingSlots ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh sách bài...</div>
          ) : subjectId && grade ? (
            slots.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Không có bài "bộ sách" nào cho môn/khối này.</p>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bài</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" value={selectedDangBaiId} onChange={(e) => setSelectedDangBaiId(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">-- Chọn bài --</option>
                  {slots.map((s) => (
                    <option key={s.id} value={s.id}>{s.tenChuDe} - {s.tenDangBai} {s.hasContent ? `✓ (${s.loai})` : '(chưa soạn)'}</option>
                  ))}
                </select>
              </div>
            )
          ) : null}
        </CardContent>
      </Card>

      {selectedDangBaiId && (
        isLoadingContent ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-pro-primary" /></div>
        ) : (
          <Card>
            <CardHeader><CardTitle>Nội dung quiz</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kiểu câu hỏi</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary" value={loai} onChange={(e) => setLoai(e.target.value as Loai)}>
                  <option value="TRAC_NGHIEM">Trắc nghiệm</option>
                  <option value="NOI_CAP">Nối cặp</option>
                  <option value="DIEN_KHUYET">Điền khuyết</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Câu hỏi / Yêu cầu</label>
                <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm resize-none" rows={2} value={cauHoi} onChange={(e) => setCauHoi(e.target.value)} placeholder="Ví dụ: 5 + 3 = ?" />
              </div>

              {loai === 'TRAC_NGHIEM' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Các lựa chọn (chọn nút tròn để đánh dấu đáp án đúng)</label>
                  {luaChon.map((lc, idx) => (
                    <div key={lc.id} className="flex items-center gap-2">
                      <input type="radio" name="dapAnDung" checked={dapAnDungId === lc.id} onChange={() => setDapAnDungId(lc.id)} />
                      <input
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm"
                        placeholder={`Lựa chọn ${idx + 1}`}
                        value={lc.noiDung}
                        onChange={(e) => setLuaChon((prev) => prev.map((x) => x.id === lc.id ? { ...x, noiDung: e.target.value } : x))}
                      />
                      <button onClick={() => setLuaChon((prev) => prev.filter((x) => x.id !== lc.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => setLuaChon((prev) => [...prev, { id: uid(), noiDung: '' }])}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Thêm lựa chọn
                  </Button>
                </div>
              )}

              {loai === 'NOI_CAP' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Cột trái</label>
                    {cotTrai.map((c, idx) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <input className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm" placeholder={`Mục ${idx + 1}`} value={c.noiDung} onChange={(e) => setCotTrai((prev) => prev.map((x) => x.id === c.id ? { ...x, noiDung: e.target.value } : x))} />
                        <button onClick={() => setCotTrai((prev) => prev.filter((x) => x.id !== c.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => setCotTrai((prev) => [...prev, { id: uid(), noiDung: '' }])}><Plus className="w-3.5 h-3.5 mr-1" /> Thêm</Button>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Cột phải</label>
                    {cotPhai.map((c, idx) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <input className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm" placeholder={`Mục ${idx + 1}`} value={c.noiDung} onChange={(e) => setCotPhai((prev) => prev.map((x) => x.id === c.id ? { ...x, noiDung: e.target.value } : x))} />
                        <button onClick={() => setCotPhai((prev) => prev.filter((x) => x.id !== c.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => setCotPhai((prev) => [...prev, { id: uid(), noiDung: '' }])}><Plus className="w-3.5 h-3.5 mr-1" /> Thêm</Button>
                  </div>
                  <div className="col-span-2 pt-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Đánh dấu cặp đúng (bấm 1 ô cột trái rồi 1 ô cột phải tương ứng)</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {cotTrai.map((t) => (
                        <div key={t.id} className="flex gap-2 items-center">
                          <span className="font-medium w-24 truncate">{t.noiDung || '(trống)'}</span>
                          <select
                            className="flex-1 px-2 py-1 border border-slate-300 rounded outline-none"
                            value={capDung.find((c) => c.traiId === t.id)?.phaiId || ''}
                            onChange={(e) => toggleCapDung(t.id, e.target.value)}
                          >
                            <option value="">-- nối với --</option>
                            {cotPhai.map((p) => <option key={p.id} value={p.id}>{p.noiDung || '(trống)'}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {loai === 'DIEN_KHUYET' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Các chỗ trống</label>
                  {danhSachCho.map((c, idx) => (
                    <div key={c.id} className="p-3 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Chỗ trống {idx + 1}</span>
                        <button onClick={() => setDanhSachCho((prev) => prev.filter((x) => x.id !== c.id))} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <input className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm" placeholder="Văn bản trước chỗ trống (VD: Con mèo có)" value={c.vanBanTruoc} onChange={(e) => setDanhSachCho((prev) => prev.map((x) => x.id === c.id ? { ...x, vanBanTruoc: e.target.value } : x))} />
                      <input className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm" placeholder="Văn bản sau chỗ trống (VD: chân)" value={c.vanBanSau} onChange={(e) => setDanhSachCho((prev) => prev.map((x) => x.id === c.id ? { ...x, vanBanSau: e.target.value } : x))} />
                      <input className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm" placeholder="Đáp án chấp nhận, cách nhau bởi dấu phẩy (VD: 4, bốn)" value={c.dapAn} onChange={(e) => setDanhSachCho((prev) => prev.map((x) => x.id === c.id ? { ...x, dapAn: e.target.value } : x))} />
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => setDanhSachCho((prev) => [...prev, { id: uid(), vanBanTruoc: '', vanBanSau: '', dapAn: '' }])}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Thêm chỗ trống
                  </Button>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button variant="pro-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Lưu nội dung
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
