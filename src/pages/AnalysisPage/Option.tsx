import {
  Text,
  Container,
  Radio,
  Card,
  Button,
  Collapse,
} from "@nextui-org/react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  selectedAnalysisIndexState,
  setSelectedAnalysis,
  selectedAnalysisState,
} from "../../atoms/AnalysesAtom";
import { Trait } from "../../datatypes/Trait";
import { TraitScore } from "../../datatypes/TraitScore";
import "./Option.css";

type ScoreProps = {
  score: TraitScore;
};

/**
 * Creates a radio element for a score.
 * @param score The score to create a radio element for
 * @returns A radio element
 */
function Score({ score }: ScoreProps) {
  return (
    <Container key={`container_${score.name}`}>
      <Radio value={score.name} color="secondary">
        <Text>{score.name}</Text>
      </Radio>
    </Container>
  );
}

type CollapseInfoProps = {
  trait: Trait;
};

/**
 * Creates a component for the supplementary information tab.
 * @param trait The trait which we wish the create an additional information tab for
 * @returns A component with the supplementary information.
 */
function CollapseInfo({ trait }: CollapseInfoProps) {
  return (
    <Collapse
      title="Supplementary information"
      bordered
      css={{ width: "100%" }} // NextUI components needs CSS this way
    >
      <div className="collapseContent">
        {trait.operatorInformation && 
          <div>
            <Text b>Operator Information: </Text>
            <Text em>{trait.operatorInformation}</Text>
          </div>
        }
        <div>
          <Text b>Location: </Text>
          <Text em>{trait.location}</Text>
        </div>
        {trait.scores.map((score: TraitScore) => (
          <div key={`collapse_container_${score.name}`}>
            <Text b>{score.name}: </Text>
            <Text em>{score.description}</Text>
            {score.imagePaths.length > 0 && (
              <div className="pictureRow">
                {score.imagePaths.map((path, i) => (
                  <img
                    key={i}
                    className="scoreIMG"
                    src={`./assets/images/${path}`}
                    alt="Score"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Collapse>
  );
}

type OptionProps = {
  trait: Trait;
};

/**
 * Create an option box for a trait.
 * This component is responsible for showing the score options available
 * and updates the analyses atom, when a selecting is made.
 * @param trait The trait for which we wish to display an option box for.
 * @returns An option component for the given trait.
 */
export function Option({ trait }: OptionProps) {
  const selectedIndex = useRecoilValue(selectedAnalysisIndexState);
  const selectedAnalysis = useRecoilValue(selectedAnalysisState);
  const updateAnalysisAtIndex = useRecoilCallback(setSelectedAnalysis);
  const scoredAs = selectedAnalysis.scores.find((p) => p[0] === trait);

  // Clears a selection from the selected analysis
  const clearChoice = () => {
    const indexOfScore = selectedAnalysis.scores.findIndex(
      (tuple) => tuple[0] === trait
    );
    const newScores = [
      ...selectedAnalysis.scores.slice(0, indexOfScore),
      ...selectedAnalysis.scores.slice(indexOfScore + 1),
    ];

    const newAnalysis = {
      ...selectedAnalysis,
      scores: newScores,
    };
    updateAnalysisAtIndex(newAnalysis, selectedIndex);
  };

  // Updates an observation in the selected analysis for the trait
  const onChange = (score: TraitScore) => {
    const indexOfScore = selectedAnalysis.scores.findIndex(
      (tuple) => tuple[0] === trait
    );
    const oldScores = selectedAnalysis.scores;
    const newScores: [Trait, TraitScore][] =
      indexOfScore === -1 // A new observation
        ? [...oldScores, [trait, score]]
        : // update an existing observation
          [
            ...oldScores.slice(0, indexOfScore),
            [trait, score],
            ...oldScores.slice(indexOfScore + 1),
          ];
    updateAnalysisAtIndex(
      {
        ...selectedAnalysis,
        scores: newScores,
      },
      selectedIndex
    );
  };

  return (
    <div className="traitOption" key={`container_${trait.name}`}>
      <Card>
        <Card.Header className="cardHeader">
          <Text h2>{trait.name}</Text>
          <Button rounded color="secondary" size="sm" onPress={clearChoice}>
            Clear choice
          </Button>
        </Card.Header>
        <Card.Divider />
        <Card.Body>
          <Radio.Group
            aria-label={`radio_group_${trait.name}`}
            orientation="horizontal"
            key={`radio_group_${trait.name}`}
            value={scoredAs ? scoredAs[1].name : ""}
            onChange={(scoreName) => {
              const score = trait.scores.find((s) => s.name === scoreName);
              if (score) onChange(score);
            }}
          >
            {trait.scores.map((score: TraitScore) => (
              <Score key={`score_${score.name}`} score={score} />
            ))}
          </Radio.Group>
        </Card.Body>
        <Card.Footer>
          <CollapseInfo trait={trait} />
        </Card.Footer>
      </Card>
    </div>
  );
}
