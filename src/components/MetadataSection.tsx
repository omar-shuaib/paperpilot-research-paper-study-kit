import React from 'react';
import { Info, ShieldAlert, CheckCircle2, AlertCircle, FileText, Calendar, Users, Building, Quote } from 'lucide-react';
import { PaperMetadata } from '../types/studyKit';

interface MetadataSectionProps {
  metadata: PaperMetadata;
  paperTitle: string;
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({ metadata, paperTitle }) => {
  const isUnknown = (val: string | undefined) => !val || val.trim().toLowerCase() === 'unknown' || val.trim() === '';

  return (
    <section id="metadata-section" className="py-8 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Section D</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Paper Metadata & Source Verification
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Extracted strictly from the supplied document. Zero hallucinated fields per academic standards.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Integrity Guardrails Active
          </div>
        </div>

        {/* 4 Metadata Cards with Tabular Precision */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* 1. Citation Count */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Quote className="w-3.5 h-3.5 text-indigo-600" />
              <span>Citation Count</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {metadata.citationCount}
              </span>
              {isUnknown(metadata.citationCount) ? (
                <span className="text-xs text-slate-400">
                  (Unstated in provided text)
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  citations documented
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {isUnknown(metadata.citationCount)
                ? 'Academic rule: AI will never guess or scrape external live citation counts unless stated in the paper.'
                : 'Explicitly reported in the text or bibliography metrics.'}
            </p>
          </div>

          {/* 2. Publication Year */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Publication Year</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {metadata.publicationYear}
              </span>
              {isUnknown(metadata.publicationYear) && (
                <span className="text-xs text-slate-400">
                  (Not specified)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Four-digit calendar year verified directly from header, footer, or conference stamp.
            </p>
          </div>

          {/* 3. Authors */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Authors</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {metadata.authors}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Affiliations and author lists as transcribed from the paper header.
            </p>
          </div>

          {/* 4. Publication Venue */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>Publication Venue / Proceedings</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {metadata.publicationVenue}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Journal name, conference proceedings, or repository origin found in the manuscript.
            </p>
          </div>
        </div>

        {/* Verification & Academic Honesty Callout */}
        <div className="rounded-xl bg-amber-50/90 border border-amber-200 p-5 flex items-start gap-3.5 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-amber-950">
              Academic Disclaimer & Verification Reminder
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              {metadata.disclaimer ||
                'AI-generated study material is intended to accelerate student comprehension and exam preparation, but it should always be verified against the original peer-reviewed source document. Missing metadata is intentionally designated as Unknown to prevent factual hallucinations.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-amber-800/80 font-medium">
              <span>Zero Hallucinations Policy</span>
              <span aria-hidden="true">·</span>
              <span>Document-Grounded Only</span>
              <span aria-hidden="true">·</span>
              <span>Student Academic Integrity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
