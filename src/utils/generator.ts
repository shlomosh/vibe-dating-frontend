import { useLanguage } from '@/contexts/LanguageContext';

export const generateRandomProfileName = (seed: number = -1): string => {
  const { translations: { nameGenerator }, direction } = useLanguage();

  if (seed < 0) {
    seed = Math.floor(Math.random() * 1000000);
  }  
  const randomAnimal = nameGenerator.animals[(seed * 199) % nameGenerator.animals.length];
  const randomAdjective = nameGenerator.adjectives[(seed * 463) % nameGenerator.adjectives.length];

  return direction === 'rtl' ? `${randomAnimal} ${randomAdjective}` : `${randomAdjective} ${randomAnimal}`;
};
