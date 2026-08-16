import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, PlayCircle, Maximize2, Minimize2, Eye, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import H5PEditor, { type H5PEditorHandle } from '../../components/h5p/H5PEditor';
import H5PPlayer from '../../components/h5p/H5PPlayer';
import { teacherService, type Subject, type Material } from '../../services/teacher.service';
import { adminService } from '../../services/admin.service';
import { GRADES } from '../../constants';
import { ExerciseSuggestionsPanel } from './components/ExerciseSuggestionsPanel';

export default function TeacherEditor() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<H5PEditorHandle>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewContentId, setPreviewContentId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [giaoVienId, setGiaoVienId] = useState<number | null>(null);
  const [existingMaterial, setExistingMaterial] = useState<Material | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(!!contentId);
  const isNew = !contentId;
  // Cần chọn Bài học khi soạn mới, hoặc khi sửa 1 content H5P cũ chưa từng được
  // gắn vào dang_bai (tạo trước khi luồng này tồn tại).
  const needsBaiHocPicker = isNew || (!isNew && !loadingExisting && !existingMaterial);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grade, setGrade] = useState('');
  const [subjectId, setSubjectId] = useState('');

  // Chuỗi Sách → Chủ đề → Bài học (chỉ dùng khi needsBaiHocPicker)
  const [sachList, setSachList] = useState<any[]>([]);
  const [selectedSachId, setSelectedSachId] = useState<number | ''>('');
  const [isLoadingSach, setIsLoadingSach] = useState(false);

  const [chuDeList, setChuDeList] = useState<any[]>([]);
  const [selectedChuDeId, setSelectedChuDeId] = useState<number | ''>('');
  const [isLoadingChuDe, setIsLoadingChuDe] = useState(false);

  const [baiHocList, setBaiHocList] = useState<any[]>([]);
  const [selectedBaiHocId, setSelectedBaiHocId] = useState<number | ''>('');
  const [isLoadingBaiHoc, setIsLoadingBaiHoc] = useState(false);

  useEffect(() => {
    teacherService.getSubjects().then(setSubjects).catch(() => setSubjects([]));
    teacherService.getMyTeacherProfile().then((p) => setGiaoVienId(p.giaoVienId)).catch(() => setGiaoVienId(null));
  }, []);

  // Sửa bài có sẵn: tra cứu học liệu đã gắn với content này (nếu có) để biết
  // baiHocId hiện tại, khỏi bắt chọn lại từ đầu.
  useEffect(() => {
    if (!contentId) return;
    setLoadingExisting(true);
    teacherService
      .getMaterialByH5pContentId(contentId)
      .then(setExistingMaterial)
      .catch(() => setExistingMaterial(null))
      .finally(() => setLoadingExisting(false));
  }, [contentId]);

  // Lọc Sách theo Khối+Môn đã chọn (GET /sach trả toàn bộ, không lọc server-side)
  useEffect(() => {
    setSachList([]); setSelectedSachId('');
    setChuDeList([]); setSelectedChuDeId('');
    setBaiHocList([]); setSelectedBaiHocId('');
    if (!needsBaiHocPicker || !grade || !subjectId) return;

    setIsLoadingSach(true);
    // SachResponse (GET /sach) không có monHocId, chỉ có maMon (mã môn dạng chuỗi) —
    // phải tra maMon từ subjectId đã chọn rồi lọc theo đó, không so sánh trực tiếp monHocId.
    const selectedSubject = subjects.find((s) => String(s.monHocId) === String(subjectId));
    adminService
      .getBoSachList()
      .then((list) => {
        const filtered = list.filter((s: any) => s.khoiLop === Number(grade) && s.maMon === selectedSubject?.maMon);
        setSachList(filtered);
        if (filtered.length === 1) setSelectedSachId(filtered[0].sachId);
      })
      .catch(() => setSachList([]))
      .finally(() => setIsLoadingSach(false));
  }, [needsBaiHocPicker, grade, subjectId, subjects]);

  useEffect(() => {
    setChuDeList([]); setSelectedChuDeId('');
    setBaiHocList([]); setSelectedBaiHocId('');
    if (!selectedSachId) return;
    setIsLoadingChuDe(true);
    teacherService
      .getChuDeBySach(selectedSachId as number)
      .then((list) => {
        setChuDeList(list);
        if (list.length === 1) setSelectedChuDeId(list[0].chuDeId);
      })
      .catch(() => setChuDeList([]))
      .finally(() => setIsLoadingChuDe(false));
  }, [selectedSachId]);

  useEffect(() => {
    setBaiHocList([]); setSelectedBaiHocId('');
    if (!selectedChuDeId) return;
    setIsLoadingBaiHoc(true);
    teacherService
      .getBaiHocByChuDe(selectedChuDeId as number)
      .then((list) => {
        setBaiHocList(list);
        if (list.length === 1) setSelectedBaiHocId(list[0].baiHocId);
      })
      .catch(() => setBaiHocList([]))
      .finally(() => setIsLoadingBaiHoc(false));
  }, [selectedChuDeId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (!editorRef.current) return;
    if (needsBaiHocPicker && !selectedBaiHocId) {
      toast.error('Vui lòng chọn Khối, Môn học và Bài học trước khi lưu.');
      return;
    }
    if (!giaoVienId) {
      toast.error('Không xác định được hồ sơ giáo viên, vui lòng tải lại trang.');
      return;
    }
    setSaving(true);
    try {
      const result = await editorRef.current.save();
      setHasUnsavedChanges(false);

      // Gắn nội dung H5P vừa lưu vào đúng Bài học trong LMS (dang_bai). Nếu bước
      // này lỗi, báo rõ cho GV thay vì coi như đã lưu xong hoàn toàn.
      try {
        if (existingMaterial) {
          await teacherService.updateMaterial(existingMaterial.dangBaiId, {
            baiHocId: existingMaterial.baiHocId,
            tenDangBai: result.metadata?.title ?? existingMaterial.tenDangBai,
            loaiNoiDung: 'H5P',
            giaoVienId,
            h5pNoiDungId: result.contentId,
          });
        } else {
          const created = await teacherService.createMaterial({
            baiHocId: selectedBaiHocId as number,
            tenDangBai: result.metadata?.title ?? 'Bài giảng H5P không tên',
            loaiNoiDung: 'H5P',
            giaoVienId,
            h5pNoiDungId: result.contentId,
          });
          setExistingMaterial(created);
        }
        toast.success('Đã lưu học liệu H5P thành công!');
      } catch (linkError: any) {
        toast.error(
          linkError?.response?.data?.message ??
            'Đã lưu nội dung H5P nhưng chưa gắn được vào Bài học, vui lòng thử lại.',
        );
      }

      setPreviewContentId(result.contentId);
    } catch (error: any) {
      toast.error(error?.message ?? 'Lưu học liệu thất bại, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
      return;
    }
    navigate(-1);
  };

  // H5P web component không phát sự kiện "nội dung thay đổi" riêng (chỉ có
  // editorloaded/saved) — nên đánh dấu "chưa lưu" dựa trên tương tác thật
  // của người dùng bên trong khung soạn thảo, thay vì lúc editor vừa tải xong.
  const handleEditorInteraction = () => setHasUnsavedChanges(true);

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-40 bg-white overflow-y-auto p-4 space-y-4' : 'space-y-4'}>
      <div className={isFullscreen ? 'flex justify-between items-center sticky top-0 bg-white z-10 pb-2' : 'flex justify-between items-center'}>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <PlayCircle className="w-6 h-6 mr-2 text-pro-primary" />
          {contentId ? 'Sửa Bài giảng H5P' : 'Soạn Bài giảng H5P'}
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsFullscreen((f) => !f)}>
            {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
            {isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button variant="pro-primary" onClick={handleSave} disabled={saving || loadingExisting}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Đang lưu...' : 'Lưu học liệu'}
          </Button>
        </div>
      </div>

      {loadingExisting && (
        <div className="flex items-center gap-2 text-slate-500 text-sm p-3">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải thông tin bài giảng...
        </div>
      )}

      {!loadingExisting && !needsBaiHocPicker && existingMaterial && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 max-w-[1040px] text-sm text-slate-600">
          Đang gắn với bài học: <span className="font-bold text-slate-800">{existingMaterial.tenBaiHoc}</span>
          {existingMaterial.tenMon && <> — {existingMaterial.tenMon}</>}
          {existingMaterial.khoiLop && <> (Khối {existingMaterial.khoiLop})</>}
        </div>
      )}

      {!loadingExisting && needsBaiHocPicker && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 max-w-[1040px] space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Khối <span className="text-red-500">*</span></label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="">-- Chọn Khối --</option>
                {GRADES.filter((g) => g.value !== 'all').map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Môn học <span className="text-red-500">*</span></label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="">-- Chọn Môn học --</option>
                {subjects.map((s) => (
                  <option key={s.monHocId} value={s.monHocId}>{s.tenMon}</option>
                ))}
              </select>
            </div>
          </div>

          {grade && subjectId && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Sách <span className="text-red-500">*</span></label>
                {isLoadingSach ? (
                  <div className="flex items-center gap-2 text-slate-500 text-sm p-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                  </div>
                ) : sachList.length === 0 ? (
                  <p className="text-sm text-slate-500 italic p-2 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                    Chưa có sách nào cho đúng Khối/Môn này.
                  </p>
                ) : (
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                    value={selectedSachId}
                    onChange={(e) => setSelectedSachId(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">-- Chọn sách --</option>
                    {sachList.map((s) => (
                      <option key={s.sachId} value={s.sachId}>{s.tenSach}</option>
                    ))}
                  </select>
                )}
              </div>

              {selectedSachId && (
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Chủ đề <span className="text-red-500">*</span></label>
                  {isLoadingChuDe ? (
                    <div className="flex items-center gap-2 text-slate-500 text-sm p-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                    </div>
                  ) : (
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                      value={selectedChuDeId}
                      onChange={(e) => setSelectedChuDeId(e.target.value ? Number(e.target.value) : '')}
                    >
                      <option value="">-- Chọn chủ đề --</option>
                      {chuDeList.map((cd) => (
                        <option key={cd.chuDeId} value={cd.chuDeId}>{cd.tenChuDe}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {selectedChuDeId && (
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bài học <span className="text-red-500">*</span></label>
                  {isLoadingBaiHoc ? (
                    <div className="flex items-center gap-2 text-slate-500 text-sm p-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
                    </div>
                  ) : (
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm focus:border-primary"
                      value={selectedBaiHocId}
                      onChange={(e) => setSelectedBaiHocId(e.target.value ? Number(e.target.value) : '')}
                    >
                      <option value="">-- Chọn bài học --</option>
                      {baiHocList.map((bh) => (
                        <option key={bh.baiHocId} value={bh.baiHocId}>{bh.tenBaiHoc}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className={`flex gap-4 ${isFullscreen ? '' : 'max-w-[1360px]'} items-start`}>
        {/* H5P tự giới hạn cứng nội dung trong iframe ở 960px — canh giữa thay vì để trống hai bên. */}
        <div
          className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 min-h-[70vh] max-w-[1040px] flex-1"
          onClickCapture={handleEditorInteraction}
          onInputCapture={handleEditorInteraction}
          onKeyDownCapture={handleEditorInteraction}
        >
          <H5PEditor ref={editorRef} contentId={contentId} />
        </div>

        {needsBaiHocPicker && grade && subjectId && (
          <div className="w-[300px] shrink-0 sticky top-4">
            <ExerciseSuggestionsPanel grade={Number(grade)} subjectId={Number(subjectId)} />
          </div>
        )}
      </div>

      <Modal
        isOpen={!!previewContentId}
        onClose={() => {
          setPreviewContentId(null);
          navigate('/teacher/materials');
        }}
        title={
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2 text-pro-primary" /> Xem trước học liệu vừa lưu
          </div>
        }
        widthClass="w-[90vw] max-w-4xl"
      >
        <div className="h-[70vh] p-4">
          {previewContentId && <H5PPlayer contentId={previewContentId} />}
        </div>
      </Modal>

      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title={
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Hủy soạn bài?
          </div>
        }
        widthClass="w-[420px]"
      >
        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-sm">Nội dung chưa lưu sẽ mất. Bạn có chắc muốn hủy?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
              Tiếp tục soạn
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => navigate(-1)}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
