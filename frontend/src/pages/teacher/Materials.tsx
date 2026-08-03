import { useEffect, useState } from 'react';
import { Search, Plus, Filter, FileText, Star, Puzzle, Loader2, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { teacherService, type Material, type BoSachContentItem } from '../../services/teacher.service';
import { useAuthStore } from '../../stores/useAuthStore';
import { GRADES } from '../../constants';

const TYPE_LABEL: Record<Material['type'], string> = {
  TAI_LIEU: 'Tài liệu',
  BAI_GIANG_H5P: 'Bài giảng H5P',
  BAI_TAP_H5P: 'Bài tập H5P',
};

function MaterialIcon({ type }: { type: Material['type'] }) {
  if (type === 'TAI_LIEU') {
    return (
      <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
        <FileText className="h-6 w-6 text-orange-600" />
      </div>
    );
  }
  return (
    <div className="h-12 w-12 rounded-lg bg-pro-primary/10 flex items-center justify-center mb-3">
      <Puzzle className="h-6 w-6 text-pro-primary" />
    </div>
  );
}

export default function TeacherMaterials() {
  const [activeTab, setActiveTab] = useState<'my-library' | 'shared-library'>('my-library');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [boSachItems, setBoSachItems] = useState<BoSachContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [boSachLoading, setBoSachLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boSachError, setBoSachError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.userId);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    teacherService
      .getMaterials()
      .then((data) => {
        if (!cancelled) setMaterials(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? 'Không tải được kho học liệu.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    setBoSachLoading(true);
    setBoSachError(null);
    teacherService
      .getThuVienGocLibrary()
      .then((data) => {
        if (!cancelled) setBoSachItems(data);
      })
      .catch((err) => {
        if (!cancelled) setBoSachError(err?.response?.data?.message ?? 'Không tải được thư viện gốc.');
      })
      .finally(() => {
        if (!cancelled) setBoSachLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const myLibrary = materials.filter((m) => m.origin === 'GIAO_VIEN_TAO' && m.teacherUserId === userId);
  const baseList = activeTab === 'my-library' ? myLibrary : [];
  const visibleList = baseList
    .filter((m) => gradeFilter === 'all' || m.grade === Number(gradeFilter))
    .filter((m) => !searchTerm.trim() || m.title.toLowerCase().includes(searchTerm.trim().toLowerCase()));

  const visibleBoSach = boSachItems
    .filter((it) => gradeFilter === 'all' || it.khoiLop === Number(gradeFilter))
    .filter((it) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (
        it.tenBaiHoc.toLowerCase().includes(q) ||
        it.tenChuDe.toLowerCase().includes(q) ||
        it.tenSach.toLowerCase().includes(q)
      );
    });

  const groupedBoSach = visibleBoSach.reduce<Record<string, Record<string, Record<string, BoSachContentItem[]>>>>(
    (acc, it) => {
      acc[it.tenSach] ??= {};
      acc[it.tenSach][it.tenChuDe] ??= {};
      acc[it.tenSach][it.tenChuDe][it.tenBaiHoc] ??= [];
      acc[it.tenSach][it.tenChuDe][it.tenBaiHoc].push(it);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Kho Học Liệu</h1>
        <div className="flex space-x-2">
          <Link to="/teacher/editor">
            <Button variant="pro-primary">
              <Star className="h-4 w-4 mr-2" />
              Soạn H5P mới
            </Button>
          </Link>
          <div>
            <input type="file" id="upload-material" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar" />
            <Button variant="outline" onClick={() => document.getElementById('upload-material')?.click()}>
              <Plus className="h-4 w-4 mr-2" />
              Tải lên File
            </Button>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my-library')}
          className={`pb-3 font-medium text-sm transition-colors relative ${
            activeTab === 'my-library' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Kho cá nhân của tôi
          {activeTab === 'my-library' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('shared-library')}
          className={`pb-3 font-medium text-sm transition-colors relative ${
            activeTab === 'shared-library' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Thư viện gốc (Kết nối tri thức)
          {activeTab === 'shared-library' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Tìm kiếm tài liệu, bài giảng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            className="px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary font-bold text-slate-700"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            {GRADES.map((g) => (
              <option key={g.value} value={g.value}>{g.value === 'all' ? 'Tất cả Khối' : g.label}</option>
            ))}
          </select>
        </div>
      </div>

      {activeTab === 'my-library' && (
        <>
          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Đang tải...
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && visibleList.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              Bạn chưa có học liệu nào. Bấm "Soạn H5P mới" để bắt đầu.
            </div>
          )}

          {!loading && !error && visibleList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleList.map((material) => (
                <Card
                  key={material.id}
                  className="hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/teacher/materials/${material.id}`)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center h-48">
                    <MaterialIcon type={material.type} />
                    <h3 className="font-bold text-slate-800 text-sm">{material.title}</h3>
                    <div className="mt-auto flex flex-wrap justify-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[material.type]}</Badge>
                      {material.grade && (
                        <Badge variant="outline" className="text-[10px]">Khối {material.grade}</Badge>
                      )}
                      {material.subjectName && (
                        <Badge variant="outline" className="text-[10px]">{material.subjectName}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'shared-library' && (
        <>
          {boSachLoading && (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Đang tải...
            </div>
          )}

          {!boSachLoading && boSachError && (
            <div className="text-center py-16 text-red-500 text-sm">{boSachError}</div>
          )}

          {!boSachLoading && !boSachError && Object.keys(groupedBoSach).length === 0 && (
            <div className="text-center py-16 text-slate-400">
              Không tìm thấy bài nào phù hợp bộ lọc.
            </div>
          )}

          {!boSachLoading && !boSachError && Object.keys(groupedBoSach).length > 0 && (
            <div className="space-y-8">
              {Object.entries(groupedBoSach).map(([tenSach, chuDeMap]) => (
                <div key={tenSach}>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-pro-primary" />
                    <h2 className="font-bold text-slate-800">{tenSach}</h2>
                  </div>
                  <div className="space-y-5 pl-2 border-l-2 border-slate-100">
                    {Object.entries(chuDeMap).map(([tenChuDe, baiHocMap]) => (
                      <div key={tenChuDe} className="pl-4">
                        <h3 className="text-sm font-semibold text-slate-600 mb-2">{tenChuDe}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(baiHocMap).map(([tenBaiHoc, items]) => (
                            <Card
                              key={tenBaiHoc}
                              className="border-slate-200/60 hover:border-primary/50 transition-colors cursor-pointer"
                              onClick={() => navigate(`/teacher/materials/bo-sach/${items[0].baiHocId}`)}
                            >
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-slate-800 text-sm mb-2">{tenBaiHoc}</h4>
                                <p className="text-xs text-slate-500">{items.length} mục · bấm để xem chi tiết</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
