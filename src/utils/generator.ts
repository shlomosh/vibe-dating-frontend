import { nameGenerator } from '@/locale/en-US';

export const generateRandomProfileName = (seed: number = -1): string => {
  if (seed < 0) {
    seed = Math.floor(Math.random() * 1000000);
  }  
  const randomAnimal = nameGenerator.animals[(seed * 199) % nameGenerator.animals.length];
  const randomAdjective = nameGenerator.adjectives[(seed * 463) % nameGenerator.adjectives.length];

  return `${randomAdjective} ${randomAnimal}`;
};
