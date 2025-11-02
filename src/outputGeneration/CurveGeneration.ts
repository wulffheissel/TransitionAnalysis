import * as Analysis from "../datatypes/Analysis";
import { calculateEstimates, adjustWithPriorAgeDistribution } from "../TransitionAnalysis";

export const delimiter = ";";

/**
 * Converts the analysis to a string in CSV format.
 * @param analysis The analysis to convert.
 * @returns A string representation of the analysis in CSV format.
 */
function generateCSVCurveContent(analysis: Analysis.Analysis) {
  const scores = Analysis.getScores(analysis);
  const estimates = calculateEstimates(
    scores,
    analysis.subjectSex,
    analysis.subjectRegion,
  );

  if (analysis.subjectPriorAgeDistributionName) {
      adjustWithPriorAgeDistribution(
        estimates,
        analysis.subjectPriorAgeDistributionName,
      );
    }

  let content = analysis.name + delimiter;

  for (let index = 0; index < estimates.length; index++) {
    content += estimates[index][1] + delimiter;
  }

  content += "\n";
  return content;
}

/**
 * Converts the analyses to CSV format and prompts the
 * user to save it to their filesystem.
 * @param analyses The analyses created in the application.
 */
export function generateCurves(analyses: Analysis.Analysis[]) {
  const allEstimates: { name: string; estimates: [number, number][] }[] = [];
  
  for (const analysis of analyses) {
    const scores = Analysis.getScores(analysis);
    const estimates = calculateEstimates(
      scores,
      analysis.subjectSex,
      analysis.subjectRegion,
    );

    if (analysis.subjectPriorAgeDistributionName) {
      adjustWithPriorAgeDistribution(
        estimates,
        analysis.subjectPriorAgeDistributionName,
      );
    }

    allEstimates.push({
      name: analysis.name,
      estimates: estimates
    });
  }

  let header = "Age";
  for (const analysisData of allEstimates) {
    header += delimiter + analysisData.name;
  }
  header += "\n";

  let content = header;
  if (allEstimates.length > 0) {
    for (let index = 0; index < allEstimates[0].estimates.length; index++) {
      const age = allEstimates[0].estimates[index][0];
      let row = age.toFixed(1);
      
      for (const analysisData of allEstimates) {
        const value = analysisData.estimates[index] ? analysisData.estimates[index][1] : "";
        row += delimiter + value;
      }
      row += "\n";
      content += row;
    }

  }

  window.api.saveCSV(content);
}
