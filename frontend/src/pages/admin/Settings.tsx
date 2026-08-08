import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/Badge';
import { Plus, Trash2, X, AlertTriangle, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

import { adminService } from '../../services/admin.service';
import { academicService, type NamHoc, type HocKy } from '../../services/academic.service';
import AdminKetQuaCuoiNam from './KetQuaCuoiNam';

type TabKey = 'general' | 'subjects' | 'academic' | 'results';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'Thông tin chung' },
  { key: 'subjects', label: 'Môn học' },
  { key: 'academic', label: 'Năm học & Học kỳ' },
  { key: 'results', label: 'Kết quả cuối năm & Chuyển lớp' },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [config, setConfig] = useState({
    cauHinhId: 1,
    tenTruong: '',
    logoUrl: '',
    diaChi: '',
    hotline: '',
    emailLienHe: '',
    hocKyHienTaiId: undefined as number | undefined,
  });
  const [namHocList, setNamHocList] = useState<NamHoc[]>([]);
  const [selectedNamHocIdForHocKy, setSelectedNamHocIdForHocKy] = useState<number | ''>('');
  const [hocKyOptions, setHocKyOptions] = useState<HocKy[]>([]);
  const [monHocList, setMonHocList] = useState<any[]>([]);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isSettingHocKy, setIsSettingHocKy] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    fetchConfig();
    academicService.getNamHocs().then(setNamHocList).catch(() => setNamHocList([]));
    adminService.getMonHocList().then(setMonHocList).catch(() => setMonHocList([]));
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await adminService.getSystemConfig();
      setConfig({
        cauHinhId: data.cauHinhId ?? 1,
        tenTruong: data.tenTruong ?? '',
        logoUrl: data.logoUrl ?? '',
        diaChi: data.diaChi ?? '',
        hotline: data.hotline ?? '',
        emailLienHe: data.emailLienHe ?? '',
        hocKyHienTaiId: data.hocKyHienTaiId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Xác định năm học đang chứa học kỳ hiện tại của hệ thống, để mặc định chọn đúng năm
  // (Học kỳ hiện tại "Học kỳ hiện tại" phải chọn Năm học trước rồi mới chọn Học kỳ trong năm đó).
  useEffect(() => {
    if (!config.hocKyHienTaiId) return;
    academicService.getAllHocKy().then((all) => {
      const current = all.find((hk) => hk.hocKyId === config.hocKyHienTaiId);
      if (current) setSelectedNamHocIdForHocKy(current.namHocId);
    }).catch(() => {});
  }, [config.hocKyHienTaiId]);

  useEffect(() => {
    if (!selectedNamHocIdForHocKy) { setHocKyOptions([]); return; }
    academicService.getHocKysByNamHoc(Number(selectedNamHocIdForHocKy)).then(setHocKyOptions).catch(() => setHocKyOptions([]));
  }, [selectedNamHocIdForHocKy]);

  // PUT /cau-hinh-he-thong luôn cần gửi đủ field (mapper không bỏ qua field null) —
  // 2 hành động Lưu khác nhau (thông tin chung / đặt học kỳ hiện tại) đều gửi cả `config`.
  const handleSaveGeneral = async () => {
    setIsSavingGeneral(true);
    try {
      await adminService.updateSystemConfig(config);
      toast.success('Lưu thông tin trường thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi lưu thông tin trường');
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleSetCurrentHocKy = async () => {
    if (!config.hocKyHienTaiId) {
      toast.error('Vui lòng chọn học kỳ trước!');
      return;
    }
    setIsSettingHocKy(true);
    try {
      await adminService.updateSystemConfig(config);
      toast.success('Đã đặt làm học kỳ hiện tại của hệ thống!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi đặt học kỳ hiện tại');
    } finally {
      setIsSettingHocKy(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject) return;
    try {
      await adminService.createMonHoc({ tenMon: newSubject });
      toast.success('Đã thêm môn học!');
      setNewSubject('');
      setShowSubjectModal(false);
      adminService.getMonHocList().then(setMonHocList).catch(() => {});
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi khi thêm môn học');
    }
  };

  const handleRemoveSubject = async (id: number) => {
    try {
      await adminService.deleteMonHoc(id);
      setMonHocList((prev) => prev.filter((m) => m.monHocId !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi khi xóa môn học');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-800">Học vụ</h1>

      <div className="flex border-b border-slate-200 bg-white rounded-t-xl shadow-sm px-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`pb-3 pt-3 px-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === t.key ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tên trường"
                value={config.tenTruong}
                onChange={(e) => setConfig({ ...config, tenTruong: e.target.value })}
              />
              <Input
                label="Hotline"
                value={config.hotline}
                onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
              />
            </div>
            <Input
              label="Địa chỉ"
              value={config.diaChi}
              onChange={(e) => setConfig({ ...config, diaChi: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email liên hệ"
                type="email"
                value={config.emailLienHe}
                onChange={(e) => setConfig({ ...config, emailLienHe: e.target.value })}
              />
              <Input
                label="Logo URL"
                value={config.logoUrl}
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveGeneral} isLoading={isSavingGeneral}>Lưu thông tin</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'subjects' && (
        <Card>
          <CardHeader>
            <CardTitle>Danh mục Môn học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-slate-500">Áp dụng cho toàn bộ sách/bài tập/phân công giảng dạy.</p>
              <Button variant="outline" size="sm" onClick={() => setShowSubjectModal(true)}>
                <Plus className="w-4 h-4 mr-1" /> Thêm Môn
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {monHocList.map((m) => (
                <Badge key={m.monHocId} variant="outline" className="px-3 py-1.5 flex items-center bg-slate-50">
                  {m.tenMon} <Trash2 className="w-3 h-3 ml-2 text-slate-400 hover:text-red-500 cursor-pointer" onClick={() => handleRemoveSubject(m.monHocId)} />
                </Badge>
              ))}
              {monHocList.length === 0 && <p className="text-sm text-slate-400 italic">Chưa có môn học nào.</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'academic' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Học kỳ hiện tại của hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Năm học</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1"
                    value={selectedNamHocIdForHocKy}
                    onChange={(e) => {
                      setSelectedNamHocIdForHocKy(e.target.value ? Number(e.target.value) : '');
                      setConfig({ ...config, hocKyHienTaiId: undefined });
                    }}
                  >
                    <option value="">-- Chọn năm học --</option>
                    {namHocList.map((nh) => (
                      <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Học kỳ</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary focus:ring-1"
                    value={config.hocKyHienTaiId ?? ''}
                    onChange={(e) => setConfig({ ...config, hocKyHienTaiId: e.target.value ? Number(e.target.value) : undefined })}
                    disabled={!selectedNamHocIdForHocKy}
                  >
                    <option value="">-- Chọn học kỳ --</option>
                    {hocKyOptions.map((hk) => (
                      <option key={hk.hocKyId} value={hk.hocKyId}>Học kỳ {hk.soHocKy}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Bấm "Đặt làm học kỳ hiện tại" sẽ đổi mặc định cho <strong>toàn bộ hệ thống</strong> (giáo viên/phụ huynh) ngay lập tức. Việc chỉ chọn năm học ở góc trên bên phải để xem lại dữ liệu cũ thì không ảnh hưởng gì — chỉ hành động này mới thay đổi thật.</span>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSetCurrentHocKy} isLoading={isSettingHocKy}>Đặt làm học kỳ hiện tại</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quản lý Năm học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500">Tạo năm học mới và sao chép danh sách lớp học, học kỳ từ năm học cũ.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tên năm học mới"
                  placeholder="VD: 2025-2026"
                  id="tenNamHocMoi"
                />
                <Input
                  label="Ngày bắt đầu"
                  type="date"
                  id="ngayBatDauNamHoc"
                />
                <Input
                  label="Ngày kết thúc"
                  type="date"
                  id="ngayKetThucNamHoc"
                />
                <Input
                  label="Nhân bản từ ID Năm học (Tuỳ chọn)"
                  type="number"
                  placeholder="VD: 1"
                  id="cloneTuNamHocId"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={async () => {
                  const tenNamHoc = (document.getElementById('tenNamHocMoi') as HTMLInputElement).value;
                  const ngayBatDau = (document.getElementById('ngayBatDauNamHoc') as HTMLInputElement).value;
                  const ngayKetThuc = (document.getElementById('ngayKetThucNamHoc') as HTMLInputElement).value;
                  const cloneTuNamHocId = (document.getElementById('cloneTuNamHocId') as HTMLInputElement).value;

                  if (!tenNamHoc || !ngayBatDau || !ngayKetThuc) {
                    toast.error('Vui lòng điền đủ Tên, Ngày Bắt Đầu và Ngày Kết Thúc');
                    return;
                  }
                  try {
                    await adminService.createNamHoc({
                      tenNamHoc, ngayBatDau, ngayKetThuc,
                      cloneTuNamHocId: cloneTuNamHocId ? Number(cloneTuNamHocId) : undefined
                    });
                    toast.success('Tạo năm học mới thành công!');
                    academicService.getNamHocs().then(setNamHocList).catch(() => {});
                  } catch (err: any) {
                    toast.error(err?.response?.data?.message || 'Có lỗi khi tạo năm học');
                  }
                }}>
                  Tạo Năm Học Mới
                </Button>
              </div>
            </CardContent>
          </Card>

          <NhanBanSachCard monHocList={monHocList} />
        </div>
      )}

      {activeTab === 'results' && <AdminKetQuaCuoiNam />}

      {/* Modal Thêm Môn Học */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Thêm Môn học mới</h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Tên Môn học"
                placeholder="VD: Tin học"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <div className="pt-2 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowSubjectModal(false)}>Hủy bỏ</Button>
                <Button onClick={handleAddSubject}>Thêm Môn</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NhanBanSachCard({ monHocList }: { monHocList: any[] }) {
  const [namHocList, setNamHocList] = useState<any[]>([]);
  const [monHocId, setMonHocId] = useState('');
  const [khoiLop, setKhoiLop] = useState('');

  const [namHocCuId, setNamHocCuId] = useState('');
  const [hocKyCuOptions, setHocKyCuOptions] = useState<any[]>([]);
  const [hocKyCuId, setHocKyCuId] = useState('');

  const [namHocMoiId, setNamHocMoiId] = useState('');
  const [hocKyMoiOptions, setHocKyMoiOptions] = useState<any[]>([]);
  const [hocKyMoiId, setHocKyMoiId] = useState('');

  const [kemCon, setKemCon] = useState(true);
  const [isCloning, setIsCloning] = useState(false);

  useEffect(() => {
    academicService.getNamHocs().then(setNamHocList).catch(() => setNamHocList([]));
  }, []);

  useEffect(() => {
    if (!namHocCuId) { setHocKyCuOptions([]); setHocKyCuId(''); return; }
    academicService.getHocKysByNamHoc(Number(namHocCuId)).then(setHocKyCuOptions).catch(() => setHocKyCuOptions([]));
    setHocKyCuId('');
  }, [namHocCuId]);

  useEffect(() => {
    if (!namHocMoiId) { setHocKyMoiOptions([]); setHocKyMoiId(''); return; }
    academicService.getHocKysByNamHoc(Number(namHocMoiId)).then(setHocKyMoiOptions).catch(() => setHocKyMoiOptions([]));
    setHocKyMoiId('');
  }, [namHocMoiId]);

  const handleClone = async () => {
    if (!monHocId || !khoiLop || !hocKyCuId || !hocKyMoiId) {
      toast.error('Vui lòng chọn đủ Môn học, Khối, Học kỳ nguồn và đích');
      return;
    }
    if (hocKyCuId === hocKyMoiId) {
      toast.error('Học kỳ nguồn và đích phải khác nhau');
      return;
    }
    setIsCloning(true);
    try {
      const params = {
        monHocId: Number(monHocId), khoiLop: Number(khoiLop),
        hocKyCuId: Number(hocKyCuId), hocKyMoiId: Number(hocKyMoiId),
      };
      if (kemCon) {
        await adminService.cloneSachKemChuDe(params);
      } else {
        await adminService.cloneSachKhongChuDe(params);
      }
      toast.success('Nhân bản sách thành công!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi khi nhân bản sách');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Copy className="w-4 h-4 mr-2 text-slate-500" /> Nhân bản sách sang năm học / học kỳ khác</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <p className="text-xs text-slate-500">Sao chép sách của 1 môn/khối từ một năm học - học kỳ NGUỒN sang một năm học - học kỳ ĐÍCH khác. Bản sao độc lập hoàn toàn với bản gốc.</p>

        <div className="grid grid-cols-2 gap-3">
          <select className="border border-slate-200 rounded-md text-sm px-2 py-1.5" value={monHocId} onChange={e => setMonHocId(e.target.value)}>
            <option value="">-- Môn học --</option>
            {monHocList.map(m => <option key={m.monHocId} value={m.monHocId}>{m.tenMon}</option>)}
          </select>
          <select className="border border-slate-200 rounded-md text-sm px-2 py-1.5" value={khoiLop} onChange={e => setKhoiLop(e.target.value)}>
            <option value="">-- Khối --</option>
            {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Khối {i + 1}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-md p-3 space-y-2">
            <p className="text-xs font-medium text-slate-600">Nguồn (sao chép từ)</p>
            <select className="border border-slate-200 rounded-md text-sm px-2 py-1.5 w-full" value={namHocCuId} onChange={e => setNamHocCuId(e.target.value)}>
              <option value="">-- Năm học nguồn --</option>
              {namHocList.map(nh => <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>)}
            </select>
            <select className="border border-slate-200 rounded-md text-sm px-2 py-1.5 w-full" value={hocKyCuId} onChange={e => setHocKyCuId(e.target.value)} disabled={!namHocCuId}>
              <option value="">-- Học kỳ nguồn --</option>
              {hocKyCuOptions.map((hk: any) => <option key={hk.hocKyId} value={hk.hocKyId}>Học kỳ {hk.soHocKy}</option>)}
            </select>
          </div>
          <div className="border border-slate-200 rounded-md p-3 space-y-2">
            <p className="text-xs font-medium text-slate-600">Đích (sao chép tới)</p>
            <select className="border border-slate-200 rounded-md text-sm px-2 py-1.5 w-full" value={namHocMoiId} onChange={e => setNamHocMoiId(e.target.value)}>
              <option value="">-- Năm học đích --</option>
              {namHocList.map(nh => <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>)}
            </select>
            <select className="border border-slate-200 rounded-md text-sm px-2 py-1.5 w-full" value={hocKyMoiId} onChange={e => setHocKyMoiId(e.target.value)} disabled={!namHocMoiId}>
              <option value="">-- Học kỳ đích --</option>
              {hocKyMoiOptions.map((hk: any) => <option key={hk.hocKyId} value={hk.hocKyId}>Học kỳ {hk.soHocKy}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={kemCon} onChange={() => setKemCon(true)} />
            Kèm cả Chủ đề - Bài học - Dạng bài
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={!kemCon} onChange={() => setKemCon(false)} />
            Chỉ nhân bản Sách
          </label>
        </div>

        <div className="flex justify-end">
          <Button size="sm" onClick={handleClone} isLoading={isCloning}>Nhân bản</Button>
        </div>
      </CardContent>
    </Card>
  );
}
