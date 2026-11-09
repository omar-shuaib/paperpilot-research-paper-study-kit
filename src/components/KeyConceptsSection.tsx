import React, { useState } from 'react';
import { Layers, Copy, Check, Volume2, VolumeX, Sparkles, Lightbulb } from 'lucide-react';
import { KeyConcept } from '../types/studyKit';

interface KeyConceptsSectionProps {
  concepts: KeyConcept[];
  paperTitle: string;
}

export const KeyConceptsSection: React.FC<KeyConceptsSectionProps> = ({ concepts, paperTitle }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const handleCopy = (concept: KeyConcept, index: number) => {
    const textToCopy = `${concept.concept}\n\nSummary:\n${concept.summary}\n\nWhy it matters:\n${concept.whyItMatters || 'Core paper mechanism'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeech = (concept: KeyConcept, index: number) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${concept.concept}. ${concept.summary}`);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section id="concepts-section" className="py-8 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Section A</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Key Concepts & Summaries
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {concepts.length} core concepts explained in 2–3 plain-language sentences directly from the paper.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Plain Language · Zero Jargon
          </div>
        </div>

        {/* Concept Cards Grid */}
        <div className="space-y-4">
          {concepts.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center font-mono shrink-0 border border-indigo-100">
                    0{index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {item.concept}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {'speechSynthesis' in window && (
                    <button
                      type="button"
                      onClick={() => handleSpeech(item, index)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title={speakingIndex === index ? 'Stop audio' : 'Listen to concept'}
                    >
                      {speakingIndex === index ? (
                        <VolumeX className="w-4 h-4 text-indigo-600 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(item, index)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="Copy concept summary"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 2-3 Concise Sentences in Plain Language */}
              <p className="text-sm text-slate-700 leading-relaxed pl-10 pr-2">
                {item.summary}
              </p>

              {/* Why It Matters */}
              {item.whyItMatters && (
                <div className="mt-3.5 ml-10 p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 leading-snug">
                    <span className="font-semibold text-slate-800">Why it matters: </span>
                    {item.whyItMatters}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
