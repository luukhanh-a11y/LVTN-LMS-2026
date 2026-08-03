export type Role = 'admin' | 'teacher' | 'parent' | 'student';

export type Status = 'ACTIVE' | 'FROZEN' | 'PENDING' | 'RESOLVED' | 'DA_NOP' | 'DA_CHAM' | 'CHUA_NOP';

export type SubmissionType = 'H5P' | 'TU_LUAN' | 'TU_DO' | 'CA_NHAN';
export type ContentType = 'H5P' | 'FILE' | 'NATIVE' | 'JSON_TEXT';
export interface ClassInfo {
  id: number;
  name: string;
  grade: number | string;
  teacher: string;
  students: number;
  max: number;
  status: Status;
}

export interface StudentInfo {
  id: number;
  name: string;
  className?: string;
  code?: string;
  dob?: string;
  parentName?: string;
  phone?: string;
  evaluation?: string;
  attendance?: number;
  badges?: number;
}

export interface SubmissionInfo {
  id: number;
  student: string;
  task: string;
  type: SubmissionType;
  date: string;
  status: Status;
  late: boolean;
  score?: string;
}
