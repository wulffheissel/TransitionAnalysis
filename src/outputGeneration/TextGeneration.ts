import * as Analysis from "../datatypes/Analysis";
import * as TransistionAnalysis from "../TransitionAnalysis";
import * as utils from "../utils";

function generateTextContent(analysis: Analysis.Analysis) {
  const scores = Analysis.getScores(analysis);
  const estimates = TransistionAnalysis.calculateEstimates(
    scores,
    analysis.subjectSex,
    analysis.subjectRegion,
  );

  // Chi square value should not be affected by prior age distributions
  const chiSquareProbability = TransistionAnalysis.calculateIntervals(
    scores.length,
    estimates,
    TransistionAnalysis.confidenceIntervals.confidence80,
  ).bestEstimateProbability;

  if (analysis.subjectPriorAgeDistributionName) {
    TransistionAnalysis.adjustWithPriorAgeDistribution(
      estimates,
      analysis.subjectPriorAgeDistributionName,
    );
  }

  const confidenceInterval80 = TransistionAnalysis.calculateIntervals(
    scores.length,
    estimates,
    TransistionAnalysis.confidenceIntervals.confidence80,
  );
  const confidenceInterval90 = TransistionAnalysis.calculateIntervals(
    scores.length,
    estimates,
    TransistionAnalysis.confidenceIntervals.confidence90,
  );
  const confidenceInterval95 = TransistionAnalysis.calculateIntervals(
    scores.length,
    estimates,
    TransistionAnalysis.confidenceIntervals.confidence95,
  );

  let content = "";
  content += "Case Name : " + analysis.name + "\n";
  if (analysis.notes) content += "Case notes : " + analysis.notes + "\n";
  content += "Specimen sex : " + analysis.subjectSex + "\n";
  content += "Specimen region : " + analysis.subjectRegion + "\n";
  content += "Results:\n";
  content +=
    "\tOsteological Estimate: " + confidenceInterval80.pointEstimate.toFixed(1) + " years\n";
  content +=
    "\tUnbiased Point Estimate: " + confidenceInterval80.unbiasedPointEstimate.toFixed(1) + " years\n";
  content +=
    "\tDistribution used: " +
    (analysis.subjectPriorAgeDistributionName
      ? analysis.subjectPriorAgeDistributionName
      : "None") +
    "\n";
    
  content +=
    "\tUnbiased confidence 80% : [" +
    confidenceInterval80.unbiasedPointEstimateLowerBound +
    " : " +
    confidenceInterval80.unbiasedPointEstimateUpperBound +
    "]\n";
  content +=
    "\tUnbiased confidence 90% : [" +
    confidenceInterval90.unbiasedPointEstimateLowerBound +
    " : " +
    confidenceInterval90.unbiasedPointEstimateUpperBound +
    "]\n";
  content +=
    "\tUnbiased confidence 95% : [" +
    confidenceInterval95.unbiasedPointEstimateLowerBound +
    " : " +
    confidenceInterval95.unbiasedPointEstimateUpperBound +
    "]\n";

  const curveScores = utils.flattenAnalysisScores(analysis);
  const degreesOfFreedom = utils.getDegreesOfFreedom(curveScores);
  content +=
    "\tChi^2 with " +
    degreesOfFreedom +
    " degrees of freedom: " +
    (-2 * chiSquareProbability).toFixed(5);
  content += "\n";

  content += "\n---------- Observations ----------\n";
  for (const trait of analysis.scores)
    content += trait[0].name + " : " + trait[1].name + "\n";

  return content;
}

/**
 * Converts the analyses to text format and prompts the
 * user to save it to their filesystem.
 * @param analyses The analyses created in the application.
 */
export function generateTextFile(analyses: Analysis.Analysis[]) {
  let content = "";

  for (const analysis of analyses) {
    content += generateTextContent(analysis);
    content += "\n__________________________________\n\n"; // seperator
  }

  window.api.saveTXT(content);
}
