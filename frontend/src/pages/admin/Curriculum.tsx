import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BookOpen, Layers, FileText, ChevronRight, ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';
import GameAuthoringForm from './components/GameAuthoringForm';
import { CreateSachModal, CreateChuDeModal, CreateBaiHocModal } from './components/CurriculumForms';

const LOAI_SACH_LABEL: Record<string, string> = {
  SACH_GIAO_KHOA: 'Giáo khoa',
  SACH_BAI_TAP: 'Bài tập',
};

export default function AdminCurriculum() {
  const [monHocList, setMonHocList] = useState<any[]>([]);
  const [boSachList, setBoSachList] = useState<any[]>([]);
  const [chuongList, setChuongList] = useState<any[]>([]);
  const [baiHocList, setBaiHocList] = useState<any[]>([]);
  const [dangBaiList, setDangBaiList] = useState<any[]>([]);

  const [filterKhoi, setFilterKhoi] = useState<number | ''>('');
  const [filterMon, setFilterMon] = useState<number | ''>('');
  const [filterLoaiSach, setFilterLoaiSach] = useState<'' | 'SACH_GIAO_KHOA' | 'SACH_BAI_TAP'>('');

  const [showSachModal, setShowSachModal] = useState(false);
  const [showChuDeModal, setShowChuDeModal] = useState(false);
  const [showBaiHocModal, setShowBaiHocModal] = useState(false);
  const [editingSach, setEditingSach] = useState<any>(null);
  const [editingChuDe, setEditingChuDe] = useState<any>(null);
  const [editingBaiHoc, setEditingBaiHoc] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [sach, chuong, baiHoc, dangBai, monHoc] = await Promise.all([
        adminService.getBoSachList(),
        adminService.getChuongList(),
        adminService.getBaiHocList(),
        adminService.getDangBaiList(),
        adminService.getMonHocList()
      ]);
      setBoSachList(sach);
      setChuongList(chuong);
      setBaiHocList(baiHoc);
      setDangBaiList(dangBai);
      setMonHocList(monHoc);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
    const matchMon = filterMon === '' || sach.monHocId === Number(filterMon);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Chương trình học & Kho Bài tập</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Cấu trúc Cây Chương trình học */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-700 flex justify-between items-center mb-3">
              <span>Sách</span>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setEditingSach(null); setShowSachModal(true); }}><Plus className="w-3 h-3 mr-1" /> Bộ sách</Button>
            </CardTitle>
            <div className="flex gap-2 mb-2">
              <select
                className="flex-1 h-8 text-xs border-slate-200 rounded-md bg-white text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterKhoi}
                onChange={(e) => setFilterKhoi(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Tất cả Khối</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Khối {i + 1}</option>
                ))}
              </select>
              <select
                className="flex-1 h-8 text-xs border-slate-200 rounded-md bg-white text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterMon}
                onChange={(e) => setFilterMon(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Tất cả Môn</option>
                {monHocList.map(m => (
                  <option key={m.monHocId} value={m.monHocId}>{m.tenMon}</option>
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
                  <Button size="sm" onClick={() => setSelectedDangBai(0)}>
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
                          onClick={() => setSelectedDangBai(dangBai.dangBaiId)}
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

              {selectedDangBai !== null && (
                <GameAuthoringForm
                  key={selectedDangBai}
                  dangBaiId={selectedDangBai}
                  baiHocId={selectedBaiHoc}
                  onSaveSuccess={() => {
                    fetchData();
                    setSelectedDangBai(null);
                  }}
                  onCancel={() => setSelectedDangBai(null)}
                />
              )}
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
      {selectedBoSach && <CreateChuDeModal isOpen={showChuDeModal} onClose={() => setShowChuDeModal(false)} onSuccess={() => { setShowChuDeModal(false); fetchData(); if (!expandedBoSach.includes(selectedBoSach)) toggleBoSach(selectedBoSach); }} sachId={selectedBoSach} initialData={editingChuDe} />}
      {selectedChuong && <CreateBaiHocModal isOpen={showBaiHocModal} onClose={() => setShowBaiHocModal(false)} onSuccess={() => { setShowBaiHocModal(false); fetchData(); if (!expandedChuong.includes(selectedChuong)) toggleChuong(selectedChuong); }} chuDeId={selectedChuong} initialData={editingBaiHoc} />}
    </div>
  );
}
