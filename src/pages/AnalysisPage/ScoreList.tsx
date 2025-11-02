import { Container, Text } from '@nextui-org/react';
import { Trait } from '../../datatypes/Trait';
import { TraitCategory } from '../../datatypes/TraitCategory';
import { Option } from './Option';

type OptionElementProps = {
  trait: Trait;
};

/**
 * Create an OptionElement for the given trait.
 * @param trait The trait to create an option element for
 * @returns An OptionElement for the trait.
 */
function OptionElement({ trait }: OptionElementProps) {
  return <Option trait={trait} />;
}

type ScoreListProps = {
  category: TraitCategory;
};

/**
 * Creates a new ScoreList element from the given trait category.
 * This is the list shown in the center of the analysis page.
 * @param category The category to create a list of traits with options for
 * @returns A ScoreList for the category.
 */
export function ScoreList({ category }: ScoreListProps) {
  return (
    <Container>
      <Text h1>{category.name}</Text>
      {category.traits.map((trait: Trait) => (
        <OptionElement key={`option_ ${trait.name}`} trait={trait} />
      ))}
    </Container>
  );
}
