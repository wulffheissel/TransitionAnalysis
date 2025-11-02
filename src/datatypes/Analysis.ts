import { Trait } from "./Trait";
import { TraitScore } from "./TraitScore";

/**
 * Represent an Analysis in the application.
 */
export interface Analysis {
  name: string;
  scores: [Trait, TraitScore][];
  notes?: string;
  subjectSex: referenceSex;
  subjectRegion: referenceRegion;
  subjectPriorAgeDistributionName?: priorAgeDistributionNames;
}

/**
 * The sex of reference for the analysis.
 */
export enum referenceSex {
  Unknown = "unknown",
  Female = "female",
  Male = "male",
}

/**
 * The region of reference for the analysis.
 */
export enum referenceRegion {
  Na = "North America",
  Unknown = "Unknown",
  Other = "Other",
}

/**
 * The names of prior age distributions available for the analysis.
 */
export enum priorAgeDistributionNames {
  HunterGathererNa = "Hunter-Gatherers",
  SubsistenceVillagerNa = "Subsistence Villagers",
  MedievalRuralDk = "Medieval Denmark",
  RuralEarlyModernDk = "Early Modern Rural Denmark",
  ModernUnitedStates = "Modern USA",
  ModernDenmark = "Modern Denmark",
}

/**
 * Retrieve the list of transition curves that has been scored
 * to make an impact on this analysis.
 * @param analysis The analysis to retrieve the scores from.
 * @returns A list of tuples of the type [transitionCurveName, score]. Where transitionCurveName is a string and score is a binary integer (0 or 1)
 */
export function getScores(analysis: Analysis): [string, number][] {
  let scores: [string, number][] = [];
  analysis.scores.forEach((pair: [Trait, TraitScore]) => {
    scores = scores.concat(pair[1].scoreValue);
  });
  return scores;
}
