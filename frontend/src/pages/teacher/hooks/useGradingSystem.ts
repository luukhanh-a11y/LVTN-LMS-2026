import { useState } from 'react';
import type { SubmissionDetail } from '../../../services/teacher.service';

export function useGradingSystem() {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(1);
  const [viewGradedDetails, setViewGradedDetails] = useState<SubmissionDetail | null>(null);

  const handleSelectStudent = (id: number) => {
    setSelectedStudentId(id);
  };

  const handleViewDetails = (submission: SubmissionDetail) => {
    setViewGradedDetails(submission);
  };

  const closeDetails = () => {
    setViewGradedDetails(null);
  };

  return {
    selectedStudentId,
    viewGradedDetails,
    handleSelectStudent,
    handleViewDetails,
    closeDetails
  };
}
