import { useEffect, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { theme } from './theme';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnalysisPage } from './pages/AnalysisPage/AnalysisPage';
import { TraitCategory } from './datatypes/TraitCategory';
import { getTraitCategories } from './utils';
import { Menu } from './pages/MenuPage/Menu';
import { RecoilRoot } from 'recoil';

/**
 * Creates the graphical user interface of the application.
 * This is responsible for reading the traits.json which it
 * propagates to the child components.
 * @returns The graphical user interface of the application.
 */
export function App() {
  const [traits, setTraits] = useState<TraitCategory[]>([]);

  useEffect(() => {
    setTraits(() => getTraitCategories());
  }, []); //Runs when the component mounts

  if (traits.length === 0) return null;

  return (
    <RecoilRoot>
      <NextUIProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Menu categories={traits} />} />
            <Route
              path="/analysis"
              element={<AnalysisPage categories={traits} />}
            />
          </Routes>
        </HashRouter>
      </NextUIProvider>
    </RecoilRoot>
  );
}
