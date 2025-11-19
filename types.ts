
export enum MemoryCategory {
  CHARACTER = 'Character',
  SETTING = 'World Setting',
  PLOT = 'Storyline',
  STYLE = 'Narrative Style'
}

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  name: string;
  description: string;
}

export interface GeneratedFiction {
  title: string;
  content: string;
  date: string;
  language: AppLanguage;
  learningData?: LearningAnalysis;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type AppLanguage = 'en' | 'zh' | 'de' | 'es';

export interface VocabItem {
  id: string; // Unique ID for React keys
  word: string;
  translation: string; // In user's native language (Chinese)
  definition: string;
  partOfSpeech: string;
}

export interface GrammarPoint {
  sentence: string; // The full sentence from the text
  rule: string; // Name of the rule
  explanation: string; // Explanation in Chinese
}

export interface LearningAnalysis {
  vocabulary: VocabItem[];
  grammar: GrammarPoint[];
}

export interface TextbookItem extends VocabItem {
  addedAt: number;
}
