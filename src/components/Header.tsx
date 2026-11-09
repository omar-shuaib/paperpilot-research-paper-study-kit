import React from 'react';
import { GraduationCap, BookOpen, Layers, CheckSquare, Info } from 'lucide-react';

interface HeaderProps {
  onSelectSample?: (paperId: string) => void;
  hasResult?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSelectSample, hasResult }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <a href="/" className="flex items-center gap-2.5 text-slate-900 group shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
              PaperPilot
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-normal block leading-none">
              Research Paper Study Kit
            </span>
          </div>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#input-section" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Upload & Input</span>
          </a>
          {hasResult && (
            <>
              <a href="#concepts-section" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Key Concepts</span>
              </a>
              <a href="#practice-section" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Practice Exam</span>
              </a>
              <a href="#flashcards-section" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Flashcards</span>
              </a>
              <a href="#metadata-section" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Metadata</span>
              </a>
            </>
          )}
        </nav>

        {/* Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectSample && onSelectSample('attention-2017')}
            className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-md transition-colors whitespace-nowrap"
          >
            Load Sample Paper
          </button>
        </div>
      </div>
    </header>
  );
};
