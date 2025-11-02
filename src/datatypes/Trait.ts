import { TraitScore } from './TraitScore';

/**
 * Represents a trait which can be observed on a skeleton.
 */
export interface Trait {
  name: string;
  location: string;
  scores: TraitScore[];
  operatorInformation: string | undefined;
}
