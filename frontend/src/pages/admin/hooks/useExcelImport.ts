import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { adminService } from '../../../services/admin.service';
import toast from 'react-hot-toast';

export interface PreviewRow {
  vaiTro: string;
  tenDangNhap: string;
  hoTen: string;
  isValid: boolean;
  errors: string[];
  [key: string]: any;
}

function parsePreviewRows(data: any[][], roleType: 'student' | 'teacher' | 'parent'): PreviewRow[] {
  return data.slice(1).filter((row) => row.length > 0).map((row) => {
    const errors: string[] = [];
    
    const vaiTro = row[0] ?? '';
    const tenDangNhap = row[1] ?? '';
    const hoTen = row[3] ?? '';
    
    if (!vaiTro) errors.push('Thiếu Vai trò');
    if (!tenDangNhap) errors.push('Thiếu Tên đăng nhập');
    if (!hoTen) errors.push('Thiếu Họ tên');

    if (roleType === 'student') {
      if (vaiTro !== 'HOC_SINH' && vaiTro.toUpperCase() !== 'HỌC SINH') errors.push('Vai trò phải là HOC_SINH');
    } else if (roleType === 'teacher') {
      if (vaiTro !== 'GIAO_VIEN' && vaiTro.toUpperCase() !== 'GIÁO VIÊN') errors.push('Vai trò phải là GIAO_VIEN');
    } else if (roleType === 'parent') {
      if (vaiTro !== 'PHU_HUYNH' && vaiTro.toUpperCase() !== 'PHỤ HUYNH') errors.push('Vai trò phải là PHU_HUYNH');
      const maCon = row[10] ?? '';
      if (!maCon) errors.push('Phụ huynh bắt buộc phải có Mã con/Tên đăng nhập con ở cột K');
    }

    return {
      vaiTro,
      tenDangNhap,
      hoTen,
      matKhau: row[2] ?? '',
      email: row[4] ?? '',
      sdt: row[5] ?? '',
      gioiTinh: row[6] ?? '',
      ngaySinh: row[7] ?? '',
      ma: row[8] ?? '', // maGV or maHS
      boMonLop: row[9] ?? '', // boMon or lop
      maCon: row[10] ?? '',
      quanHe: row[11] ?? '',
      isValid: errors.length === 0,
      errors,
    };
  });
}

export function useExcelImport(roleType: 'student' | 'teacher' | 'parent') {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      setPreviewData(parsePreviewRows(data, roleType));
    };
    reader.readAsBinaryString(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await adminService.importUsers(file);
      setUploadResult(result);
    } catch {
      toast.error('Có lỗi xảy ra khi tải file lên!');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const hasErrors = previewData.some((r) => !r.isValid);

  // Clear file & preview state if needed
  const resetUpload = () => {
    setFile(null);
    setPreviewData([]);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    file, previewData, isUploading, uploadResult, fileInputRef, hasErrors,
    handleFileSelect, handleUpload, triggerFileInput, resetUpload
  };
}
