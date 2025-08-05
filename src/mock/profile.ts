import { generateRandomId } from "../utils/generator";

export const useMockProfileImageIds = (maxImages: number = 5): string[] => {
  const numImages = Math.floor(Math.random() * maxImages);
  return Array.from({ length: numImages }, () => generateRandomId());
};
