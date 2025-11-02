/**
 * Represents the different types of scores that a trait can have and additional information from these types of scores.
 */
export interface TraitScore {
  name: string;
  description: string;
  scoreValue: [string, number][];
  imagePaths: string[]; // The relative path in the assets/images/ directory
}
