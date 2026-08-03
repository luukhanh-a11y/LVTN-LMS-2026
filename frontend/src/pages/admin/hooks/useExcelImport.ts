import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { adminService } from '../../../services/admin.service';
import toast from 'react-hot-toast';

export interface PreviewRow {
  className: string;
  studentCode: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  isValid: boolean;
  errors: string[];
}

function parsePreviewRows(data: any[][]): PreviewRow[] {
  return data.slice(1).filter((row) => row.length > 0).map((row) => {
    const errors: string[] = [];
    if (!row[0]) errors.push('Thiếu lớp');
    if (!row[1]) errors.push('Thiếu mã HS');
    if (!row[2]) errors.push('Thiếu tên HS');
    if (!row[4]) errors.push('Thiếu tên PH');
    if (!row[5]) errors.push('Thiếu SĐT PH');
    return {
      className: row[0] ?? '',
      studentCode: row[1] ?? '',
      studentName: row[2] ?? '',
      parentName: row[4] ?? '',
      parentPhone: row[5] ?? '',
      isValid: errors.length === 0,
      errors,
    };
  });
}

export function useExcelImport() {
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
      setPreviewData(parsePreviewRows(data));
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

  return {
    file, previewData, isUploading, uploadResult, fileInputRef, hasErrors,
    handleFileSelect, handleUpload, triggerFileInput,
  };
}
