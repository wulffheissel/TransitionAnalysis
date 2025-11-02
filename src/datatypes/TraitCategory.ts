import { Trait } from './Trait';

/**
 * Represents the different types of categories that traits can belong to.
 */
export interface TraitCategory {
  name: string;
  traits: Trait[];
}
