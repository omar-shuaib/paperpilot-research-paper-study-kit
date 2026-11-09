import React, { useState } from 'react';
import { CheckSquare, HelpCircle, FileCheck, Globe, CheckCircle2, XCircle, RotateCcw, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { PracticeQuestions } from '../types/studyKit';

interface PracticeQuestionsSectionProps {
  questions: PracticeQuestions;
}

export const PracticeQuestionsSection: React.FC<PracticeQuestionsSectionProps> = ({ questions }) => {
  // MCQ state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedMCQ, setHasSubmittedMCQ] = useState<boolean>(false);

  // Short Answer state
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);

  // Real world state
  const [showRealWorldSolution, setShowRealWorldSolution] = useState<boolean>(false);

  const { multipleChoice, shortAnswer, realWorldApplication, difficulty } = questions;

  const handleOptionClick = (index: number) => {
    if (hasSubmittedMCQ) return;
    setSelectedOption(index);
    setHasSubmittedMCQ(true);
  };

  const handleResetMCQ = () => {
    setSelectedOption(null);
    setHasSubmittedMCQ(false);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  const getDifficultyBadgeColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Hard':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    }
  };

  return (
    <section id="practice-section" className="py-8 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase mb-1">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Section B</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Practice Exam Questions
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Level-calibrated questions to test comprehension, short-answer recall, and real-world transfer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Calibrated for:</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getDifficultyBadgeColor(difficulty)}`}>
              {difficulty} Level
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1: Multiple Choice Question */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center font-mono border border-indigo-100">
                  1
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Multiple Choice Question
                </span>
              </div>

              {hasSubmittedMCQ && (
                <button
                  type="button"
                  onClick={handleResetMCQ}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>

            <h3 className="text-base font-semibold text-slate-900 mb-4 leading-relaxed">
              {multipleChoice.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {multipleChoice.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === multipleChoice.correctIndex;

                let buttonStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 text-slate-700';

                if (hasSubmittedMCQ) {
                  if (isCorrect) {
                    buttonStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 line-through';
                  } else {
                    buttonStyle = 'border-slate-200 opacity-60 text-slate-500';
                  }
                }

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={hasSubmittedMCQ}
                    onClick={() => handleOptionClick(index)}
                    className={`w-full p-3.5 rounded-lg border text-left text-sm transition-all flex items-start gap-3 ${buttonStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        hasSubmittedMCQ && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : hasSubmittedMCQ && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {optionLetters[index]}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>

                    {hasSubmittedMCQ && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {hasSubmittedMCQ && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* MCQ Explanation Box */}
            {hasSubmittedMCQ && (
              <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200/80 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  {selectedOption === multipleChoice.correctIndex ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct! Well done.
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Incorrect. Correct option was {optionLetters[multipleChoice.correctIndex]}.
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-800">Explanation: </span>
                  {multipleChoice.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Question 2: Short-Answer Question with Sample High-Scoring Answer */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center font-mono border border-indigo-100">
                2
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Short-Answer Question & Rubric
              </span>
            </div>

            <h3 className="text-base font-semibold text-slate-900 mb-3 leading-relaxed">
              {shortAnswer.question}
            </h3>

            {/* Student Practice Input Box */}
            <div className="mb-4">
              <textarea
                rows={3}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your practice response here before viewing the exemplar..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Reveal Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showModelAnswer ? 'Hide Sample High-Scoring Answer' : 'Reveal Sample High-Scoring Answer & Rubric'}</span>
              </button>

              {studentAnswer.trim() && (
                <span className="text-[11px] text-slate-400">
                  {studentAnswer.trim().split(/\s+/).length} words drafted
                </span>
              )}
            </div>

            {/* Revealed Model Answer & Rubric */}
            {showModelAnswer && (
              <div className="mt-4 p-4 rounded-lg bg-indigo-50/50 border border-indigo-100/80 space-y-3 animate-in fade-in duration-200">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Sample High-Scoring Answer (Exemplar):</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed bg-white/90 p-3 rounded border border-indigo-100/60 font-sans">
                    {shortAnswer.sampleHighScoringAnswer}
                  </p>
                </div>

                {shortAnswer.keyRubricPoints && shortAnswer.keyRubricPoints.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Key Rubric Criteria for Full Credit:
                    </span>
                    <ul className="space-y-1">
                      {shortAnswer.keyRubricPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Question 3: Real-World Application Question */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center font-mono border border-indigo-100">
                3
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Real-World Application Question
              </span>
            </div>

            {/* Scenario Box */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 mb-3 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                Scenario:
              </span>
              {realWorldApplication.scenario}
            </div>

            <h3 className="text-base font-semibold text-slate-900 mb-3 leading-relaxed">
              {realWorldApplication.question}
            </h3>

            {/* Solution toggle */}
            <button
              type="button"
              onClick={() => setShowRealWorldSolution(!showRealWorldSolution)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {showRealWorldSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showRealWorldSolution ? 'Hide Guided Application Analysis' : 'Show Guided Application Analysis'}</span>
            </button>

            {showRealWorldSolution && (
              <div className="mt-3.5 p-4 rounded-lg bg-emerald-50/40 border border-emerald-200/60 animate-in fade-in duration-200">
                <span className="text-xs font-bold text-emerald-950 block mb-1">
                  How This Research Resolves The Scenario:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {realWorldApplication.sampleApproach}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
