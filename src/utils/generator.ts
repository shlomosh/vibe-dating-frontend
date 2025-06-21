import { useLanguage } from '@/contexts/LanguageContext';
import { v5 as uuidv5 } from 'uuid';

// Simple nickname generation without hooks - for use in non-React contexts
export const generateRandomProfileNickNameSimple = (seed: number = -1, direction: 'ltr' | 'rtl' = 'ltr'): string => {
  const animals = [
    'Lion', 'Stallion', 'Bull', 'Dog', 'Rooster', 'Billy', 'Buck', 'Drake', 'Jack', 'Tom',
    'Boar', 'Ram', 'Tiercel', 'Hob', 'Jackass', 'Drake', 'Buck', 'Stag', 'Gander', 'Cock',
    'Hart', 'Bullock', 'Stud', 'Colt', 'Filly', 'Foal', 'Jackal', 'Tiger', 'Wolf', 'Bear',
    'Hawk', 'Falcon', 'Eagle', 'Cheetah', 'Panther', 'Jaguar', 'Leopard'
  ];
  
  const adjectives = [
    'Red', 'Blue', 'Yellow', 'Green', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White',
    'Gray', 'Silver', 'Gold', 'Crimson', 'Scarlet', 'Ruby', 'Cherry', 'Burgundy', 'Maroon', 'Brick',
    'Mahogany', 'Vermillion', 'Rose', 'Coral', 'Tomato', 'Fire', 'Rust', 'Wine', 'Garnet', 'Raspberry',
    'Cranberry', 'Navy', 'Sky', 'Baby', 'Royal', 'Teal', 'Turquoise', 'Cobalt', 'Sapphire', 'Indigo',
    'Powder', 'Cornflower', 'Steel', 'Aqua', 'Denim', 'Midnight', 'Cerulean', 'Ice', 'Slate', 'Electric',
    'Amber', 'Mustard', 'Lemon', 'Goldenrod', 'Chartreuse', 'Olive', 'Lime', 'Jade', 'Emerald', 'Mint',
    'Seafoam', 'Forest', 'Cyan', 'Aquamarine', 'Periwinkle', 'Lavender', 'Violet', 'Plum', 'Orchid', 'Magenta',
    'Fuchsia', 'Rosewood', 'Taupe', 'Beige', 'Sand', 'Sepia', 'Umber', 'Charcoal',
    'Cute', 'Funny', 'Loyal', 'Brave', 'Adorable', 'Gentle', 'Majestic', 'Fierce', 'Playful', 'Intelligent',
    'Curious', 'Graceful', 'Agile', 'Resourceful', 'Social', 'Resilient', 'Mysterious', 'Tenacious', 'Extraordinary', 'Wild',
    'Domesticated', 'Endangered', 'Nocturnal', 'Diurnal', 'Migratory', 'Carnivorous', 'Herbivorous', 'Omnivorous', 'Aquatic', 'Terrestrial',
    'Arboreal', 'Winged', 'Feathered', 'Furred', 'Scaled', 'Slimy', 'Venomous', 'Predatory', 'Gregarious', 'Solitary',
    'Fast', 'Slow', 'Stealthy', 'Powerful', 'Fearless', 'Primal', 'Exotic', 'Harmonious', 'Empathetic', 'Compassionate',
    'Authentic', 'Courageous', 'Determined'
  ];

  if (seed < 0) {
    seed = Math.floor(Math.random() * 1000000);
  }  
  const randomAnimal = animals[(seed * 199) % animals.length];
  const randomAdjective = adjectives[(seed * 463) % adjectives.length];

  return direction === 'rtl' ? `${randomAnimal} ${randomAdjective}` : `${randomAdjective} ${randomAnimal}`;
};

// Original function that uses hooks - for use in React components only
export const generateRandomProfileNickName = (seed: number = -1): string => {
  const { translations: { nameGenerator }, direction } = useLanguage();

  if (seed < 0) {
    seed = Math.floor(Math.random() * 1000000);
  }  
  const randomAnimal = nameGenerator.animals[(seed * 199) % nameGenerator.animals.length];
  const randomAdjective = nameGenerator.adjectives[(seed * 463) % nameGenerator.adjectives.length];

  return direction === 'rtl' ? `${randomAnimal} ${randomAdjective}` : `${randomAdjective} ${randomAnimal}`;
};

export const uuidToBase64 = (uuid: string): string => {
  // Remove hyphens and convert to a byte array
  const hex = uuid.replace(/-/g, '');
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

  // Convert to Base64
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64;
}

export const hashStringToId = (str: string, len: number = 8): string => {
  return uuidToBase64(uuidv5(str, 'f205b16e-4eac-11f0-a692-00155dcd3c6a')).slice(0, len);
};

export const generateRandomId = (len: number = 16): string => {
  return uuidToBase64(crypto.randomUUID()).slice(0, len)
};
