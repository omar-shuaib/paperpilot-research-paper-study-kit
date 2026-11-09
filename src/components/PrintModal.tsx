import React from 'react';
import { Printer, X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { StudyKitResult } from '../types/studyKit';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  kit: StudyKitResult;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, kit }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Printable Study Guide & Exam Sheet
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Header */}
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs uppercase tracking-wider text-indigo-600 font-bold mb-1">
              PaperPilot Study Kit · {kit.difficulty} Level
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {kit.paperTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authors: {kit.metadata.authors} · Venue: {kit.metadata.publicationVenue} ({kit.metadata.publicationYear})
            </p>
          </div>

          {/* Section A */}
          <div>
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Section A: Key Concepts & Summaries
            </h2>
            <div className="space-y-3">
              {kit.keyConcepts.map((kc, i) => (
                <div key={i} className="pl-2 border-l-2 border-indigo-500">
                  <h4 className="font-bold text-slate-900 text-xs">{i + 1}. {kc.concept}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{kc.summary}</p>
                  {kc.whyItMatters && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">Why it matters: {kc.whyItMatters}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section B */}
          <div>
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Section B: Practice Exam Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">1. Multiple Choice Question</h4>
                <p className="text-xs text-slate-700 mt-1">{kit.practiceQuestions.multipleChoice.question}</p>
                <div className="grid grid-cols-2 gap-1.5 mt-2 text-xs">
                  {kit.practiceQuestions.multipleChoice.options.map((opt, idx) => (
                    <div key={idx} className="p-1.5 bg-slate-50 rounded border border-slate-200">
                      <strong>{['A', 'B', 'C', 'D'][idx]}.</strong> {opt}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded mt-2 border border-emerald-100">
                  <strong>Correct:</strong> {['A', 'B', 'C', 'D'][kit.practiceQuestions.multipleChoice.correctIndex]} — {kit.practiceQuestions.multipleChoice.explanation}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs">2. Short-Answer Question</h4>
                <p className="text-xs text-slate-700 mt-1">{kit.practiceQuestions.shortAnswer.question}</p>
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 mt-1.5">
                  <strong>Exemplar Answer:</strong> {kit.practiceQuestions.shortAnswer.sampleHighScoringAnswer}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs">3. Real-World Application</h4>
                <p className="text-[11px] text-slate-500 italic">Scenario: {kit.practiceQuestions.realWorldApplication.scenario}</p>
                <p className="text-xs text-slate-700 mt-1 font-medium">{kit.practiceQuestions.realWorldApplication.question}</p>
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 mt-1.5">
                  <strong>Guided Solution:</strong> {kit.practiceQuestions.realWorldApplication.sampleApproach}
                </p>
              </div>
            </div>
          </div>

          {/* Section C */}
          <div>
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mb-3">
              Section C: Flashcards Quick Reference
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {kit.flashcards.map((fc, i) => (
                <div key={i} className="p-2 border border-slate-200 rounded">
                  <div className="font-semibold text-slate-900">{fc.front}</div>
                  <div className="text-slate-600 mt-1">{fc.back}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Disclaimer */}
          <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-3">
            <strong>Source Grounding Reminder:</strong> {kit.metadata.disclaimer || 'AI-generated study material should always be verified against the original research paper. Missing metadata is labeled Unknown.'}
          </div>
        </div>
      </div>
    </div>
  );
};
