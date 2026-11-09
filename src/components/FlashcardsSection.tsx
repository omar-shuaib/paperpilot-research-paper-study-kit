import React, { useState } from 'react';
import { BookOpen, RotateCw, ArrowLeft, ArrowRight, Shuffle, Check, Copy, Download, Code, Layers, CheckCircle2, Bookmark } from 'lucide-react';
import { Flashcard } from '../types/studyKit';

interface FlashcardsSectionProps {
  flashcards: Flashcard[];
}

export const FlashcardsSection: React.FC<FlashcardsSectionProps> = ({ flashcards: initialCards }) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'study' | 'grid' | 'json'>('study');
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Keep cards in sync if props change
  React.useEffect(() => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards(new Set());
  }, [initialCards]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleMastered = (index: number) => {
    setMasteredCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Prepare valid JSON with strictly front and back fields as requested by prompt
  const validJsonOutput = JSON.stringify(
    cards.map((card) => ({
      front: card.front,
      back: card.back,
    })),
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(validJsonOutput);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([validJsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paperpilot-flashcards-${cards.length}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="flashcards-section" className="py-8 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Section C</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Interactive Flashcards
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {cards.length} term & answer pairs for spaced repetition, quick recall, and JSON export.
            </p>
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('study')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'study'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Study Deck
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('json')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'json'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>JSON Export</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Study Deck (3D Flip Card) */}
        {viewMode === 'study' && currentCard && (
          <div className="space-y-4">
            {/* Progress & Deck Status Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-mono">
                Card <strong className="text-slate-900">{currentIndex + 1}</strong> of {cards.length}
              </span>

              <div className="flex items-center gap-4">
                <span className="text-emerald-700 font-medium">
                  {masteredCards.size} of {cards.length} Mastered
                </span>
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
                  title="Shuffle flashcards"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>

            {/* 3D Flip Card Box */}
            <div
              className="perspective-1000 w-full h-72 sm:h-80 cursor-pointer select-none"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Question / Term
                    </span>
                    {currentCard.category && (
                      <span className="text-xs text-slate-400 font-medium">
                        {currentCard.category}
                      </span>
                    )}
                  </div>

                  <div className="text-center my-auto px-4">
                    <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                      {currentCard.front}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1 text-indigo-600 font-medium">
                      <RotateCw className="w-3.5 h-3.5" />
                      Click card to flip
                    </span>
                    <span>Front</span>
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      Answer / Explanation
                    </span>
                    <span className="text-xs text-slate-400">
                      Card #{currentIndex + 1}
                    </span>
                  </div>

                  <div className="text-left sm:text-center my-auto px-2 overflow-y-auto max-h-44">
                    <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
                      {currentCard.back}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                    <span className="flex items-center gap-1 text-slate-300">
                      <RotateCw className="w-3.5 h-3.5" />
                      Click card to flip back
                    </span>
                    <span>Back</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => toggleMastered(currentIndex)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  masteredCards.has(currentIndex)
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{masteredCards.has(currentIndex) ? 'Mastered!' : 'Mark as Mastered'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* View Mode 2: Grid Overview */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      #{idx + 1}
                    </span>
                    {card.category && (
                      <span className="text-[11px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
                        {card.category}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">
                    {card.front}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                    {card.back}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode 3: Valid JSON View & Export */}
        {viewMode === 'json' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-5 text-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-emerald-400 font-mono block">
                  Valid JSON Export (`front` & `back` fields)
                </span>
                <span className="text-[11px] text-slate-400">
                  Ready for Anki, Quizlet, or programmatic study tool import.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            <pre className="font-mono text-xs text-slate-300 overflow-x-auto max-h-96 p-3 bg-slate-950/80 rounded-lg leading-relaxed">
              {validJsonOutput}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
