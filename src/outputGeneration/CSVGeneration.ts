import * as Analysis from '../datatypes/Analysis';
import * as TransitionAnalysis from '../TransitionAnalysis';
import { TraitCategory } from '../datatypes/TraitCategory';
import * as utils from '../utils';

export const delimiter = ';';

// The header of the file
const headerWithoutCurves: string =
  'caseName' +
  delimiter +
  'caseNotes' +
  delimiter +
  'specimenSex' +
  delimiter +
  'region' +
  delimiter +
  'priorAgeDistribution' +
  delimiter +
  'age' +
  delimiter +
  'unbiasedLowerBound80' +
  delimiter +
  'unbiasedPointEstimate' +
  delimiter +
  'unbiasedUpperBound80' +
  delimiter +
  'degreesOfFreedom' +
  delimiter +
  'chi^2Value' +
  delimiter;

/**
 * Converts the analysis to a string in CSV format.
 * @param traitCategories The categories used in the analysis.
 * @param name The name of the case
 * @param sex The sex of the case
 * @param region The region of the case
 * @param transitionCurveScores The scores for the case
 * @param notes The notes for the case (if any)
 * @returns A string representation of the analysis in CSV format.
 */
export function generateCSVContentFromCurveScores(
  traitCategories: TraitCategory[],
  name: string,
  sex: Analysis.referenceSex,
  region: Analysis.referenceRegion,
  transitionCurveScores: [string, number][],
  priorDistribution?: Analysis.priorAgeDistributionNames,
  notes?: string
) {
  const estimates = TransitionAnalysis.calculateEstimates(
    transitionCurveScores,
    sex,
    region
  );

  // Chi square value should not be affected by prior age distributions
  const chiSquareProbability = TransitionAnalysis.calculateIntervals(
    transitionCurveScores.length,
    estimates,
    TransitionAnalysis.confidenceIntervals.confidence80
  ).bestEstimateProbability;

  if (priorDistribution) {
    TransitionAnalysis.adjustWithPriorAgeDistribution(
      estimates,
      priorDistribution
    );
  }

  const conf_interval = TransitionAnalysis.calculateIntervals(
    transitionCurveScores.length,
    estimates,
    TransitionAnalysis.confidenceIntervals.confidence80
  );

  let content = '';
  content += name + delimiter;
  content += (notes ? notes.replace(/\n/g, '<nl>') : '') + delimiter;
  content += sex + delimiter;
  content += region + delimiter;
  content += (priorDistribution ? priorDistribution : 'None') + delimiter;
  content += conf_interval.pointEstimate.toFixed(1) + delimiter;
  content += conf_interval.unbiasedPointEstimateLowerBound + delimiter;
  content += conf_interval.unbiasedPointEstimate.toFixed(1) + delimiter;
  content += conf_interval.unbiasedPointEstimateUpperBound + delimiter;
  content += utils.getDegreesOfFreedom(transitionCurveScores) + delimiter;
  content += (-2 * chiSquareProbability).toFixed(5) + delimiter;

  const curveNames: string[] = getCurveNames(traitCategories);
  for (const name of curveNames) {
    const c = transitionCurveScores.find((tuple) => {
      return tuple[0] == name;
    });
    if (c) {
      content += c[1] + delimiter;
    } else content += delimiter;
  }
  content = content.slice(0, -1); // To not make an empty column
  content += '\n';
  return content;
}

/**
 * Converts the analyses to CSV format and prompts the
 * user to save it to their filesystem.
 * @param analyses The analyses created in the application.
 * @param traitCategories The categories that the program used
 */
export function generateCSV(
  analyses: Analysis.Analysis[],
  traitCategories: TraitCategory[]
) {
  const curveNames = getCurveNames(traitCategories);

  let headerCurveNames = '';
  for (const name of curveNames) {
    headerCurveNames += name + delimiter;
  }
  headerCurveNames = headerCurveNames.slice(0, -1); // To not make an empty column

  const header = headerWithoutCurves + headerCurveNames + '\n';
  let content = '';

  for (const analysis of analyses) {
    const transitionCurveScores = utils.flattenAnalysisScores(analysis);

    content += generateCSVContentFromCurveScores(
      traitCategories,
      analysis.name,
      analysis.subjectSex,
      analysis.subjectRegion,
      transitionCurveScores,
      analysis.subjectPriorAgeDistributionName,
      analysis.notes
    );
  }

  window.api.saveCSV(header + content);
}

/**
 * Converts the analyses to CSV format and prompts the
 * user to save it to their filesystem.
 * @param analysisContent The content (CSV row representation of analyses)
 * @param traitCategories The categories that the program used
 */
export function generateCSVFromCurveScores(
  analysisContent: string,
  traitCategories: TraitCategory[]
) {
  const curveNames: string[] = getCurveNames(traitCategories);

  let headerCurveNames = '';
  for (const name of curveNames) {
    headerCurveNames += name + delimiter;
  }
  headerCurveNames = headerCurveNames.slice(0, -1);
  const header = headerWithoutCurves + headerCurveNames + '\n';

  let content = header;
  content += analysisContent;

  window.api.saveCSV(content);
}

/**
 * Helper function to extract the names of the transition curves.
 * Used to generate CSV header, and used to index the scores an analysis when generating CSV.
 * @param traitCategories
 * @returns The categories that the program used
 */
function getCurveNames(traitCategories: TraitCategory[]): string[] {
  let curves: string[] = [];
  for (const traitCat of traitCategories) {
    for (const trait of traitCat.traits) {
      for (const score of trait.scores) {
        for (const scoreValName of score.scoreValue) {
          curves.push(scoreValName[0]);
        }
      }
    }
  }
  // Filter out duplicates
  curves = curves.filter((elem, index, self) => {
    return index === self.indexOf(elem);
  });

  return curves;
}

/**
 * Converts the analyses to ta3 format and prompts the
 * user to save it to their filesystem.
 * @param analyses The analyses created in the application.
 * @param traitCategories The categories that the program used
 */
export function generateTA3(analyses: Analysis.Analysis[]) {
  let content = '[';

  for (let i = 0; i < analyses.length; i++) {
    const scoreReplacement = [];
    for (let j = 0; j < analyses[i].scores.length; j++) {
      scoreReplacement.push({
        traitName: analyses[i].scores[j][0].name,
        scoreName: analyses[i].scores[j][1].name,
      });
    }

    content += JSON.stringify({
      name: analyses[i].name,
      scores: scoreReplacement,
      notes: analyses[i].notes,
      subjectSex: analyses[i].subjectSex,
      subjectRegion: analyses[i].subjectRegion,
      subjectPriorAgeDistributionName: analyses[i].subjectPriorAgeDistributionName,
    });
    content += ',';
  }
  content = content.substring(0, content.length - 1); // remove the last comma
  content += ']';

  window.api.saveTA3(content);
}
