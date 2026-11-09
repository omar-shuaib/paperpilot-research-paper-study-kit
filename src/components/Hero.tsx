import React from 'react';
import { BookOpen, ShieldAlert, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="pt-8 pb-6 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-md text-xs font-medium text-indigo-700 mb-4">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Student Research Companion</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3" style={{ textWrap: 'balance' }}>
          PaperPilot: Research Paper Study Kit
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          Master dense academic papers with ease. Upload a PDF or paste paper text to receive plain-language core concepts, difficulty-calibrated exam questions, interactive study flashcards, and verified citation metadata.
        </p>

        {/* Verification & Source Grounding Notice */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-3.5 max-w-2xl mx-auto text-left flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold text-amber-950">Source-Grounded Learning Notice: </span>
            PaperPilot analyzes <strong className="font-semibold">only</strong> the supplied paper text and will never invent absent facts or citation statistics. All AI-generated study summaries and exam questions should always be verified against your original source paper.
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-200/60 text-left">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>3–5 Plain Concepts</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>MCQ + Short Answer + Real-World</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>3D Flip & JSON Flashcards</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Verified Paper Metadata</span>
          </div>
        </div>
      </div>
    </div>
  );
};
