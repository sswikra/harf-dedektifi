export interface StageItem {
  id: string;
  name: string;
  highlightHtml: string;
  syllables: string[];
  targetLetter: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  w: number; // percentage
  h: number; // percentage
  clue: string;
}

export interface LetterStage {
  id: string;
  letter: string;
  group: 4 | 5; // MEB Maarif Modeli Ses Grubu
  color: string;
  bgSoft: string;
  title: string;
  instruction: string;
  image: string;
  items: StageItem[];
}

export interface StageProgress {
  foundItemIds: string[];
  stars: number;
  completed: boolean;
  hintsUsed: number;
}

export type AllProgress = Record<string, StageProgress>;
