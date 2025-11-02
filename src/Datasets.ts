/**
    This file contains all the imported datasets
    which are used throughout the program.
*/

// NA Datasets
import NACurvesUnknownJSON from "../assets/transitionCurves/northAmerica/NACurvesUnknown.csv";
import NACurvesFemaleJSON from "../assets/transitionCurves/northAmerica/NACurvesFemale.csv";
import NACurvesMaleJSON from "../assets/transitionCurves/northAmerica/NACurvesMale.csv";
// DK Datasets
import UnknownCurvesUnknownJSON from "../assets/transitionCurves/unknown/UnknownCurvesUnknown.csv";
import UnknownCurvesFemaleJSON from "../assets/transitionCurves/unknown/UnknownCurvesFemale.csv";
import UnknownCurvesMaleJSON from "../assets/transitionCurves/unknown/UnknownCurvesMale.csv";
// EU Datasets
import OtherCurvesUnknownJSON from "../assets/transitionCurves/other/OtherCurvesUnknown.csv";
import OtherCurvesFemaleJSON from "../assets/transitionCurves/other/OtherCurvesFemale.csv";
import OtherCurvesMaleJSON from "../assets/transitionCurves/other/OtherCurvesMale.csv";

/**
 * Holds the data from the reference datasets in json format.
 */
export enum curveDatasets {
  NACurvesUnknown = NACurvesUnknownJSON,
  NACurvesFemale = NACurvesFemaleJSON,
  NACurvesMale = NACurvesMaleJSON,
  UnknownCurvesUnknown = UnknownCurvesUnknownJSON,
  UnknownCurvesFemale = UnknownCurvesFemaleJSON,
  UnknownCurvesMale = UnknownCurvesMaleJSON,
  OtherCurvesUnknown = OtherCurvesUnknownJSON,
  OtherCurvesFemale = OtherCurvesFemaleJSON,
  OtherCurvesMale = OtherCurvesMaleJSON,
}

import MedivalRuralDkDataset from "../assets/priorAgeDistributions/MedivalRuralDk.csv";
import HunterGathererNaDataset from "../assets/priorAgeDistributions/HunterGathererNa.csv";
import SubsistenceVillagerNaDataset from "../assets/priorAgeDistributions/SubsistenceVillagerNa.csv";
import RuralEarlyModernDkDataset from "../assets/priorAgeDistributions/RuralEarlyModernDk.csv";
import ModernUnitedStatesDataset from "../assets/priorAgeDistributions/ModernUnitedStates.csv";
import ModernDenmarkDataset from "../assets/priorAgeDistributions/ModernDenmark.csv";

export enum priorAgeDistributionDatasets {
  MedivalRuralDk = MedivalRuralDkDataset,
  HunterGathererNa = HunterGathererNaDataset,
  SubsistenceVillagerNa = SubsistenceVillagerNaDataset,
  RuralEarlyModernDk = RuralEarlyModernDkDataset,
  ModernUnitedStates = ModernUnitedStatesDataset,
  ModernDenmark = ModernDenmarkDataset,
}
