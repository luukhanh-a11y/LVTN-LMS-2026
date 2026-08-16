import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className, minHeight = '150px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isInternalChange.current) {
      editorRef.current.innerHTML = value || '';
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div className={cn("border border-slate-300 rounded-lg overflow-hidden bg-white flex flex-col", className)}>
      <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
          title="In đậm"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
          title="In nghiêng"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
          title="Gạch dưới"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
          title="Danh sách dấu chấm"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
          title="Danh sách số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-3 outline-none overflow-y-auto w-full prose prose-sm max-w-none text-slate-800"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
