import { create } from 'zustand';

export interface SelectedChild {
  id: number;
  name: string;
  className?: string;
}

interface ParentContextState {
  selectedChild: SelectedChild | null;
  resolved: boolean;
  setSelectedChild: (child: SelectedChild) => void;
  markNoChildren: () => void;
  clearSelectedChild: () => void;
}

interface PersistedShape {
  selectedChild: SelectedChild | null;
  resolved: boolean;
}

const STORAGE_KEY = 'parentContext';

const persist = (state: PersistedShape) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadInitial = (): PersistedShape => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { selectedChild: null, resolved: false };
  try {
    return JSON.parse(raw);
  } catch {
    return { selectedChild: null, resolved: false };
  }
};

const initial = loadInitial();

export const useParentContextStore = create<ParentContextState>((set) => ({
  selectedChild: initial.selectedChild,
  resolved: initial.resolved,
  setSelectedChild: (child) => {
    const next = { selectedChild: child, resolved: true };
    persist(next);
    set(next);
  },
  markNoChildren: () => {
    const next = { selectedChild: null, resolved: true };
    persist(next);
    set(next);
  },
  clearSelectedChild: () => {
    const next = { selectedChild: null, resolved: false };
    persist(next);
    set(next);
  },
}));
