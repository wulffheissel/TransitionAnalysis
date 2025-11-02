import { atom, CallbackInterface, selector } from 'recoil';
import { Analysis } from '../datatypes/Analysis';

/**
 * Global state variable for the currently selected analysis in the application.
 * This should not be directly available outside of this file.
 */
const selectedAnalysisIndexAtom = atom<number>({
  key: 'selectedAnalysisIndexAtom',
  default: 0,
});

/**
 * Global state variable for the list of all the analyses in the application.
 * This should not be directly available outside of this file and should
 * be modified using recoil callbacks.
 */
const analysesAtom = atom<Analysis[]>({
  key: 'analysesAtom',
  default: [],
});

/**
 * A selector that is used when a component wants to read
 * use the state value that the analysesAtom current has.
 */
export const analysesState = selector({
  key: 'analysesState',
  get: ({ get }) => {
    return get(analysesAtom);
  },
});

/**
 * A selector that is used when a component wants to use
 * the state value of the current analysis.
 */
export const selectedAnalysisState = selector<Analysis>({
  key: 'selectedAnalysisState',
  get: ({ get }) => {
    const index = get(selectedAnalysisIndexAtom);
    const analyses = get(analysesAtom);
    return analyses[index];
  },
});

/**
 * A selector to read the state variable that holds the index
 * of the selected analysis.
 */
export const selectedAnalysisIndexState = selector<number>({
  key: 'selectedAnalysisIndexState',
  get: ({ get }) => {
    return get(selectedAnalysisIndexAtom);
  },
});

// ---------- Recoil Callbacks ----------

/**
 * Add a new analysis to the end of the analyses array.
 */
export const onAppendNewAnalysis =
  ({ set }: CallbackInterface) =>
  (newAnalysis: Analysis) => {
    set(analysesAtom, (currentAnalyses) => {
      return [...currentAnalyses, newAnalysis];
    });
  };

/**
 * Removes the selected analysis from the analyses array.
 */
export const onRemoveAnalysisAtIndex =
  ({ set }: CallbackInterface) =>
  (index: number) => {
    set(analysesAtom, (currentAnalyses) => {
      return [
        ...currentAnalyses.slice(0, index),
        ...currentAnalyses.slice(index + 1),
      ];
    });
  };

/**
 * Update the selected analysis to the given analysis.
 * Precondition: The selected analysis index is not -1.
 */
export const setSelectedAnalysis =
  ({ set }: CallbackInterface) =>
  (newAnalysis: Analysis, index: number) => {
    set(analysesAtom, (currentAnalyses) => {
      return [
        ...currentAnalyses.slice(0, index),
        newAnalysis,
        ...currentAnalyses.slice(index + 1),
      ];
    });
  };

/**
 * Update the index of the selected analysis.
 * Precondition: The index given is in the range [0: analyses.length[
 */
export const setSelectedAnalysisIndex =
  ({ set }: CallbackInterface) =>
  (newIndex: number) => {
    set(selectedAnalysisIndexAtom, () => {
      return newIndex;
    });
  };
