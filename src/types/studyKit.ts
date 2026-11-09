export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface KeyConcept {
  concept: string;
  summary: string;
  whyItMatters?: string;
}

export interface MultipleChoiceQuestion {
  question: string;
  options: string[]; // exactly 4 options
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface ShortAnswerQuestion {
  question: string;
  sampleHighScoringAnswer: string;
  keyRubricPoints: string[];
}

export interface RealWorldQuestion {
  scenario: string;
  question: string;
  sampleApproach: string;
}

export interface PracticeQuestions {
  difficulty: Difficulty;
  multipleChoice: MultipleChoiceQuestion;
  shortAnswer: ShortAnswerQuestion;
  realWorldApplication: RealWorldQuestion;
}

export interface Flashcard {
  front: string;
  back: string;
  category?: string;
}

export interface PaperMetadata {
  title: string;
  authors: string;
  publicationVenue: string;
  publicationYear: string;
  citationCount: string;
  disclaimer?: string;
}

export interface StudyKitResult {
  paperTitle: string;
  difficulty: Difficulty;
  keyConcepts: KeyConcept[];
  practiceQuestions: PracticeQuestions;
  flashcards: Flashcard[];
  metadata: PaperMetadata;
}
