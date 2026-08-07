import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader2, BookOpen, Layers, FileText, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import GameAuthoringForm from './components/GameAuthoringForm';

export default function AdminCurriculum() {
  const [isLoading, setIsLoading] = useState(false);
  
  const [monHocList, setMonHocList] = useState<any[]>([]);
  const [boSachList, setBoSachList] = useState<any[]>([]);
  const [chuongList, setChuongList] = useState<any[]>([]);
  const [baiHocList, setBaiHocList] = useState<any[]>([]);
  const [dangBaiList, setDangBaiList] = useState<any[]>([]);

  const [filterKhoi, setFilterKhoi] = useState<number | ''>('');
  const [filterMon, setFilterMon] = useState<number | ''>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

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
    return matchKhoi && matchMon;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Chương trình học & Kho Bài tập</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Cấu trúc Cây Chương trình học */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200 h-[calc(100vh-140px)] flex flex-col">
          <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-700 flex justify-between items-center mb-3">
              <span>Sách</span>
              <Button size="sm" variant="outline" className="h-7 text-xs"><Plus className="w-3 h-3 mr-1"/> Bộ sách</Button>
            </CardTitle>
            <div className="flex gap-2">
              <select 
                className="flex-1 h-8 text-xs border-slate-200 rounded-md bg-white text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterKhoi}
                onChange={(e) => setFilterKhoi(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Tất cả Khối</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>Khối {i+1}</option>
                ))}
              </select>
              <select 
                className="flex-1 h-8 text-xs border-slate-200 rounded-md bg-white text-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterMon}
                onChange={(e) => setFilterMon(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Tất cả Môn</option>
                {monHocList.map(m => (
                  <option key={m.monHocId} value={m.monHocId}>{m.tenMonHoc}</option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            <div className="p-2 space-y-1">
              {filteredBoSachList.map(sach => (
                <div key={sach.sachId} className="text-sm">
                  <div 
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-slate-100 ${selectedBoSach === sach.sachId ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'}`}
                    onClick={() => {
                      setSelectedBoSach(sach.sachId);
                      toggleBoSach(sach.sachId);
                    }}
                  >
                    <span className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400">
                      {expandedBoSach.includes(sach.sachId) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                    <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                    <span className="truncate">{sach.tenSach}</span>
                  </div>

                  {expandedBoSach.includes(sach.sachId) && (
                    <div className="ml-6 border-l border-slate-200 pl-2 mt-1 space-y-1">
                      {chuongList.filter(c => c.sachId === sach.sachId).map(chuong => (
                        <div key={chuong.chuDeId}>
                          <div 
                            className={`flex items-center p-1.5 rounded-md cursor-pointer hover:bg-slate-100 ${selectedChuong === chuong.chuDeId ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600'}`}
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
                            <span className="truncate">{chuong.tenChuDe}</span>
                          </div>

                          {expandedChuong.includes(chuong.chuDeId) && (
                            <div className="ml-6 border-l border-slate-200 pl-2 mt-1 space-y-1">
                              {baiHocList.filter(b => b.chuDeId === chuong.chuDeId).map(bai => (
                                <div 
                                  key={bai.baiHocId}
                                  className={`flex items-center p-1.5 rounded-md cursor-pointer hover:bg-slate-100 ${selectedBaiHoc === bai.baiHocId ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-600'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBaiHoc(bai.baiHocId);
                                    setSelectedDangBai(null);
                                  }}
                                >
                                  <FileText className="w-3.5 h-3.5 mr-2 text-amber-500 ml-5" />
                                  <span className="truncate">{bai.tenBaiHoc}</span>
                                </div>
                              ))}
                              <Button variant="ghost" size="sm" className="h-6 text-[11px] text-slate-400 ml-4 w-full justify-start hover:text-slate-600">
                                <Plus className="w-3 h-3 mr-1" /> Thêm Bài học
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="h-6 text-[11px] text-slate-400 ml-4 w-full justify-start hover:text-slate-600">
                        <Plus className="w-3 h-3 mr-1" /> Thêm Chương
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cột 2: Danh sách Dạng Bài & Cột 3: Form GameAuthoring */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBaiHoc ? (
            <>
              {/* Danh sách Dạng bài của Bài học */}
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
                      try { parsedDuLieu = dangBai.duLieuGame ? JSON.parse(dangBai.duLieuGame) : {}; } catch(e) { parsedDuLieu = {}; }
                      
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
                    )})}
                    {dangBaiList.filter(d => d.baiHocId === selectedBaiHoc).length === 0 && (
                      <div className="text-sm text-slate-500 italic py-2">Chưa có bài tập nào cho bài học này.</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Form chỉnh sửa Dạng bài */}
              {selectedDangBai !== null && (
                <GameAuthoringForm 
                  key={selectedDangBai} // Force re-render when changing selected DangBai
                  dangBaiId={selectedDangBai} 
                  baiHocId={selectedBaiHoc}
                  onSaveSuccess={() => {
                    // Refresh data
                    fetchData();
                    setSelectedDangBai(null);
                  }}
                  onCancel={() => setSelectedDangBai(null)}
                />
              )}
            </>
          ) : (
            <Card className="shadow-sm border-slate-200 h-full min-h-[400px] flex items-center justify-center bg-slate-50/50 border-dashed">
              <div className="text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Chọn một Bài học từ Cây Học liệu để quản lý Bài tập / Games</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
