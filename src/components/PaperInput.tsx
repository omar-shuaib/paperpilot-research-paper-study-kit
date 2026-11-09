import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Sparkles, BookOpen, ArrowRight, Check } from 'lucide-react';
import { Difficulty } from '../types/studyKit';
import { SAMPLE_PAPERS } from '../data/samplePapers';

interface PaperInputProps {
  onGenerate: (payload: {
    pdfBase64?: string;
    text?: string;
    difficulty: Difficulty;
    filename?: string;
    title?: string;
  }) => Promise<void>;
  isLoading: boolean;
  selectedDifficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  onLoadSample: (sampleId: string) => void;
}

export const PaperInput: React.FC<PaperInputProps> = ({
  onGenerate,
  isLoading,
  selectedDifficulty,
  onDifficultyChange,
  onLoadSample,
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'text' | 'sample'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [paperTitleInput, setPaperTitleInput] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle PDF file selection and read as base64
  const processFile = (file: File) => {
    setInputError(null);
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      setInputError('Please select a valid PDF research paper file (.pdf).');
      return;
    }
    // Limit to 20MB for browser memory and network performance
    if (file.size > 20 * 1024 * 1024) {
      setInputError('File exceeds 20MB limit. Please upload a smaller PDF or paste its text.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setPdfBase64(base64Data);
    };
    reader.onerror = () => {
      setInputError('Failed to read the PDF file. Please try again or paste text.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPdfBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    if (inputMode === 'upload') {
      if (!pdfBase64 || !selectedFile) {
        setInputError('Please upload a PDF file first, or switch to the Paste Text tab.');
        return;
      }
      await onGenerate({
        pdfBase64,
        filename: selectedFile.name,
        difficulty: selectedDifficulty,
        title: paperTitleInput.trim() || selectedFile.name.replace(/\.pdf$/i, ''),
      });
    } else if (inputMode === 'text') {
      if (!pastedText.trim() || pastedText.trim().length < 50) {
        setInputError('Please paste at least 50 characters of academic paper text (Abstract, Intro, or Methods).');
        return;
      }
      await onGenerate({
        text: pastedText.trim(),
        difficulty: selectedDifficulty,
        title: paperTitleInput.trim() || 'Pasted Research Paper Excerpt',
      });
    }
  };

  const handleSelectSampleAndFill = (sampleId: string) => {
    const sample = SAMPLE_PAPERS.find(s => s.id === sampleId);
    if (sample) {
      setInputMode('text');
      setPastedText(sample.text);
      setPaperTitleInput(sample.title);
      setInputError(null);
    }
  };

  return (
    <section id="input-section" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="border-b border-slate-200 bg-slate-50/70 p-2 sm:px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => { setInputMode('upload'); setInputError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                inputMode === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload PDF Paper</span>
            </button>
            <button
              type="button"
              onClick={() => { setInputMode('text'); setInputError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                inputMode === 'text'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Paper Text</span>
            </button>
            <button
              type="button"
              onClick={() => { setInputMode('sample'); setInputError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                inputMode === 'sample'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sample Papers</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            Gemini 3.8 Flash Multimodal
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {/* Optional Paper Title Field */}
          <div>
            <label htmlFor="paper-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Paper Title <span className="text-slate-400 font-normal text-xs normal-case">(optional, auto-extracted if empty)</span>
            </label>
            <input
              id="paper-title"
              type="text"
              value={paperTitleInput}
              onChange={(e) => setPaperTitleInput(e.target.value)}
              placeholder="e.g. Attention Is All You Need or Leave blank to extract from paper"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Mode 1: PDF Upload Area */}
          {inputMode === 'upload' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                PDF Research Paper
              </label>

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                      : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Click to select or drag and drop your research paper PDF
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    Standard academic PDFs up to 20MB (IEEE, ACM, arXiv, Nature, Science, etc.)
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50/80 px-3 py-1 rounded-md">
                    <span>Direct Multimodal PDF Analysis via Gemini</span>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for processing
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors shrink-0"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Text Input Fallback */}
          {inputMode === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="pasted-text" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Paste Paper Content / Excerpt
                </label>
                <span className="text-xs text-slate-500 font-mono">
                  {pastedText.length} characters
                </span>
              </div>
              <textarea
                id="pasted-text"
                rows={9}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the abstract, methodology, results, or full paper text here...

Tip: You can paste sections such as:
1. Abstract and Introduction
2. Model Architecture or Experimental Setup
3. Results, Discussions, and Key Findings"
                className="w-full p-3.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-mono leading-relaxed placeholder:font-sans placeholder:text-slate-400"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Minimum 50 characters required for meaningful study synthesis.</span>
                {pastedText && (
                  <button
                    type="button"
                    onClick={() => setPastedText('')}
                    className="text-slate-500 hover:text-slate-800 underline font-medium"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Sample Papers Quick Loader */}
          {inputMode === 'sample' && (
            <div>
              <div className="mb-2">
                <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Select a Curated Research Paper
                </span>
                <p className="text-xs text-slate-500">
                  Instantly explore pre-tested foundational papers without uploading your own file.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PAPERS.map((sample) => (
                  <div
                    key={sample.id}
                    className="border border-slate-200 rounded-lg p-3.5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {sample.title}
                        </span>
                        <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {sample.year}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {sample.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onLoadSample(sample.id)}
                        className="flex-1 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <span>View Study Kit</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectSampleAndFill(sample.id)}
                        className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                      >
                        Load Text
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty Selector: Easy, Medium, Hard */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Study Difficulty Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Easy */}
              <button
                type="button"
                onClick={() => onDifficultyChange('Easy')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedDifficulty === 'Easy'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${selectedDifficulty === 'Easy' ? 'text-emerald-900' : 'text-slate-800'}`}>
                    Easy
                  </span>
                  {selectedDifficulty === 'Easy' && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  High School & Undergrad Intro. Focuses on intuitive analogies and plain foundational concepts.
                </p>
              </button>

              {/* Medium */}
              <button
                type="button"
                onClick={() => onDifficultyChange('Medium')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedDifficulty === 'Medium'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${selectedDifficulty === 'Medium' ? 'text-indigo-900' : 'text-slate-800'}`}>
                    Medium
                  </span>
                  {selectedDifficulty === 'Medium' && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  Undergraduate Depth. Standard scholarly rigor, mathematical intuition, and core mechanisms.
                </p>
              </button>

              {/* Hard */}
              <button
                type="button"
                onClick={() => onDifficultyChange('Hard')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedDifficulty === 'Hard'
                    ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${selectedDifficulty === 'Hard' ? 'text-purple-900' : 'text-slate-800'}`}>
                    Hard
                  </span>
                  {selectedDifficulty === 'Hard' && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  Graduate & Research Level. Mathematical subtleties, ablation analysis, edge cases, and proofs.
                </p>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {inputError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Action Button: Generate Study Kit */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              PaperPilot analyzes <span className="font-semibold text-slate-700">only</span> what you provide. Missing metadata is labeled Unknown.
            </div>

            <button
              type="submit"
              disabled={isLoading || (inputMode === 'upload' && !selectedFile) || (inputMode === 'text' && !pastedText.trim())}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                isLoading || (inputMode === 'upload' && !selectedFile) || (inputMode === 'text' && !pastedText.trim())
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Research Paper...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Study Kit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
