import { create } from 'zustand';
import { DIMENSIONS, Dimension } from '../data/content';

export type Phase = 'onboarding' | 'solo_p1' | 'intermission' | 'solo_p2' | 'duo' | 'resolution';

export type Answer = {
  questionId: string;
  value: number | string; // number (1-3) for range, string for text
};

interface SessionState {
  phase: Phase;
  partner1Answers: Record<string, Answer>; // Keyed by Dimension ID + Question Index (e.g. "1-0")
  partner2Answers: Record<string, Answer>;
  currentDimensionIndex: number; // 0-4
  duoCompletedDimensions: string[]; // IDs of completed dimensions
  
  // Actions
  setPhase: (phase: Phase) => void;
  setAnswer: (partner: 1 | 2, dimensionId: string, questionIndex: number | 'last', value: number | string) => void;
  nextDimension: () => void;
  resetDimension: () => void;
  getSortedDuoDimensions: () => Dimension[];
  debug_randomizeAndSkipToDuo: () => void;
  debug_setDimensionIndex: (index: number) => void; // New debug action
}

export const useSessionStore = create<SessionState>((set, get) => ({
  phase: 'onboarding',
  partner1Answers: {},
  partner2Answers: {},
  currentDimensionIndex: 0,
  duoCompletedDimensions: [],

  setPhase: (phase) => set({ phase }),
  
  setAnswer: (partner, dimensionId, questionIndex, value) => {
    const key = `${dimensionId}-${questionIndex}`;
    const answer: Answer = { questionId: key, value };
    
    if (partner === 1) {
      set((state) => ({ partner1Answers: { ...state.partner1Answers, [key]: answer } }));
    } else {
      set((state) => ({ partner2Answers: { ...state.partner2Answers, [key]: answer } }));
    }
  },

  nextDimension: () => {
    const { currentDimensionIndex, phase } = get();
    if (currentDimensionIndex < DIMENSIONS.length - 1) {
      set({ currentDimensionIndex: currentDimensionIndex + 1 });
    } else {
      // Phase transition logic handled by UI components usually, but helper here:
      if (phase === 'solo_p1') set({ phase: 'intermission', currentDimensionIndex: 0 });
      else if (phase === 'solo_p2') set({ phase: 'duo', currentDimensionIndex: 0 });
    }
  },

  resetDimension: () => set({ currentDimensionIndex: 0 }),

  getSortedDuoDimensions: () => {
    const { partner1Answers, partner2Answers } = get();
    
    // Calculate scores for each dimension
    const scores = DIMENSIONS.map(dim => {
      let s1 = 0;
      let s2 = 0;
      
      const calcScore = (answers: Record<string, Answer>) => {
         let s = 0;
         let c = 0;
         // Check up to 10 possible questions to be safe, though usually 3-4
         for(let i=0; i<10; i++) {
           const k = `${dim.id}-${i}`;
           if (answers[k] && typeof answers[k].value === 'number') {
             s += answers[k].value as number;
             c++;
           }
         }
         return c === 0 ? 0 : s / c; // Average score
      };

      s1 = calcScore(partner1Answers);
      s2 = calcScore(partner2Answers);

      return {
        dimension: dim,
        score: s1 + s2 // Lower is "worse" / higher priority for Duo
      };
    });

    // Sort by score ascending (Lowest first)
    return scores.sort((a, b) => a.score - b.score).map(s => s.dimension);
  },

  debug_randomizeAndSkipToDuo: () => {
    const p1: Record<string, Answer> = {};
    const p2: Record<string, Answer> = {};

    DIMENSIONS.forEach(dim => {
      // Randomize range questions (assuming 3 per dim)
      for (let i = 0; i < dim.guidingQuestions.length; i++) {
        const val1 = Math.floor(Math.random() * 3) + 1; // 1-3
        const val2 = Math.floor(Math.random() * 3) + 1; // 1-3
        
        p1[`${dim.id}-${i}`] = { questionId: `${dim.id}-${i}`, value: val1 };
        p2[`${dim.id}-${i}`] = { questionId: `${dim.id}-${i}`, value: val2 };
      }
      // 'last' question
      p1[`${dim.id}-last`] = { questionId: `${dim.id}-last`, value: 'Skipped by Debug' };
      p2[`${dim.id}-last`] = { questionId: `${dim.id}-last`, value: 'Skipped by Debug' };
    });

    set({
      partner1Answers: p1,
      partner2Answers: p2,
      phase: 'duo',
      currentDimensionIndex: 0,
    });
  },

  debug_setDimensionIndex: (index: number) => {
    set({ currentDimensionIndex: index });
  }
}));
