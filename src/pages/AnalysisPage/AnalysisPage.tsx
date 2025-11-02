import { Navbar, Text, Dropdown } from '@nextui-org/react';
import { TraitCategory } from '../../datatypes/TraitCategory';
import { ScoreList } from './ScoreList';
import { useEffect, useState } from 'react';
import { SideMenu } from './SideMenu';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { analysesState } from '../../atoms/AnalysesAtom';
import { generatePDF } from '../../outputGeneration/PDFGeneration';
import { generateTextFile } from '../../outputGeneration/TextGeneration';
import { generateCSV, generateTA3 } from '../../outputGeneration/CSVGeneration';
import { generateCurves } from '../../outputGeneration/CurveGeneration';
import './AnalysisPage.css';

type AnalysisPageProps = {
  categories: TraitCategory[];
};

/**
 * Create the analysis page.
 * This component is the owner of the currentCategory.
 * @param categories The categories available in the analysis
 * @returns An analysis page build with information from the categories
 */
export function AnalysisPage({ categories }: AnalysisPageProps) {
  const analyses = useRecoilValue(analysesState);
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState<TraitCategory>(
    categories[0]
  );

  useEffect(() => {
    if (analyses.length === 0) navigate('/');
  }, [analyses]);

  const handleOutputSelection = (key: string) => {
    switch (key) {
      case 'PDF':
        generatePDF(analyses);
        break;
      case 'TEXT':
        generateTextFile(analyses);
        break;
      case 'CSV':
        generateCSV(analyses, categories); // csv requires names for headers
        break;
      case 'CURVES':
        generateCurves(analyses);
        break;
      case 'TA3':
        generateTA3(analyses);
        break;
    }
  };

  if (analyses.length === 0) return null; // Makes sure we have an analysis on rerender

  return (
    <div className="wrapper">
      <SideMenu
        allCategories={categories}
        currentCategory={currentCategory}
        onSetCurrentCategory={setCurrentCategory}
      />
      <div>
        <Navbar isBordered variant="floating">
          <Navbar.Brand>
            <Text h3 color="inherit">
              TA3-V1.0
            </Text>
          </Navbar.Brand>
          <Navbar.Content>
            <Dropdown>
              <Dropdown.Button>Run Analysis</Dropdown.Button>
              <Dropdown.Menu
                onAction={(k: React.Key) => handleOutputSelection(k.toString())}
              >
                <Dropdown.Section title="Select an output format">
                  <Dropdown.Item
                    key={'TEXT'}
                    description="A simple textual representation"
                  >
                    Text
                  </Dropdown.Item>
                  <Dropdown.Item
                    key={'CSV'}
                    description="Rows with each analysis."
                  >
                    CSV
                  </Dropdown.Item>
                  <Dropdown.Item
                    key={'CURVES'}
                    description="Support curve values in CSV format."
                  >
                    Support curve
                  </Dropdown.Item>
                  <Dropdown.Item
                    key={'PDF'}
                    description="Requires a LaTeX installation"
                  >
                    PDF
                  </Dropdown.Item>
                  <Dropdown.Item
                    key={'TA3'}
                    description="Save analyses in TA3 format"
                  >
                    TA3
                  </Dropdown.Item>
                </Dropdown.Section>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Content>
        </Navbar>
        <ScoreList category={currentCategory} />
      </div>
    </div>
  );
}
