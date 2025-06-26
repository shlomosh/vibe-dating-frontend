import { useLanguage } from '@/contexts/LanguageContext';
import { v5 as uuidv5 } from 'uuid';

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

export function formatTimeAgo(secondsSinceEpoch: number): string {
  const now = Math.floor(Date.now() / 1000); // current time in seconds
  const diffSeconds = now - secondsSinceEpoch;

  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffSeconds / 86400);
    return `${days}d ago`;
  }
}
