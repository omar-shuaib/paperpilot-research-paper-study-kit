import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PaperInput } from './components/PaperInput';
import { KeyConceptsSection } from './components/KeyConceptsSection';
import { PracticeQuestionsSection } from './components/PracticeQuestionsSection';
import { FlashcardsSection } from './components/FlashcardsSection';
import { MetadataSection } from './components/MetadataSection';
import { PrintModal } from './components/PrintModal';
import { StudyKitResult, Difficulty } from './types/studyKit';
import { SAMPLE_PAPERS } from './data/samplePapers';
import { Printer, RefreshCw, AlertCircle, ArrowUp, GraduationCap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentKit, setCurrentKit] = useState<StudyKitResult | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Medium');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Cached last submission data to allow 1-click re-generation at a different difficulty
  const [lastSubmission, setLastSubmission] = useState<{
    pdfBase64?: string;
    text?: string;
    filename?: string;
    title?: string;
  } | null>(null);

  // Load sample paper immediately on initial mount so student has immediate rich content to explore
  useEffect(() => {
    const defaultSample = SAMPLE_PAPERS[0];
    if (defaultSample) {
      setCurrentKit(defaultSample.precomputedKit);
      setLastSubmission({
        text: defaultSample.text,
        title: defaultSample.title,
      });
    }
  }, []);

  const handleGenerate = async (payload: {
    pdfBase64?: string;
    text?: string;
    difficulty: Difficulty;
    filename?: string;
    title?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastSubmission({
      pdfBase64: payload.pdfBase64,
      text: payload.text,
      filename: payload.filename,
      title: payload.title,
    });

    try {
      setLoadingStage('Analyzing paper with Gemini 3.8 Flash...');

      const response = await fetch('/api/generate-kit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfBase64: payload.pdfBase64,
          text: payload.text,
          difficulty: payload.difficulty,
          filename: payload.filename,
          title: payload.title,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate study kit from server.');
      }

      setCurrentKit(result.data);

      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('study-kit-results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('API call encountered an issue, checking fallback:', error.message);

      // If the error was missing API key and we have sample paper text, use sample fallback
      const matchingSample = SAMPLE_PAPERS.find(
        (s) => payload.title && s.title.toLowerCase().includes(payload.title.toLowerCase())
      );

      if (matchingSample) {
        setCurrentKit({
          ...matchingSample.precomputedKit,
          difficulty: payload.difficulty,
        });
        setErrorMessage(
          'Notice: Used verified sample paper kit. For custom uploaded papers, ensure your GEMINI_API_KEY is configured in Settings > Secrets.'
        );
      } else {
        setErrorMessage(error.message || 'An error occurred while communicating with the server.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PAPERS.find((s) => s.id === sampleId);
    if (sample) {
      setCurrentKit(sample.precomputedKit);
      setSelectedDifficulty(sample.precomputedKit.difficulty);
      setLastSubmission({
        text: sample.text,
        title: sample.title,
      });
      setErrorMessage(null);

      setTimeout(() => {
        const el = document.getElementById('study-kit-results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleRegenerateWithDifficulty = (newDiff: Difficulty) => {
    setSelectedDifficulty(newDiff);
    if (lastSubmission) {
      handleGenerate({
        ...lastSubmission,
        difficulty: newDiff,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        onSelectSample={handleLoadSample}
        hasResult={Boolean(currentKit)}
      />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <Hero />

        {/* Paper Input & Upload Section */}
        <PaperInput
          onGenerate={handleGenerate}
          isLoading={isLoading}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          onLoadSample={handleLoadSample}
        />

        {/* Global Loading Spinner / Stage Indicator */}
        {isLoading && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
            <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm text-center">
              <div className="w-10 h-10 mx-auto mb-3 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                PaperPilot Academic Synthesizer
              </h3>
              <p className="text-xs text-indigo-700 font-medium">
                {loadingStage || 'Processing document contents...'}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Extracting core definitions, synthesizing exam questions, and verifying citation counts.
              </p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 my-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-amber-700 hover:text-amber-950 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Study Kit Results */}
        {currentKit && (
          <div id="study-kit-results" className="mt-8">
            {/* Paper Overview Banner */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Active Study Kit</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">
                    {currentKit.paperTitle}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Difficulty: {currentKit.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentKit.keyConcepts.length} Key Concepts</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentKit.flashcards.length} Flashcards</span>
                    <span aria-hidden="true">·</span>
                    <span>Verified Metadata</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Study Sheet</span>
                  </button>

                  <a
                    href="#input-section"
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Upload New Paper</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Section A: Key Concepts & Summaries */}
            <KeyConceptsSection
              concepts={currentKit.keyConcepts}
              paperTitle={currentKit.paperTitle}
            />

            {/* Section B: Practice Exam Questions */}
            <PracticeQuestionsSection
              questions={currentKit.practiceQuestions}
            />

            {/* Section C: Flashcards */}
            <FlashcardsSection
              flashcards={currentKit.flashcards}
            />

            {/* Section D: Paper Metadata & Verification */}
            <MetadataSection
              metadata={currentKit.metadata}
              paperTitle={currentKit.paperTitle}
            />
          </div>
        )}
      </main>

      {/* Printable Study Kit Modal */}
      {currentKit && (
        <PrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          kit={currentKit}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">PaperPilot: Research Paper Study Kit</span>
            <span aria-hidden="true">·</span>
            <span>Empowering scholarly learning</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Analyze ONLY supplied paper</span>
            <span aria-hidden="true">·</span>
            <span>Check AI output against source</span>
            <span aria-hidden="true">·</span>
            <a href="#input-section" className="text-indigo-600 hover:underline">
              Back to Top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
