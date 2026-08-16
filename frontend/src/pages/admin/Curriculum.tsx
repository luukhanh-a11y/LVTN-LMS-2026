import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BookOpen, Layers, FileText, ChevronRight, ChevronDown, Plus, Pencil, Trash2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { adminService } from '../../services/admin.service';
import { classService } from '../../services/class.service';
import { CreateSachModal, CreateChuDeModal, CreateBaiHocModal } from './components/CurriculumForms';
import { academicService } from '../../services/academic.service';
import { Modal } from '../../components/ui/Modal';
import { useAcademicStore } from '../../stores/useAcademicStore';

const LOAI_SACH_LABEL: Record<string, string> = {
  SACH_GIAO_KHOA: 'Giáo khoa',
  SACH_BAI_TAP: 'Bài tập',
};

export default function AdminCurriculum({ isInsideTab = false }: { isInsideTab?: boolean }) {
  const navigate = useNavigate();
  const [monHocList, setMonHocList] = useState<any[]>([]);
  const [boSachList, setBoSachList] = useState<any[]>([]);
  const [chuongList, setChuongList] = useState<any[]>([]);
  const [baiHocList, setBaiHocList] = useState<any[]>([]);
  const [dangBaiList, setDangBaiList] = useState<any[]>([]);
  const { currentHocKyId, selectedNamHocId } = useAcademicStore();

  const [filterHocKy, setFilterHocKy] = useState<number | ''>('');
  const [hocKyList, setHocKyList] = useState<any[]>([]);
  const [filterKhoi, setFilterKhoi] = useState<number | ''>('');
  const [filterMon, setFilterMon] = useState<string>('');
  const [filterLoaiSach, setFilterLoaiSach] = useState<'' | 'SACH_GIAO_KHOA' | 'SACH_BAI_TAP'>('');

  const [showSachModal, setShowSachModal] = useState(false);
  const [showChuDeModal, setShowChuDeModal] = useState(false);
  const [showBaiHocModal, setShowBaiHocModal] = useState(false);
  const [editingSach, setEditingSach] = useState<any>(null);
  const [availableKhoi, setAvailableKhoi] = useState<number[]>([]);
  const [editingChuDe, setEditingChuDe] = useState<any>(null);
  const [editingBaiHoc, setEditingBaiHoc] = useState<any>(null);
  const [isCloningMode, setIsCloningMode] = useState(false);
  const [namHocList, setNamHocList] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const fetchHocKyId = filterHocKy === '' ? currentHocKyId : (filterHocKy === -1 ? null : filterHocKy);
      const [sach, chuong, baiHoc, dangBai, monHoc, classes] = await Promise.all([
        adminService.getBoSachList(fetchHocKyId as number | null),
        adminService.getChuongList(),
        adminService.getBaiHocList(),
        adminService.getDangBaiList(),
        adminService.getMonHocList(),
        classService.getAllClasses(),
      ]);
      
      let filteredSach = sach;
      if (fetchHocKyId === null) {
        const validHocKyIds = new Set(hocKyList.map(hk => hk.hocKyId));
        filteredSach = sach.filter((s: any) => validHocKyIds.has(s.hocKyId));
      } else {
        filteredSach = sach.filter((s: any) => s.hocKyId === fetchHocKyId);
      }
      
      setBoSachList(filteredSach);
      setChuongList(chuong);
      setBaiHocList(baiHoc);
      setDangBaiList(dangBai);
      setMonHocList(monHoc);
      
      const uniqueKhoi = Array.from(new Set(classes.map((c: any) => c.khoiLop))).sort((a: any, b: any) => a - b);
      setAvailableKhoi(uniqueKhoi as number[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { 
    if (selectedNamHocId) {
      academicService.getHocKysByNamHoc(selectedNamHocId)
        .then((hks) => {
          setHocKyList(hks);
          if (hks.length > 0) {
            if (filterHocKy === '' || !hks.find((hk: any) => hk.hocKyId === filterHocKy)) {
              const currentHk = hks.find((hk: any) => hk.hocKyId === currentHocKyId);
              setFilterHocKy(currentHk ? currentHk.hocKyId : hks[0].hocKyId);
            }
          } else {
            setFilterHocKy(-1);
          }
        })
        .catch(() => setHocKyList([]));
    } else {
      setHocKyList([]);
      setFilterHocKy(-1);
    }
  }, [selectedNamHocId, currentHocKyId]);

  useEffect(() => { 
    fetchData(); 
    academicService.getNamHocs().then(setNamHocList).catch(() => setNamHocList([]));
  }, [currentHocKyId, selectedNamHocId, filterHocKy]);

  const [selectedBoSach, setSelectedBoSach] = useState<number | null>(null);
  const [selectedChuong, setSelectedChuong] = useState<number | null>(null);
  const [selectedBaiHoc, setSelectedBaiHoc] = useState<number | null>(null);
  const [selectedDangBai, setSelectedDangBai] = useState<number | null>(null);

  const [expandedBoSach, setExpandedBoSach] = useState<number[]>([]);
  const [expandedChuong, setExpandedChuong] = useState<number[]>([]);

  const toggleBoSach = (id: number) => {
    setExpandedBoSach(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleChuong = (id: number) => {
    setExpandedChuong(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredBoSachList = boSachList.filter(sach => {
    const matchKhoi = filterKhoi === '' || sach.khoiLop === Number(filterKhoi);
    let matchMon = filterMon === '' || sach.maMon === filterMon;
    
    // Fallback cho trường hợp dữ liệu mock bị lệch mã môn (VD: sách "Mĩ Thuật 3" mã MI_THUAT nhưng môn "Mỹ thuật" mã MT)
    if (!matchMon && filterMon !== '') {
      const selectedMon = monHocList.find(m => m.maMon === filterMon);
      if (selectedMon) {
        const tenMonStr = selectedMon.tenMon.toLowerCase();
        const tenMonStrAlt = tenMonStr.replace('ỹ', 'ĩ'); // Xử lý Mỹ thuật / Mĩ thuật
        const sachTen = sach.tenSach ? sach.tenSach.toLowerCase() : '';
        const sachMa = sach.maMon ? sach.maMon.toLowerCase() : '';
        
        if (sachTen.includes(tenMonStr) || sachTen.includes(tenMonStrAlt) || 
            sachMa.includes(tenMonStr.replace(/\s+/g, '_')) || 
            sachMa.includes(tenMonStrAlt.replace(/\s+/g, '_')) ||
            (tenMonStr === 'mỹ thuật' && sachMa === 'mi_thuat')) {
          matchMon = true;
        }
      }
    }

    const matchLoai = filterLoaiSach === '' || sach.loaiSach === filterLoaiSach;
    return matchKhoi && matchMon && matchLoai;
  });

  const handleDeleteSach = async (sach: any) => {
    if (!window.confirm(`Xoá bộ sách "${sach.tenSach}"? Toàn bộ chương/bài học/dạng bài bên trong cũng bị xoá.`)) return;
    try {
      await adminService.deleteSach(sach.sachId);
      toast.success('Đã xoá thành công');
      fetchData();
    } catch {
      toast.error('Có lỗi xảy ra khi xoá');
    }
  };

  const handleDeleteChuDe = async (chuong: any) => {
    if (!window.confirm(`Xoá chương "${chuong.tenChuDe}"?`)) return;
    try {
      await adminService.deleteChuDe(chuong.chuDeId);
      toast.success('Đã xoá thành công');
      fetchData();
    } catch {
      toast.error('Có lỗi xảy ra khi xoá');
    }
  };

  const handleDeleteBaiHoc = async (bai: any) => {
    if (!window.confirm(`Xoá bài học "${bai.tenBaiHoc}"?`)) return;
    try {
      await adminService.deleteBaiHoc(bai.baiHocId);
      toast.success('Đã xoá thành công');
      if (selectedBaiHoc === bai.baiHocId) setSelectedBaiHoc(null);
      fetchData();
    } catch {
      toast.error('Có lỗi xảy ra khi xoá');
    }
  };

  if (isCloningMode) {
    return (
      <div className={cn("space-y-6", !isInsideTab && "animate-in fade-in")}>
        {!isInsideTab && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Chương trình học</h2>
              <p className="text-slate-500 mt-1">Quản lý và cập nhật kho tài liệu giảng dạy</p>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <Button variant="outline" size="sm" className="mb-4 text-slate-500 hover:text-slate-800" onClick={() => setIsCloningMode(false)}>
            Quay lại
          </Button>
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Copy className="w-5 h-5 mr-3 text-blue-600" /> Nhân bản sách
          </h3>
          <NhanBanSachForm monHocList={monHocList} namHocList={namHocList} onComplete={() => { setIsCloningMode(false); fetchData(); }} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", !isInsideTab && "animate-in fade-in")}>
      {!isInsideTab && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Chương trình học</h2>
            <p className="text-slate-500 mt-1">Quản lý và cập nhật kho tài liệu giảng dạy</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Cấu trúc Cây Chương trình học */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-700 flex justify-between items-center mb-3">
              <span>Sách</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsCloningMode(true)}><Copy className="w-3 h-3 mr-1" /> Nhân bản</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setEditingSach(null); setShowSachModal(true); }}><Plus className="w-3 h-3 mr-1" /> Bộ sách</Button>
              </div>
            </CardTitle>
            <div className="flex gap-2 mb-2">
              <select
                className="flex-1 h-8 text-xs border-slate-200 rounded-md bg-white text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterHocKy}
                onChange={(e) => setFilterHocKy(e.target.value ? Number(e.target.value) : -1)}
              >
                {hocKyList.length > 0 ? (
                  hocKyList.map(hk => (
                    <option key={hk.hocKyId} value={hk.hocKyId}>
                      {hk.soHocKy === 0 ? 'Cả năm (Dùng chung)' : `Học kỳ ${hk.soHocKy}`}
                    </option>
                  ))
                ) : (
                  <option value="">Không có học kỳ</option>
                )}
                <option value="-1">Tất cả trong năm</option>
              </select>
              <select
                className="flex-1 h-8 text-xs border-slate-200 rounded-md bg-white text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterKhoi}
                onChange={(e) => setFilterKhoi(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Tất cả Khối</option>
                {availableKhoi.map(k => (
                  <option key={k} value={k}>Khối {k}</option>
                ))}
              </select>
              <select
                className="flex-1 h-8 text-xs border-slate-200 rounded-md bg-white text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterMon}
                onChange={(e) => setFilterMon(e.target.value)}
              >
                <option value="">Tất cả Môn</option>
                {monHocList.map(m => (
                  <option key={m.monHocId} value={m.maMon}>{m.tenMon}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-1.5">
              {(['', 'SACH_GIAO_KHOA', 'SACH_BAI_TAP'] as const).map((v) => (
                <button
                  key={v}
                  className={`flex-1 h-7 text-[11px] font-medium rounded-md border ${filterLoaiSach === v ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'}`}
                  onClick={() => setFilterLoaiSach(v)}
                >
                  {v === '' ? 'Tất cả' : LOAI_SACH_LABEL[v]}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            <div className="p-2 space-y-1">
              {filteredBoSachList.map(sach => (
                <div key={sach.sachId} className="text-sm">
                  <div
                    className={`group flex items-center p-2 rounded-md cursor-pointer hover:bg-slate-100 ${selectedBoSach === sach.sachId ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'}`}
                    onClick={() => {
                      setSelectedBoSach(sach.sachId);
                      toggleBoSach(sach.sachId);
                    }}
                  >
                    <span className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400">
                      {expandedBoSach.includes(sach.sachId) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                    <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                    <span className="truncate flex-1">{sach.tenSach}</span>
                    <span className="text-[10px] text-slate-400 mr-1">{LOAI_SACH_LABEL[sach.loaiSach] ?? sach.loaiSach}</span>
                    <span className="hidden group-hover:flex items-center gap-1 shrink-0">
                      <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600" onClick={(e) => { e.stopPropagation(); setEditingSach(sach); setShowSachModal(true); }} />
                      <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteSach(sach); }} />
                    </span>
                  </div>

                  {expandedBoSach.includes(sach.sachId) && (
                    <div className="ml-6 border-l border-slate-200 pl-2 mt-1 space-y-1">
                      {chuongList.filter(c => c.sachId === sach.sachId).map(chuong => (
                        <div key={chuong.chuDeId}>
                          <div
                            className={`group flex items-center p-1.5 rounded-md cursor-pointer hover:bg-slate-100 ${selectedChuong === chuong.chuDeId ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedChuong(chuong.chuDeId);
                              toggleChuong(chuong.chuDeId);
                            }}
                          >
                            <span className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400">
                              {expandedChuong.includes(chuong.chuDeId) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                            <Layers className="w-3.5 h-3.5 mr-2 text-blue-500" />
                            <span className="truncate flex-1">{chuong.tenChuDe}</span>
                            <span className="hidden group-hover:flex items-center gap-1 shrink-0">
                              <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600" onClick={(e) => { e.stopPropagation(); setSelectedBoSach(sach.sachId); setEditingChuDe(chuong); setShowChuDeModal(true); }} />
                              <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteChuDe(chuong); }} />
                            </span>
                          </div>

                          {expandedChuong.includes(chuong.chuDeId) && (
                            <div className="ml-6 border-l border-slate-200 pl-2 mt-1 space-y-1">
                              {baiHocList.filter(b => b.chuDeId === chuong.chuDeId).map(bai => (
                                <div
                                  key={bai.baiHocId}
                                  className={`group flex items-center p-1.5 rounded-md cursor-pointer hover:bg-slate-100 ${selectedBaiHoc === bai.baiHocId ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-600'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBaiHoc(bai.baiHocId);
                                    setSelectedDangBai(null);
                                  }}
                                >
                                  <FileText className="w-3.5 h-3.5 mr-2 text-amber-500 ml-5" />
                                  <span className="truncate flex-1">{bai.tenBaiHoc}</span>
                                  <span className="hidden group-hover:flex items-center gap-1 shrink-0">
                                    <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600" onClick={(e) => { e.stopPropagation(); setSelectedChuong(chuong.chuDeId); setEditingBaiHoc(bai); setShowBaiHocModal(true); }} />
                                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteBaiHoc(bai); }} />
                                  </span>
                                </div>
                              ))}
                              <Button variant="ghost" size="sm" className="h-6 text-[11px] text-slate-400 ml-4 w-full justify-start hover:text-slate-600" onClick={(e) => { e.stopPropagation(); setSelectedChuong(chuong.chuDeId); setEditingBaiHoc(null); setShowBaiHocModal(true); }}>
                                <Plus className="w-3 h-3 mr-1" /> Thêm Bài học
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="h-6 text-[11px] text-slate-400 ml-4 w-full justify-start hover:text-slate-600" onClick={(e) => { e.stopPropagation(); setSelectedBoSach(sach.sachId); setEditingChuDe(null); setShowChuDeModal(true); }}>
                        <Plus className="w-3 h-3 mr-1" /> Thêm Chương
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {filteredBoSachList.length === 0 && (
                <p className="text-sm text-slate-400 italic p-3">Không có sách nào khớp bộ lọc.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cột 2-3: Kho Bài tập & Nhân bản sách */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBaiHoc ? (
            <>
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50 flex flex-row justify-between items-center">
                  <CardTitle className="text-base font-semibold text-slate-700">
                    Kho Bài tập (Games)
                  </CardTitle>
                  <Button size="sm" onClick={() => navigate(`/admin/curriculum/games/new/${selectedBaiHoc}`)}>
                    <Plus className="w-4 h-4 mr-1" /> Tạo Bài mới
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-3">
                    {dangBaiList.filter(d => d.baiHocId === selectedBaiHoc).map(dangBai => {
                      let parsedDuLieu;
                      try { parsedDuLieu = dangBai.duLieuGame ? JSON.parse(dangBai.duLieuGame) : {}; } catch (e) { parsedDuLieu = {}; }

                      const typeLabelMap: Record<string, string> = {
                        TRAC_NGHIEM: 'Trắc nghiệm',
                        NOI_CAP: 'Nối cặp / Phân loại',
                        DIEN_KHUYET: 'Điền khuyết',
                        LY_THUYET: 'Lý thuyết',
                        TU_LUAN: 'Tự luận'
                      };
                      const rawType = parsedDuLieu?.loai || dangBai.loaiNoiDung;
                      const displayType = typeLabelMap[rawType] || rawType;

                      return (
                        <div
                          key={dangBai.dangBaiId}
                          onClick={() => navigate(`/admin/curriculum/games/edit/${dangBai.dangBaiId}`)}
                          className={`p-3 border rounded-xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all ${selectedDangBai === dangBai.dangBaiId ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-200' : 'border-slate-200 bg-white'}`}
                        >
                          <div className="font-semibold text-sm text-slate-800">{dangBai.tenDangBai}</div>
                          <div className="text-xs text-slate-500 mt-1">Dạng: {displayType}</div>
                        </div>
                      )
                    })}
                    {dangBaiList.filter(d => d.baiHocId === selectedBaiHoc).length === 0 && (
                      <div className="text-sm text-slate-500 italic py-2">Chưa có bài tập nào cho bài học này.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-sm border-slate-200 min-h-[300px] flex items-center justify-center bg-slate-50/50 border-dashed">
              <div className="text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Chọn một Bài học từ Cây Học liệu để quản lý Bài tập / Games</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <CreateSachModal isOpen={showSachModal} onClose={() => setShowSachModal(false)} onSuccess={() => { setShowSachModal(false); fetchData(); }} monHocList={monHocList} initialData={editingSach} />
      {selectedBoSach && <CreateChuDeModal isOpen={showChuDeModal} onClose={() => setShowChuDeModal(false)} onSuccess={() => { setShowChuDeModal(false); fetchData(); if (!expandedBoSach.includes(selectedBoSach)) toggleBoSach(selectedBoSach); }} sachId={selectedBoSach} tenSach={boSachList.find(b => b.sachId === selectedBoSach)?.tenSach} initialData={editingChuDe} />}
      {selectedChuong && <CreateBaiHocModal isOpen={showBaiHocModal} onClose={() => setShowBaiHocModal(false)} onSuccess={() => { setShowBaiHocModal(false); fetchData(); if (!expandedChuong.includes(selectedChuong)) toggleChuong(selectedChuong); }} chuDeId={selectedChuong} tenChuDe={chuongList.find(c => c.chuDeId === selectedChuong)?.tenChuDe} initialData={editingBaiHoc} />}


    </div>
  );
}

function NhanBanSachForm({ monHocList, namHocList, onComplete }: { monHocList: any[], namHocList: any[], onComplete: () => void }) {
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
      onComplete();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi khi nhân bản sách');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-6 space-y-6">
        <p className="text-sm text-slate-500">Sao chép sách của 1 môn/khối từ một năm học - học kỳ NGUỒN sang một năm học - học kỳ ĐÍCH khác. Bản sao độc lập hoàn toàn với bản gốc.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={monHocId} onChange={e => setMonHocId(e.target.value)}>
            <option value="">-- Môn học --</option>
            {monHocList.map(m => <option key={m.monHocId} value={m.monHocId}>{m.tenMon || m.tenMonHoc}</option>)}
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
      </div>
      <div className="pt-4 flex justify-end">
        <Button onClick={handleClone} disabled={isCloning} leftIcon={<Copy className="w-4 h-4" />}>
          {isCloning ? 'Đang xử lý...' : 'Thực hiện Nhân bản'}
        </Button>
      </div>
    </div>
  );
}
