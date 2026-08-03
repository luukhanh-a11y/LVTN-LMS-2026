import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  widthClass?: string;
}

export function Modal({ isOpen, onClose, title, children, widthClass = 'w-[500px]' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className={`bg-white ${widthClass} rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          {typeof title === 'string' ? (
            <h3 className="font-bold text-slate-800">{title}</h3>
          ) : (
            <div>{title}</div>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
