import { Trait } from './datatypes/Trait';
import { TraitCategory } from './datatypes/TraitCategory';
import { TraitScore } from './datatypes/TraitScore';
import traits from '../assets/traits.json';
import { Analysis } from './datatypes/Analysis';

/**
 * Retrieve all the trait categories.
 * @returns A list of all the trait categories.
 */
export function getTraitCategories(): TraitCategory[] {
  const traitsJSON = traits;
  let categories: TraitCategory[] = [];

  for (const cat in traitsJSON) {
    let traits: Trait[] = [];
    for (const trait in traitsJSON[cat].traits) {
      let traitScores: TraitScore[] = [];

      let operatorinfo: string | undefined =
        traitsJSON[cat].traits[trait].operatorInformation;

      for (const score in traitsJSON[cat].traits[trait].scores) {
        let imgs: string[] = [];
        if ('imagePaths' in traitsJSON[cat].traits[trait].scores[score])
          //@ts-ignore -- since we are sure it is there after the check, but typescript doesn't realize.
          imgs = traitsJSON[cat].traits[trait].scores[score].imagePaths;

        traitScores.push({
          name: traitsJSON[cat].traits[trait].scores[score].scoreName,
          description:
            traitsJSON[cat].traits[trait].scores[score].scoreDescription,
          scoreValue: traitsJSON[cat].traits[trait].scores[score]
            .scoreValue as [string, number][],
          imagePaths: imgs,
        });
      }

      traits.push({
        name: traitsJSON[cat].traits[trait].traitName,
        location: traitsJSON[cat].traits[trait].traitLocation,
        scores: traitScores,
        operatorInformation: operatorinfo,
      });
    }
    categories.push({ name: traitsJSON[cat].categoryName, traits: traits });
  }
  return categories;
}

/**
 * Calculates the number of degrees of freedom.
 * Done by counting unique curve names (except for last char, since similar names refer to the same trait)
 * @param transitionCurveScores The scores for the case
 * @returns the degrees of freedom
 */
export function getDegreesOfFreedom(transitionCurveScores: [string, number][]) {
  // Filter out duplicates
  let seen: Set<string> = new Set();
  let x: [string, number][] = transitionCurveScores.filter(([item, _]) => {
    let key: string = item.slice(0, -1); // Exclude the last character from the comparison
    if (!seen.has(key)) {
      seen.add(key);
      return true;
    }
    return false;
  });

  return x.length - 1;
}

/**
 * Flattens the scores of an analysis object.
 * @param analysis The analysis we extract scores from
 * @returns A list of tuples corresponding to the curves and their respective scores.
 */
export function flattenAnalysisScores(analysis: Analysis) {
  let transitionCurveScores: [string, number][] = [];

  for (const score of analysis.scores) {
    for (const val of score[1].scoreValue) {
      transitionCurveScores.push(val);
    }
  }
  return transitionCurveScores;
}
