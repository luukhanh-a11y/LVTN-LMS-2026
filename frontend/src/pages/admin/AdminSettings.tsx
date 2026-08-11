import { useState, useEffect } from 'react';
import { Save, School, ShieldAlert, ToggleLeft, ToggleRight, BookOpen, Plus, Trash2, Edit2, AlertTriangle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import Button from '../../components/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

import { adminService } from '../../services/admin.service';
import { academicService, type NamHoc, type HocKy } from '../../services/academic.service';

type TabKey = 'general' | 'academic';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'Thông tin chung & Môn học' },
  { key: 'academic', label: 'Năm học & Học kỳ' },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  // State for mock UI parts
  const [settings, setSettings] = useState({
    schoolName: 'Trường Tiểu học & THCS Ngôi Sao',
    systemEmail: 'admin@school.edu.vn',
    maintenanceMode: false,
  });

  // State for academic tab (from old UI)
  const [config, setConfig] = useState<any>({
    cauHinhId: 1,
    hocKyHienTaiId: undefined as number | undefined,
  });
  const [namHocList, setNamHocList] = useState<NamHoc[]>([]);
  const [selectedNamHocIdForHocKy, setSelectedNamHocIdForHocKy] = useState<number | ''>('');
  const [hocKyOptions, setHocKyOptions] = useState<HocKy[]>([]);
  const [monHocList, setMonHocList] = useState<any[]>([]);
  const [isSettingHocKy, setIsSettingHocKy] = useState(false);

  useEffect(() => {
    fetchConfig();
    academicService.getNamHocs().then(setNamHocList).catch(() => setNamHocList([]));
    adminService.getMonHocList().then(setMonHocList).catch(() => setMonHocList([]));
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await adminService.getSystemConfig();
      if (data) {
        setConfig(data);
        if (data.tenTruong) {
          setSettings(prev => ({ ...prev, schoolName: data.tenTruong }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.updateSystemConfig({
        ...config,
        tenTruong: settings.schoolName,
      });
      toast.success('Đã lưu cấu hình hệ thống thành công!');
      fetchConfig();
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi lưu cấu hình');
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cấu hình Hệ thống</h2>
        <p className="text-sm text-slate-500 mt-1">Cài đặt các thông số cơ bản cho toàn trường.</p>
      </div>

      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl shadow-sm px-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`pb-3 pt-4 px-6 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === t.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="space-y-6">
          {/* THÔNG TIN CHUNG */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
              <School className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Thông tin chung</h3>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tên trường học</label>
                <input 
                  type="text" 
                  value={settings.schoolName}
                  onChange={e => setSettings({...settings, schoolName: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* QUẢN LÝ MÔN HỌC */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Quản lý Môn học</h3>
              </div>
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => toast('Chức năng đang phát triển', { icon: '🚧' })} 
              >
                Thêm môn
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {monHocList.map(sub => (
                  <div key={sub.monHocId} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-emerald-300 transition group bg-white shadow-sm hover:shadow-md">
                    <div>
                      <h4 className="font-bold text-slate-900">{sub.tenMonHoc || sub.tenMon}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">Mã môn: {sub.maMon}</p>
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors" onClick={() => toast('Chức năng đang phát triển')}><Edit2 className="w-4 h-4" /></button>
                      <button type="button" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors" onClick={() => toast('Chức năng đang phát triển')}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" leftIcon={<Save className="w-5 h-5" />}>
              Lưu Cấu Hình
            </Button>
          </div>
        </form>
      )}

      {activeTab === 'academic' && (
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
              <CardTitle className="text-slate-900 font-bold">Học kỳ hiện tại của hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Năm học</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Học kỳ</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
              <div className="flex items-start gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                <span className="leading-relaxed">Bấm "Đặt làm học kỳ hiện tại" sẽ đổi mặc định cho <strong>toàn bộ hệ thống</strong> (giáo viên/phụ huynh) ngay lập tức. Việc chỉ chọn năm học ở góc trên bên phải để xem lại dữ liệu cũ thì không ảnh hưởng gì — chỉ hành động này mới thay đổi thật.</span>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleSetCurrentHocKy} disabled={isSettingHocKy}>Đặt làm học kỳ hiện tại</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
              <CardTitle className="text-slate-900 font-bold">Quản lý Năm học</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <p className="text-sm text-slate-500">Tạo năm học mới và sao chép danh sách lớp học, học kỳ từ năm học cũ.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-slate-700">Tên năm học mới</label>
                  <input id="tenNamHocMoi" placeholder="VD: 2025-2026" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700">Nhân bản từ ID Năm học</label>
                  <input id="cloneTuNamHocId" type="number" placeholder="VD: 1 (Tuỳ chọn)" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700">Ngày bắt đầu</label>
                  <input id="ngayBatDauNamHoc" type="date" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700">Ngày kết thúc</label>
                  <input id="ngayKetThucNamHoc" type="date" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
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

          <NhanBanSachCard monHocList={monHocList} namHocList={namHocList} />
        </div>
      )}
    </div>
  );
}

function NhanBanSachCard({ monHocList, namHocList }: { monHocList: any[], namHocList: any[] }) {
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
    <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
        <CardTitle className="text-slate-900 font-bold flex items-center"><Copy className="w-5 h-5 mr-3 text-blue-600" /> Nhân bản sách sang năm học / học kỳ khác</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="text-sm text-slate-500">Sao chép sách của 1 môn/khối từ một năm học - học kỳ NGUỒN sang một năm học - học kỳ ĐÍCH khác. Bản sao độc lập hoàn toàn với bản gốc.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={monHocId} onChange={e => setMonHocId(e.target.value)}>
            <option value="">-- Môn học --</option>
            {monHocList.map(m => <option key={m.monHocId} value={m.monHocId}>{m.tenMon}</option>)}
          </select>
          <select className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={khoiLop} onChange={e => setKhoiLop(e.target.value)}>
            <option value="">-- Khối --</option>
            {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Khối {i + 1}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-700">Nguồn (sao chép từ)</h4>
            <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={namHocCuId} onChange={e => setNamHocCuId(e.target.value)}>
              <option value="">-- Năm học nguồn --</option>
              {namHocList.map(nh => <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>)}
            </select>
            <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={hocKyCuId} onChange={e => setHocKyCuId(e.target.value)} disabled={!namHocCuId}>
              <option value="">-- Học kỳ nguồn --</option>
              {hocKyCuOptions.map((hk: any) => <option key={hk.hocKyId} value={hk.hocKyId}>Học kỳ {hk.soHocKy}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-slate-700">Đích (sao chép tới)</h4>
            <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={namHocMoiId} onChange={e => setNamHocMoiId(e.target.value)}>
              <option value="">-- Năm học đích --</option>
              {namHocList.map(nh => <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>)}
            </select>
            <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={hocKyMoiId} onChange={e => setHocKyMoiId(e.target.value)} disabled={!namHocMoiId}>
              <option value="">-- Học kỳ đích --</option>
              {hocKyMoiOptions.map((hk: any) => <option key={hk.hocKyId} value={hk.hocKyId}>Học kỳ {hk.soHocKy}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" className="w-4 h-4 text-blue-600 focus:ring-blue-500" checked={kemCon} onChange={() => setKemCon(true)} />
            Kèm cả Chủ đề - Bài học - Dạng bài
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" className="w-4 h-4 text-blue-600 focus:ring-blue-500" checked={!kemCon} onChange={() => setKemCon(false)} />
            Chỉ nhân bản Sách
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleClone} disabled={isCloning}>Thực hiện Nhân bản</Button>
        </div>
      </CardContent>
    </Card>
  );
}
