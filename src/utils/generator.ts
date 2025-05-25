const AnimalTypeOptions: string[] = [
  'Lion', 'Stallion', 'Bull', 'Dog', 'Rooster', 'Billy', 'Buck', 'Drake', 'Jack', 'Tom',
  'Boar', 'Ram', 'Tiercel', 'Hob', 'Jackass', 'Drake', 'Buck', 'Stag', 'Gander', 'Cock',
  'Hart', 'Bullock', 'Stud', 'Colt', 'Filly', 'Foal', 'Jackal', 'Tiger', 'Wolf', 'Bear',
  'Hawk', 'Falcon', 'Eagle', 'Cheetah', 'Panther', 'Jaguar', 'Leopard'
] as const;

const AdjectiveTypeOptions: string[] = [
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
] as const;

export const generateRandomProfileName = (seed: number = -1): string => {
  if (seed == -1) {
    seed = Math.floor(Math.random() * 1000000);
  }
  const randomPrimes = [659, 997];
  const randomAnimal = AnimalTypeOptions[(seed * randomPrimes[0]) % AnimalTypeOptions.length];
  const randomAdjective = AdjectiveTypeOptions[(seed * randomPrimes[1]) % AdjectiveTypeOptions.length];

  return `${randomAdjective} ${randomAnimal}`;
};
