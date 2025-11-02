import * as Datasets from "./Datasets";
import * as Analysis from "./datatypes/Analysis";

/**
 * Calculates the estimate
 * @param transitionCurveScores A tuple containing the transition curves name at the first index and the score with which is was given at the second.
 * @param sex The sex of the subject we have analyzed.
 * @param region The region of the subject we have analyzed.
 * @param ageDistribution The ageDistribution of the subject.
 * @returns
 */
export function calculateEstimates(
  transitionCurveScores: [string, number][],
  sex: Analysis.referenceSex,
  region: Analysis.referenceRegion,
): [number, number][] {
  const estimates: [number, number][] = [];
  const dataset: any = getDataset(sex, region);
  for (const datasetIndex in dataset) {
    let estimate = 0;
    for (
      let scoreIndex = 0;
      scoreIndex < transitionCurveScores.length;
      scoreIndex++
    ) {
      const column =
        dataset[datasetIndex][transitionCurveScores[scoreIndex][0]];
      const sc_i = transitionCurveScores[scoreIndex][1];
      
      const expColumn = Math.pow(Math.E, column);
      const logArg = 1 - expColumn;
      
      // Debug logging to identify -Infinity sources
      if (logArg <= 0) {
        console.warn(`Invalid log argument: 1 - Math.pow(Math.E, ${column}) = ${logArg}`);
        console.warn(`Age: ${dataset[datasetIndex].Age}, Column: ${column}, ExpColumn: ${expColumn}`);
      }
      
      const logValue = logArg > 0 ? Math.log(logArg) : -Infinity;
      estimate += sc_i * column + (1 - sc_i) * logValue;
    }
    estimates.push([dataset[datasetIndex].Age, estimate]);
  }

  return estimates;
}

/**
 * Modifies the given estimates to account for
 * a prior age distribution.
 * Notice that this function applies side effects to
 * the given the list of estimates.
 */
export function adjustWithPriorAgeDistribution(
  estimates: [number, number][],
  priorAgeDistribution: Analysis.priorAgeDistributionNames,
): void {
  const ageDistributionData: any =
    getPriorAgeDistribution(priorAgeDistribution);
  for (let i = 0; i < estimates.length; i++) {
    const distributionValue = ageDistributionData[i]["Distribution"];
    
    // Debug logging to identify -Infinity sources
    if (distributionValue <= 0) {
      console.warn(`Invalid distribution value at index ${i}: ${distributionValue}`);
    }
    
    const logDistribution = distributionValue > 0 ? Math.log(distributionValue) : -Infinity;
    estimates[i][1] = estimates[i][1] + logDistribution;
  }
}

/**
 * Takes the estimates returned by calculateEstimates and the desired confidence interval
 * @param estimates The estimates created by calculateEstimates
 * @param desiredInterval The confidence interval to use.
 * @returns An object containing the bounds and a best estimate.
 */
export function calculateIntervals(
  num_traits: number,
  estimates: [number, number][],
  desiredInterval: confidenceIntervals,
) {
  if (num_traits >= 15)
    return calculateIntervalsLarge(estimates, desiredInterval)
  else
    return calculateIntervalsSmall(estimates, desiredInterval)
}

function calculateIntervalsSmall(
  estimates: [number, number][],
  desiredInterval: confidenceIntervals
) {
  const max = estimates.reduce((x, y) => (x[1] > y[1] ? x : y)); //Finds the entry with the highest probability
  const pointEstimate = max[0];
  const maxLogLik = max[1];

  let chiSquareCritical: number;
  switch (desiredInterval) {
    case confidenceIntervals.confidence95:
      chiSquareCritical = 3.841; // chi-square(1, 0.05)
      break;
    case confidenceIntervals.confidence90:
      chiSquareCritical = 2.706; // chi-square(1, 0.10)
      break;
    case confidenceIntervals.confidence80:
      chiSquareCritical = 1.642; // chi-square(1, 0.20)
      break;
    default:
      // Fallback: convert z-score to chi-square approximation
      chiSquareCritical = desiredInterval * desiredInterval;
  }

  const threshold = chiSquareCritical / 2;
  
  const validAges = estimates
    .filter(entry => {
      const logLikDiff = maxLogLik - entry[1];
      return logLikDiff <= threshold;
    })
    .map(entry => entry[0]);
  
  const lower = Math.min(...validAges);
  const upper = Math.max(...validAges);

  return {
    unbiasedPointEstimateLowerBound: lower > 15 ? lower.toFixed(1) : 15,
    unbiasedPointEstimateUpperBound: upper < 105 ? upper.toFixed(1) : 105,
    unbiasedPointEstimate: pointEstimate,
    pointEstimate: pointEstimate,
    bestEstimateProbability: maxLogLik,
  };
}

function calculateIntervalsLarge(
  estimates: [number, number][],
  desiredInterval: confidenceIntervals
) {
  const max = estimates.reduce((x, y) => (x[1] > y[1] ? x : y)); //Finds the entry with the highest probability
  const pointEstimate = max[0];
  let unbiasedPointEstimate = pointEstimate;

  if (unbiasedPointEstimate > 66.6) {
    const adjustment = 27.31 - 0.41 * pointEstimate;
    unbiasedPointEstimate = unbiasedPointEstimate + adjustment;
  }

  const std =
    -5.27527384555702 +
    0.421493544679886 * unbiasedPointEstimate -
    0.003374894677703 * unbiasedPointEstimate * unbiasedPointEstimate +
    0.00000476501505 * unbiasedPointEstimate * unbiasedPointEstimate * unbiasedPointEstimate;

  let unbiasedPointEstimateLowerBound = unbiasedPointEstimate - desiredInterval * std;
  let unbiasedPointEstimateUpperBound = unbiasedPointEstimate + desiredInterval * std;

  return {
    unbiasedPointEstimateLowerBound: unbiasedPointEstimateLowerBound > 15 ? unbiasedPointEstimateLowerBound.toFixed(1) : 15,
    unbiasedPointEstimateUpperBound: unbiasedPointEstimateUpperBound < 105 ? unbiasedPointEstimateUpperBound.toFixed(1) : 105,
    unbiasedPointEstimate: unbiasedPointEstimate,
    pointEstimate: pointEstimate,
    bestEstimateProbability: max[1],
  };
}

/**
 * The confidence intervals that we use for checking
 * the confidence of an analysis result.
 */
export enum confidenceIntervals {
  confidence80 = 1.282,
  confidence90 = 1.645,
  confidence95 = 1.96,
}

/**
 * Convert the sex of a subject into it's corresponding
 * transition curve dataset.
 * @param sex The sex of the subject we are analyzing.
 * @returns A JSON dataset for the given sex and region.
 */
function getDataset(
  subjectSex: Analysis.referenceSex,
  region: Analysis.referenceRegion,
): Datasets.curveDatasets {
  let dataset = Datasets.curveDatasets.NACurvesUnknown;
  if (
    subjectSex == Analysis.referenceSex.Female &&
    region == Analysis.referenceRegion.Na
  )
    dataset = Datasets.curveDatasets.NACurvesFemale;
  if (
    subjectSex == Analysis.referenceSex.Male &&
    region == Analysis.referenceRegion.Na
  )
    dataset = Datasets.curveDatasets.NACurvesMale;
  if (
    subjectSex == Analysis.referenceSex.Unknown &&
    region == Analysis.referenceRegion.Unknown
  )
    dataset = Datasets.curveDatasets.UnknownCurvesUnknown;
  if (
    subjectSex == Analysis.referenceSex.Female &&
    region == Analysis.referenceRegion.Unknown
  )
    dataset = Datasets.curveDatasets.UnknownCurvesFemale;
  if (
    subjectSex == Analysis.referenceSex.Male &&
    region == Analysis.referenceRegion.Unknown
  )
    dataset = Datasets.curveDatasets.UnknownCurvesMale;
  if (
    subjectSex == Analysis.referenceSex.Unknown &&
    region == Analysis.referenceRegion.Other
  )
    dataset = Datasets.curveDatasets.OtherCurvesUnknown;
  if (
    subjectSex == Analysis.referenceSex.Female &&
    region == Analysis.referenceRegion.Other
  )
    dataset = Datasets.curveDatasets.OtherCurvesFemale;
  if (
    subjectSex == Analysis.referenceSex.Male &&
    region == Analysis.referenceRegion.Other
  )
    dataset = Datasets.curveDatasets.OtherCurvesMale;

  return dataset;
}

/**
 * Convert the ageDistribution of a subject into it's corresponding
 * age distribution dataset.
 * @param dist The distribution of the subject we are analyzing.
 * @returns A JSON dataset for the given ages and distribution.
 */
function getPriorAgeDistribution(
  distributionName: Analysis.priorAgeDistributionNames,
): Datasets.priorAgeDistributionDatasets {
  let distribution = Datasets.priorAgeDistributionDatasets.MedivalRuralDk;
  switch (distributionName) {
    case Analysis.priorAgeDistributionNames.HunterGathererNa:
      distribution = Datasets.priorAgeDistributionDatasets.HunterGathererNa;
      break;
    case Analysis.priorAgeDistributionNames.SubsistenceVillagerNa:
      distribution =
        Datasets.priorAgeDistributionDatasets.SubsistenceVillagerNa;
      break;
    case Analysis.priorAgeDistributionNames.RuralEarlyModernDk:
      distribution = Datasets.priorAgeDistributionDatasets.RuralEarlyModernDk;
      break;
    case Analysis.priorAgeDistributionNames.ModernUnitedStates:
      distribution = Datasets.priorAgeDistributionDatasets.ModernUnitedStates;
      break;
    case Analysis.priorAgeDistributionNames.ModernDenmark:
      distribution = Datasets.priorAgeDistributionDatasets.ModernDenmark;
      break;
  }

  return distribution;
}
