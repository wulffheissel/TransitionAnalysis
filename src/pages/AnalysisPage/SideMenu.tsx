import { Text, Spacer, Divider } from "@nextui-org/react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  onAppendNewAnalysis,
  onRemoveAnalysisAtIndex,
  selectedAnalysisState,
  analysesState,
  setSelectedAnalysisIndex,
  selectedAnalysisIndexState,
} from "../../atoms/AnalysesAtom";
import {
  priorAgeDistributionNames,
  referenceRegion,
  referenceSex,
} from "../../datatypes/Analysis";
import { TraitCategory } from "../../datatypes/TraitCategory";
import "./SideMenu.css";
import { InfoModal } from "./InfoModal";

type SideMenuProps = {
  allCategories: TraitCategory[];
  currentCategory: TraitCategory;
  onSetCurrentCategory: (category: TraitCategory) => void;
};

export function SideMenu({
  allCategories,
  currentCategory,
  onSetCurrentCategory,
}: SideMenuProps) {
  const analyses = useRecoilValue(analysesState);
  const addAnalysis = useRecoilCallback(onAppendNewAnalysis);
  const removeAnalysis = useRecoilCallback(onRemoveAnalysisAtIndex);
  const selectedAnalysis = useRecoilValue(selectedAnalysisState);
  const selectedIndex = useRecoilValue(selectedAnalysisIndexState);
  const updateSelectedIndex = useRecoilCallback(setSelectedAnalysisIndex);

  const removeAnalysisAndUpdateCurrent = () => {
    removeAnalysis(selectedIndex);
    updateSelectedIndex(0);
  };

  const onUpdateCategory = (category: TraitCategory) => {
    onSetCurrentCategory(category);
    window.scrollTo(0, 0);
  };

  const onUpdateSelectedIndex = (index: number) => {
    updateSelectedIndex(index);
    window.scrollTo(0, 0);
  };

  return (
    <div className="sideMenu">
      <Text h2 className="ellipsisText">
        {selectedAnalysis.name}
      </Text>
      <InfoModal />
      <Spacer />
      <button
        className="newAnalysisButton"
        onClick={() => {
          addAnalysis({
            name: "Unnamed Analysis",
            scores: [],
            subjectSex: referenceSex.Unknown,
            subjectRegion: referenceRegion.Na,
          });
        }}
      >
        Add new analysis
      </button>
      <Spacer />
      <button
        onClick={removeAnalysisAndUpdateCurrent}
        className="deleteAnalysisButton"
      >
        Delete current analysis
      </button>
      <Spacer />
      <Divider />
      <Spacer />
      <div className="buttonGroup">
        {analyses.map((analysis, index) => (
          <button
            key={`analysisButton_${analysis.name}_${index}`}
            onClick={() => onUpdateSelectedIndex(index)}
            disabled={selectedAnalysis === analysis}
            className="selectionButton"
          >
            <span className="ellipsisText">{analysis.name}</span>
          </button>
        ))}
      </div>
      <Spacer />
      <Divider />
      <Text h2>Categories</Text>
      <div className="buttonGroup">
        {allCategories.map((category) => (
          <button
            key={`button_${category.name}`}
            onClick={() => onUpdateCategory(category)}
            disabled={currentCategory === category}
            className="selectionButton"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
