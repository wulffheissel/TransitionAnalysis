import { Text, Modal, Textarea, Input, Radio } from "@nextui-org/react";
import { useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  setSelectedAnalysis,
  selectedAnalysisState,
  selectedAnalysisIndexState,
} from "../../atoms/AnalysesAtom";
import * as Analysis from "../../datatypes/Analysis";
import "./InfoModal.css";

/**
 * Returns a InfoModal component, where information regarding
 * the selected analysis is shown.
 * This component modifies fields of the selected analysis
 * using recoil callbacks.
 */
export function InfoModal() {
  const updateAnalysisAtIndex = useRecoilCallback(setSelectedAnalysis);
  const selectedAnalysis = useRecoilValue(selectedAnalysisState);
  const selectedIndex = useRecoilValue(selectedAnalysisIndexState);
  const [visible, setVisible] = useState(false);

  //Update the name of the selected analysis.
  const updateAnalysisName = (newName: string) => {
    updateAnalysisAtIndex(
      {
        ...selectedAnalysis,
        name: newName,
      },
      selectedIndex,
    );
  };

  // Update the notes of the selected analysis.
  const updateAnalysisNotes = (newNotes: string) => {
    updateAnalysisAtIndex(
      {
        ...selectedAnalysis,
        notes: newNotes,
      },
      selectedIndex,
    );
  };

  //Update the sex of the selected analysis.
  const updateSex = (sexString: string) => {
    let newSex = Analysis.referenceSex.Unknown;
    switch (sexString) {
      case Analysis.referenceSex.Female:
        newSex = Analysis.referenceSex.Female;
        break;
      case Analysis.referenceSex.Male:
        newSex = Analysis.referenceSex.Male;
        break;
    }
    updateAnalysisAtIndex(
      {
        ...selectedAnalysis,
        subjectSex: newSex,
      },
      selectedIndex,
    );
  };

  //Update the region of the selected analysis.
  const updateRegion = (regionString: string) => {
    let newRegion = Analysis.referenceRegion.Na;
    switch (regionString) {
      case Analysis.referenceRegion.Unknown:
        newRegion = Analysis.referenceRegion.Unknown;
        break;
      case Analysis.referenceRegion.Other:
        newRegion = Analysis.referenceRegion.Other;
        break;
    }
    updateAnalysisAtIndex(
      {
        ...selectedAnalysis,
        subjectRegion: newRegion,
      },
      selectedIndex,
    );
  };

  //Update the region of the selected analysis.
  const updateAgeDistribution = (ageDistributionString: string | undefined) => {
    let newDistribution = undefined;
    switch (ageDistributionString) {
      case Analysis.priorAgeDistributionNames.MedievalRuralDk:
        newDistribution = Analysis.priorAgeDistributionNames.MedievalRuralDk;
        break;
      case Analysis.priorAgeDistributionNames.HunterGathererNa:
        newDistribution = Analysis.priorAgeDistributionNames.HunterGathererNa;
        break;
      case Analysis.priorAgeDistributionNames.SubsistenceVillagerNa:
        newDistribution =
          Analysis.priorAgeDistributionNames.SubsistenceVillagerNa;
        break;
      case Analysis.priorAgeDistributionNames.RuralEarlyModernDk:
        newDistribution = Analysis.priorAgeDistributionNames.RuralEarlyModernDk;
        break;
      case Analysis.priorAgeDistributionNames.ModernUnitedStates:
        newDistribution = Analysis.priorAgeDistributionNames.ModernUnitedStates;
        break;
      case Analysis.priorAgeDistributionNames.ModernDenmark:
        newDistribution = Analysis.priorAgeDistributionNames.ModernDenmark;
        break;
    }
    updateAnalysisAtIndex(
      {
        ...selectedAnalysis,
        subjectPriorAgeDistributionName: newDistribution,
      },
      selectedIndex,
    );
  };
  return (
    <div>
      <button
        onClick={() => setVisible((vis) => !vis)}
        className="generalInfoButton"
      >
        Analysis information
      </button>
      <Modal
        closeButton
        aria-labelledby="generalInfoModal"
        width="60%"
        open={visible}
        onClose={() => setVisible((vis) => !vis)}
        scroll
        blur
      >
        <Modal.Header>
          <Text id="generalInfoModal" h2>
            Analysis information
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            label="Analysis title"
            onChange={(e) =>
              updateAnalysisName(e.target.value.replace(/;/g, ""))
            }
            initialValue={selectedAnalysis.name}
          />
          <Radio.Group
            orientation="vertical"
            label="Subject sex"
            size="sm"
            defaultValue={selectedAnalysis.subjectSex}
            onChange={(value: string) => updateSex(value)}
          >
            <Radio value={Analysis.referenceSex.Unknown}>Unknown</Radio>
            <Radio value={Analysis.referenceSex.Female}>Female</Radio>
            <Radio value={Analysis.referenceSex.Male}>Male</Radio>
          </Radio.Group>
          <Radio.Group
            orientation="vertical"
            label="Subject region"
            size="sm"
            defaultValue={selectedAnalysis.subjectRegion}
            onChange={(value: string) => updateRegion(value)}
          >
            <Radio value={Analysis.referenceRegion.Na}>North America</Radio>
            <Radio value={Analysis.referenceRegion.Unknown}>Unknown</Radio>
            <Radio value={Analysis.referenceRegion.Other}>Other</Radio>
          </Radio.Group>
          <Radio.Group
            orientation="vertical"
            label="Subject age distribution"
            size="sm"
            defaultValue={
              selectedAnalysis.subjectPriorAgeDistributionName
                ? selectedAnalysis.subjectPriorAgeDistributionName
                : ""
            }
            onChange={(value: string) => updateAgeDistribution(value)}
          >
            <Radio key={"undoPriorDistributionSelection"} value={""}>
              {"None"}
            </Radio>
            {Object.entries(Analysis.priorAgeDistributionNames).map(
              ([key, value]) => (
                <Radio key={key} value={value}>
                  {value}
                </Radio>
              ),
            )}
          </Radio.Group>
          <Textarea
            label="Analysis notes"
            onChange={(e) =>
              updateAnalysisNotes(e.target.value.replace(/;/g, ""))
            }
            initialValue={selectedAnalysis.notes}
          ></Textarea>
        </Modal.Body>
      </Modal>
    </div>
  );
}
