import { useState, useEffect } from 'react';
import { Save, School, ShieldAlert, ToggleLeft, ToggleRight, BookOpen, Plus, Trash2, Edit2, AlertTriangle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import Button from '../../components/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

import { adminService } from '../../services/admin.service';
import { academicService, type NamHoc, type HocKy } from '../../services/academic.service';
import { useAcademicStore } from '../../stores/useAcademicStore';

type TabKey = 'general' | 'academic';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'Thông tin chung' },
  { key: 'academic', label: 'Năm học & Học kỳ' },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  // State for mock UI parts
  const [settings, setSettings] = useState({
    schoolName: 'Trường Tiểu học & THCS Ngôi Sao',
    systemEmail: 'admin@school.edu.vn',
    address: '123 Đường XYZ, TP. HCM',
    hotline: '0123456789',
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
  const [isSettingHocKy, setIsSettingHocKy] = useState(false);
  const [systemCurrentNamHocId, setSystemCurrentNamHocId] = useState<number | null>(null);

  useEffect(() => {
    fetchConfig();
    academicService.getNamHocs().then(setNamHocList).catch(() => setNamHocList([]));
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
      if (current) {
        setSelectedNamHocIdForHocKy(current.namHocId);
        setSystemCurrentNamHocId(current.namHocId);
      }
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
      
      const selectedNamHoc = namHocList.find(nh => nh.namHocId === selectedNamHocIdForHocKy);
      if (selectedNamHoc) {
        useAcademicStore.getState().setCurrentNamHoc(selectedNamHoc.tenNamHoc, selectedNamHoc.namHocId, selectedNamHoc.ngayBatDau);
      }
      useAcademicStore.getState().setCurrentHocKy(config.hocKyHienTaiId);
      
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
            <div className="p-6 space-y-6">
              <div className="flex gap-6 items-start flex-col sm:flex-row">
                <div className="space-y-2 shrink-0">
                  <label className="text-sm font-bold text-slate-700">Logo trường</label>
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-colors">
                    <span className="text-xs font-medium">Tải ảnh lên</span>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tên trường học</label>
                  <input 
                    type="text" 
                    value={settings.schoolName}
                    onChange={e => setSettings({...settings, schoolName: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email liên hệ</label>
                  <input 
                    type="email" 
                    value={settings.systemEmail}
                    onChange={e => setSettings({...settings, systemEmail: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Hotline</label>
                  <input 
                    type="tel" 
                    value={settings.hotline}
                    onChange={e => setSettings({...settings, hotline: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Địa chỉ</label>
                  <input 
                    type="text" 
                    value={settings.address}
                    onChange={e => setSettings({...settings, address: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
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
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5 flex flex-row items-center justify-between">
              <CardTitle className="text-slate-900 font-bold">Học kỳ hiện tại của hệ thống</CardTitle>
              {config.hocKyHienTaiId && (
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-green-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Đang diễn ra: {hocKyOptions.find(hk => hk.hocKyId === config.hocKyHienTaiId)?.soHocKy ? `Học kỳ ${hocKyOptions.find(hk => hk.hocKyId === config.hocKyHienTaiId)?.soHocKy}` : ''} - {namHocList.find(nh => nh.namHocId === selectedNamHocIdForHocKy)?.tenNamHoc}
                </div>
              )}
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
                    {hocKyOptions.filter(hk => hk.soHocKy !== 0).map((hk) => (
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
                  <label className="text-sm font-bold text-slate-700">Ngày bắt đầu</label>
                  <input id="ngayBatDauNamHoc" type="date" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700">Ngày kết thúc</label>
                  <input id="ngayKetThucNamHoc" type="date" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700">Sao chép cấu trúc từ năm học (Tùy chọn)</label>
                  <select id="cloneTuNamHocId" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">-- Không sao chép --</option>
                    {namHocList.map(nh => (
                      <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Sẽ copy toàn bộ Học kỳ và Lớp học (trống danh sách HS/GV) sang năm mới.</p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={async () => {
                  const tenNamHoc = (document.getElementById('tenNamHocMoi') as HTMLInputElement).value;
                  const ngayBatDau = (document.getElementById('ngayBatDauNamHoc') as HTMLInputElement).value;
                  const ngayKetThuc = (document.getElementById('ngayKetThucNamHoc') as HTMLInputElement).value;
                  const cloneIdStr = (document.getElementById('cloneTuNamHocId') as HTMLSelectElement).value;

                  if (!tenNamHoc || !ngayBatDau || !ngayKetThuc) {
                    toast.error('Vui lòng điền đủ Tên, Ngày Bắt Đầu và Ngày Kết Thúc');
                    return;
                  }
                  try {
                    await adminService.createNamHoc({
                      tenNamHoc, 
                      ngayBatDau, 
                      ngayKetThuc,
                      cloneTuNamHocId: cloneIdStr ? Number(cloneIdStr) : undefined
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

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Thêm Học kỳ cho Năm học</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-bold text-slate-700">Chọn Năm học</label>
                    <select id="namHocIdForHocKy" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white outline-none">
                      <option value="">-- Chọn năm học --</option>
                      {namHocList.map((nh) => (
                        <option key={nh.namHocId} value={nh.namHocId}>{nh.tenNamHoc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Số Học kỳ</label>
                    <select id="soHocKyMoi" className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white outline-none">
                      <option value="1">Học kỳ 1</option>
                      <option value="2">Học kỳ 2</option>
                      <option value="3">Học kỳ 3 (Hè)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={async () => {
                    const namHocId = (document.getElementById('namHocIdForHocKy') as HTMLSelectElement).value;
                    const soHocKy = (document.getElementById('soHocKyMoi') as HTMLSelectElement).value;
                    if (!namHocId) return toast.error('Vui lòng chọn năm học');
                    try {
                      await academicService.createHocKy({ namHocId: Number(namHocId), soHocKy: Number(soHocKy) });
                      toast.success(`Thêm Học kỳ ${soHocKy} thành công!`);
                      if (Number(namHocId) === selectedNamHocIdForHocKy) {
                        academicService.getHocKysByNamHoc(Number(namHocId)).then(setHocKyOptions).catch(() => {});
                      }
                    } catch (err: any) {
                      toast.error(err?.response?.data?.message || 'Có lỗi khi tạo học kỳ (có thể đã tồn tại)');
                    }
                  }}>
                    Thêm Học Kỳ
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Danh sách Năm học hiện có</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                        <th className="px-4 py-3 font-semibold">Tên Năm Học</th>
                        <th className="px-4 py-3 font-semibold">Thời gian</th>
                        <th className="px-4 py-3 font-semibold">Trạng thái</th>
                        <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {namHocList.map((nh) => {
                        return (
                          <tr key={nh.namHocId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-800">{nh.tenNamHoc}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {new Date(nh.ngayBatDau).toLocaleDateString('vi-VN')} - {new Date(nh.ngayKetThuc).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-4 py-3">
                              {nh.trangThai === 'HIEN_TAI' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  HIỆN TẠI
                                </span>
                              )}
                              {nh.trangThai === 'MOI' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                  SẮP TỚI
                                </span>
                              )}
                              {nh.trangThai === 'CU' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                  CŨ
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => toast('Chức năng đang phát triển')}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                                title="Sửa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {namHocList.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm">Chưa có năm học nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
