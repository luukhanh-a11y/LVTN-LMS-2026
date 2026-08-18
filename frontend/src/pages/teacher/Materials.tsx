import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Library, Search, BookOpen, Layers, LayoutTemplate, HelpCircle, PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { teacherService } from '../../services/teacher.service';
import { useAcademicStore } from '../../stores/useAcademicStore';
import QuizForm from '../../components/student/QuizForm';
import NoiCapForm from '../../components/student/NoiCapForm';
import TuLuanForm from '../../components/student/TuLuanForm';
import LyThuyetForm from '../../components/student/LyThuyetForm';

export default function Materials() {
  const currentHocKyId = useAcademicStore(state => state.currentHocKyId);

  const [classes, setClasses] = useState<any[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    teacherService.getClasses({ onlyTeaching: true }).then(data => {
      setClasses(data);
      const uniqueGrades = Array.from(new Set(data.map((c: any) => c.grade))).sort();
      setGrades(uniqueGrades);
      if (uniqueGrades.length > 0) setSelectedGrade(uniqueGrades[0]);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedGrade) {
      setBooks([]);
      setSelectedBook(null);
      return;
    }

    // Lấy tất cả các lớp thuộc Khối đang chọn
    const classesInGrade = classes.filter(c => c.grade === selectedGrade);

    // Gom tất cả các môn học mà giáo viên dạy trong toàn bộ các lớp của Khối này
    const subjectsMap = new Map();
    classesInGrade.forEach(c => {
      c.monHocList?.forEach((subj: any) => {
        // Lưu lại kèm theo 1 lopHocId bất kỳ mà giáo viên có dạy môn này ở khối đó
        // (để API getSachBaiTapTheoPhanCong có tham số lopHocId hợp lệ)
        if (!subjectsMap.has(subj.monHocId)) {
          subjectsMap.set(subj.monHocId, { ...subj, lopHocId: c.id });
        }
      });
    });

    const subjects = Array.from(subjectsMap.values());

    if (subjects.length === 0) {
      setBooks([]);
      setSelectedBook(null);
      return;
    }

    teacherService.getMyTeacherProfile().then(profile => {
      const promises = subjects.map((subj: any) =>
        teacherService.getSachBaiTapTheoPhanCong({
          giaoVienId: profile.giaoVienId,
          lopHocId: subj.lopHocId,
          maMon: subj.maMon || '',
          hocKyId: subj.hocKyId || currentHocKyId || 1 // Fallback to 1
        }).catch(err => {
          // Bỏ qua lỗi 404 (DATA_NOT_FOUND) nếu giáo viên không có phân công hoặc môn đó không có sách
          console.warn(`Không tìm thấy sách cho môn ${subj.tenMon} (Mã: ${subj.monHocId})`);
          return [];
        })
      );
      return Promise.all(promises);
    }).then(results => {
      const allBooks = results.flat();

      // Loại bỏ các sách trùng lặp (vì 1 sách có thể được fetch nhiều lần nếu có nhiều lớp học cùng môn)
      const uniqueBooks = Array.from(new Map(allBooks.map(b => [b.sachId || b.id, b])).values());

      // API dùng chung với CreateAssignment.tsx (vốn cần cả SGK lẫn SBT để hiện SGK dạng
      // disabled) nên trả về cả 2 loại — ở đây "Kho học liệu" của giáo viên chỉ quản lý/tạo
      // nội dung dựa trên Sách bài tập, SGK là nội dung hệ thống cố định, không thuộc phạm vi
      // này nên lọc bỏ ngay tại đây, không đụng tới API dùng chung.
      const sbtBooks = uniqueBooks.filter(b => b.loaiSach !== 'SACH_GIAO_KHOA');

      setBooks(sbtBooks);
      if (sbtBooks.length > 0) setSelectedBook(sbtBooks[0].sachId || sbtBooks[0].id);
      else setSelectedBook(null);
    }).catch(console.error);
  }, [selectedGrade, classes, currentHocKyId]);

  useEffect(() => {
    if (!selectedBook) {
      setTopics([]);
      setSelectedTopic(null);
      return;
    }
    teacherService.getChuDeBySach(selectedBook).then(data => {
      setTopics(data);
      if (data.length > 0) setSelectedTopic(data[0].chuDeId || data[0].id);
      else setSelectedTopic(null);
    }).catch(console.error);
  }, [selectedBook]);

  useEffect(() => {
    if (!selectedTopic) {
      setLessons([]);
      setSelectedLesson(null);
      return;
    }
    teacherService.getBaiHocByChuDe(selectedTopic).then(data => {
      setLessons(data);
      if (data.length > 0) setSelectedLesson(data[0].baiHocId || data[0].id);
      else setSelectedLesson(null);
    }).catch(console.error);
  }, [selectedTopic]);

  useEffect(() => {
    if (!selectedLesson) {
      setMaterials([]);
      return;
    }
    setLoading(true);
    let cancelled = false;

    Promise.all([
      teacherService.getDangBaiByBaiHoc(selectedLesson),
      teacherService.getMyTeacherProfile().then(profile => teacherService.getMyMaterials(profile.giaoVienId))
    ])
      .then(([heThongData, cuaToiData]) => {
        if (cancelled) return;
        const filteredCuaToi = cuaToiData.filter((m: any) => Number(m.baiHocId) === Number(selectedLesson) && m.nguonGoc === 'GIAO_VIEN_BO_SUNG');

        // Combine and prevent duplicates just in case
        const existingIds = new Set(heThongData.map((m: any) => m.dangBaiId || m.id));
        const additionalMaterials = filteredCuaToi.filter((m: any) => !existingIds.has(m.dangBaiId || m.id));

        setMaterials([...heThongData, ...additionalMaterials]);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [selectedLesson]);

  const filteredMaterials = materials.filter(m => {
    const title = (m.tenDangBai || m.content || '').toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'TRAC_NGHIEM': return <HelpCircle className="w-5 h-5 text-blue-500" />;
      case 'NOI_CAP': return <Layers className="w-5 h-5 text-purple-500" />;
      case 'TU_LUAN': return <BookOpen className="w-5 h-5 text-orange-500" />;
      default: return <HelpCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  // Render preview sống bằng đúng component học sinh dùng thật (giống cách Admin xem
  // trước bài giảng ở AdminGameAuthoringWorkspace.tsx) thay vì dump chuỗi JSON thô —
  // giáo viên thấy ngay câu hỏi/lựa chọn/hình ảnh được trình bày đẹp và đáp án đúng
  // được tô sáng, không cần tự đọc JSON.
  const renderMaterialPreview = (cauHinh: any, dapAnChuan: any) => {
    const loai = cauHinh?.loai || 'LY_THUYET';
    // Ép giao diện mặc định cho preview — các giao diện game hoá (DAO_VANG, TRIEU_PHU...)
    // không phù hợp hiển thị thu gọn trong 1 thẻ danh sách.
    const previewCauHinh = { ...cauHinh, giaoDien: 'MAC_DINH' };
    // QuizForm/NoiCapForm chỉ tô sáng đáp án đúng khi có "result" (mô phỏng đã làm bài
    // đúng) — không phải chỉ cần prop dapAnChuan suông. Với TU_LUAN/LY_THUYET thì để
    // result = null vì không có khái niệm "đáp án đúng" cần tô sáng.
    const revealResult = dapAnChuan ? { dapAnChuan, diem: 10 } : null;
    const commonProps = {
      loai,
      cauHinh: previewCauHinh,
      dapAnChuan,
      onSubmit: () => {},
      submitting: false,
    };

    if (loai === 'TRAC_NGHIEM' || loai === 'DIEN_KHUYET') {
      return <QuizForm {...commonProps} result={revealResult} />;
    }
    if (loai === 'NOI_CAP') {
      return <NoiCapForm {...commonProps} result={revealResult} />;
    }
    if (loai === 'TU_LUAN') {
      return <TuLuanForm {...commonProps} result={null} />;
    }
    if (loai === 'LY_THUYET') {
      return <LyThuyetForm cauHinh={previewCauHinh} />;
    }
    return <div className="text-sm text-slate-500 py-4">Chưa hỗ trợ xem trước cho dạng {loai}.</div>;
  };

  // Card học liệu dùng chung cho cả tab "Kho học liệu" (theo cây sách) và tab
  // "Học liệu của tôi" (liệt kê trực tiếp, không cần duyệt sách).
  const renderMaterialCard = (m: any, idx: number) => {
    let cauHinh: any = {};
    let dapAnChuan: any = null;
    try {
      if (m.duLieuGame) cauHinh = JSON.parse(m.duLieuGame);
      if (m.dapAnChuan) dapAnChuan = JSON.parse(m.dapAnChuan);
    } catch { }

    return (
      <Link to={`/teacher/materials/library/${m.dangBaiId || m.id}`} key={m.dangBaiId || m.id} className="block border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white shadow-sm cursor-pointer group">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">{getQuestionIcon(m.loaiNoiDung || 'TRAC_NGHIEM')}</div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-bold text-slate-700 text-sm">Học liệu {idx + 1}</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded">{m.loaiNoiDung || 'N/A'}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded">XP: {m.xpThuong || 0}</span>
                {m.tenBaiHoc && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded">Bài: {m.tenBaiHoc}</span>
                )}
              </div>
              <p className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors mb-2">{m.tenDangBai || m.content}</p>
            </div>
          </div>
        </div>

        {/* Preview chi tiết câu hỏi/đáp án — stopPropagation để bấm chọn đáp án bên trong
            không vô tình kích hoạt điều hướng của thẻ <Link> bao ngoài. */}
        {m.loaiNoiDung === 'H5P' ? (
          <p className="text-purple-700 font-medium text-sm pl-1">🎮 Nội dung tương tác H5P — bấm để xem chi tiết.</p>
        ) : (
          <div
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 max-h-[420px] overflow-y-auto [&_button[type='submit']]:!hidden"
          >
            {renderMaterialPreview(cauHinh, dapAnChuan)}
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Library className="w-6 h-6 text-blue-600" /> Quản lý Học liệu
          </h2>
          <p className="text-sm text-slate-500 mt-1">Tra cứu ngân hàng câu hỏi, bài giảng và thư viện nội dung hệ thống.</p>
        </div>
        <Link to="/teacher/editor" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-sm cursor-pointer">
          <PlusCircle className="w-5 h-5" /> Tạo bài giảng H5P
        </Link>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex overflow-hidden">

        {/* Sidebar Bộ lọc */}
        <div className="w-80 border-r border-slate-200 bg-slate-50 p-6 flex flex-col gap-6 overflow-y-auto">

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">1. Khối</label>
            <select
              value={selectedGrade || ''}
              onChange={(e) => setSelectedGrade(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {grades.map(g => <option key={g} value={g}>Khối {g}</option>)}
              {grades.length === 0 && <option value="">Đang tải...</option>}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">2. Sách bài tập</label>
            <select
              value={selectedBook || ''}
              onChange={(e) => setSelectedBook(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {books.map(b => <option key={b.sachId || b.id} value={b.sachId || b.id}>{b.tenSach || b.name}</option>)}
              {books.length === 0 && <option value="">Không có sách</option>}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">3. Chủ đề</label>
            <div className="flex flex-col gap-2">
              {topics.map(t => (
                <button
                  key={t.chuDeId || t.id}
                  type="button"
                  onClick={() => setSelectedTopic(t.chuDeId || t.id)}
                  className={cn("px-3 py-2.5 text-sm font-medium rounded-lg text-left transition cursor-pointer",
                    selectedTopic === (t.chuDeId || t.id) ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {t.tenChuDe || t.name}
                </button>
              ))}
              {topics.length === 0 && <div className="text-sm text-slate-500">Chưa có chủ đề</div>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">4. Bài học</label>
            <div className="flex flex-col gap-2">
              {lessons.map(l => (
                <button
                  key={l.baiHocId || l.id}
                  type="button"
                  onClick={() => setSelectedLesson(l.baiHocId || l.id)}
                  className={cn("px-3 py-2.5 text-sm font-medium rounded-lg text-left transition cursor-pointer",
                    selectedLesson === (l.baiHocId || l.id) ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {l.tenBaiHoc || l.name}
                </button>
              ))}
              {lessons.length === 0 && <div className="text-sm text-slate-500">Chưa có bài học</div>}
            </div>
          </div>

        </div>

        {/* Khung nội dung */}
        {/* min-w-0: bắt buộc phải có — mặc định flex item có min-width:auto, nên nếu
            "Đáp án chuẩn" chứa chuỗi JSON/URL dài không có khoảng trắng để ngắt dòng,
            nó sẽ ép khung này rộng ra vượt cả sidebar bên trái (w-80), gây đè layout. */}
        <div className="flex-1 min-w-0 flex flex-col bg-white">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Danh sách Học liệu
            </h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Đang tải dữ liệu...</div>
            ) : filteredMaterials.map(renderMaterialCard)}

            {!loading && filteredMaterials.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                Không tìm thấy dữ liệu học liệu nào.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
