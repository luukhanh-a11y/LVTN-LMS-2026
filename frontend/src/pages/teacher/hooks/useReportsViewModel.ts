import { useState, useEffect } from 'react';
import { teacherService, type ClassRoom } from '../../../services/teacher.service';

export function useReportsViewModel() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [semesters, setSemesters] = useState<{ id: number; label: string }[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | ''>('');

  useEffect(() => {
    Promise.all([teacherService.getClasses(), teacherService.getSemesters()])
      .then(([classData, semesterData]) => {
        setClasses(classData);
        setSemesters(semesterData);
        if (classData.length > 0) {
          setSelectedClassId(classData[0].id);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedClassId === '') return;
    setIsLoading(true);
    teacherService.getReports(selectedClassId as number, selectedSemesterId === '' ? undefined : (selectedSemesterId as number))
      .then(setReportData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedClassId, selectedSemesterId]);

  const openRewardModal = (id: number, name: string) => {
    setSelectedStudentId(id);
    setSelectedStudentName(name);
    setShowRewardModal(true);
  };

  const openProgressModal = (id: number, name: string) => {
    setSelectedStudentId(id);
    setSelectedStudentName(name);
    setShowProgressModal(true);
  };

  return {
    students: reportData?.students ?? [],
    isLoading,
    selectedStudentName,
    selectedStudentId,
    showRewardModal, setShowRewardModal,
    showProgressModal, setShowProgressModal,
    openRewardModal,
    openProgressModal,
    classes,
    semesters,
    selectedClassId, setSelectedClassId,
    selectedSemesterId, setSelectedSemesterId,
  };
}
