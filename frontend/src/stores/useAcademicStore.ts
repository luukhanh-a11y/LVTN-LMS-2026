import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AcademicState {
  currentNamHoc: string;
  selectedNamHoc: string;
  isReadOnly: boolean;
  isEvaluationOpen: boolean; // Mock backend configuration
  setNamHoc: (namHoc: string) => void;
  setCurrentNamHoc: (namHoc: string) => void;
  setEvaluationOpen: (isOpen: boolean) => void;
}

export const useAcademicStore = create<AcademicState>()(
  persist(
    (set, get) => ({
      currentNamHoc: '2024-2025',
      selectedNamHoc: '2024-2025',
      isReadOnly: false,
      isEvaluationOpen: false,
      setNamHoc: (namHoc) => {
        const { currentNamHoc } = get();
        set({ 
          selectedNamHoc: namHoc,
          isReadOnly: namHoc !== currentNamHoc 
        });
      },
      setCurrentNamHoc: (namHoc) => {
        set({ 
          currentNamHoc: namHoc,
          selectedNamHoc: namHoc,
          isReadOnly: false 
        });
      },
      setEvaluationOpen: (isOpen) => set({ isEvaluationOpen: isOpen })
    }),
    {
      name: 'academic-storage',
    }
  )
);
