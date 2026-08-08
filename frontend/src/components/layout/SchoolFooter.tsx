import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { academicService, type CauHinhHeThong } from '../../services/academic.service';

// Footer read-only hiển thị thông tin trường lấy từ Cấu hình hệ thống.
// Không có thao tác sửa ở đây — sửa cấu hình hệ thống thuộc phạm vi Admin.
export default function SchoolFooter() {
  const [cauHinh, setCauHinh] = useState<CauHinhHeThong | null>(null);

  useEffect(() => {
    academicService.getCauHinhHeThong().then(setCauHinh).catch(() => setCauHinh(null));
  }, []);

  if (!cauHinh) return null;

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white px-10 py-5">
      <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex items-center gap-3">
          {cauHinh.logoUrl && (
            <img src={cauHinh.logoUrl} alt={cauHinh.tenTruong} className="w-8 h-8 rounded-lg object-cover" />
          )}
          <span className="font-semibold text-slate-700">{cauHinh.tenTruong}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {cauHinh.diaChi && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {cauHinh.diaChi}
            </span>
          )}
          {cauHinh.hotline && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {cauHinh.hotline}
            </span>
          )}
          {cauHinh.emailLienHe && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {cauHinh.emailLienHe}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
