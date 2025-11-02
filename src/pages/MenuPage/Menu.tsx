import { Button, Spacer, Text } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useRecoilCallback } from "recoil";
import { Trait } from "../../../src/datatypes/Trait";
import { TraitScore } from "../../../src/datatypes/TraitScore";
import { onAppendNewAnalysis } from "../../atoms/AnalysesAtom";
import * as Analysis from "../../datatypes/Analysis";
import { TraitCategory } from "../../datatypes/TraitCategory";
import {
  delimiter,
  generateCSVContentFromCurveScores,
  generateCSVFromCurveScores,
} from "../../outputGeneration/CSVGeneration";
import "./Menu.css";

/**
 * Reads each analysis provided in file.
 */
function runFromCSV(csvStringRows: string[], categories: TraitCategory[]) {
  if (csvStringRows.length > 1) {
    const headers = csvStringRows[0].trim().split(delimiter);

    let content = "";
    for (let i = 1; i < csvStringRows.length-1; i++) {
      const analysis = csvStringRows[i].slice(0,-1).split(delimiter);

      const name = analysis[0];
      const notes = analysis[1];

      let sex = Analysis.referenceSex.Unknown;
      const sex_entry = analysis[2].toUpperCase().trim()
      if (sex_entry === Analysis.referenceSex.Male.toUpperCase())
        sex = Analysis.referenceSex.Male;
      else if (sex_entry === Analysis.referenceSex.Female.toUpperCase())
        sex = Analysis.referenceSex.Female;

      let region = Analysis.referenceRegion.Na;
      const region_entry = analysis[3].toUpperCase().trim()
      if (region_entry === Analysis.referenceRegion.Unknown.toUpperCase())
        region = Analysis.referenceRegion.Unknown;
      else if (region_entry === Analysis.referenceRegion.Other.toUpperCase())
        region = Analysis.referenceRegion.Other;

      let pad = undefined;
      const pad_entry = analysis[4].toUpperCase().trim()
      if (pad_entry === Analysis.priorAgeDistributionNames.MedievalRuralDk.toUpperCase() || pad_entry === "MEDIEVALDK")
        pad = Analysis.priorAgeDistributionNames.MedievalRuralDk
      else if (pad_entry === Analysis.priorAgeDistributionNames.ModernDenmark.toUpperCase() || pad_entry === "MODERNDK")
        pad = Analysis.priorAgeDistributionNames.ModernDenmark
      else if (pad_entry === Analysis.priorAgeDistributionNames.ModernUnitedStates.toUpperCase() || pad_entry === "MODERNUS")
        pad = Analysis.priorAgeDistributionNames.ModernUnitedStates
      else if (pad_entry === Analysis.priorAgeDistributionNames.RuralEarlyModernDk.toUpperCase() || pad_entry === "RURALEARLYMODERNDK")
        pad = Analysis.priorAgeDistributionNames.RuralEarlyModernDk
      else if (pad_entry === Analysis.priorAgeDistributionNames.SubsistenceVillagerNa.toUpperCase() || pad_entry === "SUBSISTENCEVILLAGER")
        pad = Analysis.priorAgeDistributionNames.SubsistenceVillagerNa
      else if (pad_entry === Analysis.priorAgeDistributionNames.HunterGathererNa.toUpperCase() || pad_entry === "HUNTERGATHERER")
        pad = Analysis.priorAgeDistributionNames.HunterGathererNa;


      const transitionCurveScores: [string, number][] = [];
      
      for (let i = 5; i < analysis.length; i++) {
        if (headers[i] != "unbiasedLowerBound80" && headers[i] != "unbiasedPointEstimate " && headers[i] != "unbiasedUpperBound80" && headers[i] != "degreesOfFreedom" && headers[i] != "chi^2Value" && headers[i] != "age")
          if (analysis[i] == "0" || analysis[i] == "1") 
            transitionCurveScores.push([headers[i], +analysis[i]]); // +analysis[i] === parseInt(analysis[i])
      }
    
      // Generate the row in CSV format of this analysis
      content += generateCSVContentFromCurveScores(
        categories,
        name,
        sex,
        region,
        transitionCurveScores,
        pad,
        notes,
      );
    }
    // Generate file from analyses
    generateCSVFromCurveScores(content, categories);
  }
}

/**
 * Reads a .ta3 file and sets up the current workspace
 * with respect to the information in this.
 */
function readFromTA3(
  jsonObjectArray: string,
  categories: TraitCategory[],
  addAnalysis: (analysis: Analysis.Analysis) => void,
) {
  const traits: Trait[] = [];
  for (const traitCat of categories)
    for (const trait of traitCat.traits) traits.push(trait);

  const analyses = JSON.parse(jsonObjectArray);

  for (let i = 0; i < analyses.length; i++) {
    const loadScores: [Trait, TraitScore][] = [];
    for (let s = 0; s < analyses[i].scores.length; s++) {
      const scoreObj = analyses[i].scores[s];

      const trait = traits.find((t) => t.name === scoreObj.traitName.trim());
      const score: TraitScore | undefined = trait?.scores.find(
        (s) => s.name === scoreObj.scoreName.trim(),
      );
      if (trait && score) loadScores.push([trait, score]);

      
    }
    addAnalysis({
      name: analyses[i].name,
      scores: loadScores,
      notes: analyses[i].notes,
      subjectSex: analyses[i].subjectSex,
      subjectRegion: analyses[i].subjectRegion,
      subjectPriorAgeDistributionName: analyses[i].subjectPriorAgeDistributionName,
    });
  }
}

type MenuProps = {
  categories: TraitCategory[];
};

/**
 * Creates a Menu page element, which is used to initialize
 * an analysis by either making a new one or opening from
 * a csv file.
 * @param categories The categories for traits used.
 * @returns A Menu page.
 */
export function Menu({ categories }: MenuProps) {
  const addAnalysis = useRecoilCallback(onAppendNewAnalysis);
  const navigate = useNavigate();

  const handleNewAnalysis = () => {
    addAnalysis({
      name: "Unnamed Analysis",
      scores: [],
      subjectSex: Analysis.referenceSex.Unknown,
      subjectRegion: Analysis.referenceRegion.Na,
    });
    navigate("/analysis");
  };

  const handleRunFromFile = async () => {
    const csvStringRows: string[] = await window.api.readCSV();
    runFromCSV(csvStringRows, categories);
    navigate("/analysis");
  };

  const handleOpenFromFileTA3 = async () => {
    const jsonStringRows: string = await window.api.readTA3();
    if (jsonStringRows.length > 0)
      readFromTA3(jsonStringRows, categories, addAnalysis);
    navigate("/analysis");
  };

  return (
    <div className="menu_wrapper">
      <Text h1>TA3-1.0</Text>
      <div className="menu_items">
        <Text h2> Menu </Text>
        <Button onPress={handleNewAnalysis} size={"lg"}>
          Start a new analysis
        </Button>
        <Spacer />
        <Button onPress={handleRunFromFile} size={"lg"}>
          Run from CSV file
        </Button>
        <Spacer />
        <Button onPress={handleOpenFromFileTA3} size={"lg"}>
          Open from TA3 file
        </Button>
      </div>
    </div>
  );
}
