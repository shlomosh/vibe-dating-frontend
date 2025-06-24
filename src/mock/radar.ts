import { ProfileRecord, PositionTypeOptions, BodyTypeOptions, EggplantSizeTypeOptions, PeachShapeTypeOptions, HealthPracticesTypeOptions, HivStatusTypeOptions, PreventionPracticesTypeOptions, HostingTypeOptions, TravelDistanceTypeOptions } from "../types/profile";
import { generateRandomProfileNickNameSimple } from "../utils/generator";
import { mockProfileImageUrls } from "./profile";

export const generateBase64Id = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const getRandomItem = <T>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const sampleAboutMe = [
  'Looking for fun and adventure. Love to travel and meet new people.',
  'Fitness enthusiast who enjoys outdoor activities and good conversation.',
  'Creative soul seeking meaningful connections and exciting experiences.',
  'Easy-going guy who loves music, movies, and spontaneous adventures.',
  'Professional by day, wild by night. Let\'s make some memories together.'
];

export const mockRadarProfiles = (count: number = 10): ProfileRecord[] => {
  const profiles: ProfileRecord[] = [];

  for (let i = 0; i < count; i++) {
    const profile: ProfileRecord = {
      profileId: generateBase64Id(),
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(100 + i),
        aboutMe: getRandomItem(sampleAboutMe),
        age: (Math.floor(Math.random() * 30) + 18).toString(), // 18-47
        position: getRandomItem(PositionTypeOptions),
        body: getRandomItem(BodyTypeOptions),
        eggplantSize: getRandomItem(EggplantSizeTypeOptions),
        peachShape: getRandomItem(PeachShapeTypeOptions),
        healthPractices: getRandomItem(HealthPracticesTypeOptions),
        hivStatus: getRandomItem(HivStatusTypeOptions),
        preventionPractices: getRandomItem(PreventionPracticesTypeOptions),
        hosting: getRandomItem(HostingTypeOptions),
        travelDistance: getRandomItem(TravelDistanceTypeOptions),
        distance: Math.floor(Math.random() * 50000) + 100, // 100-50000 meters (100m to 50km)
        lastSeen: Date.now() - Math.floor(Math.random() * 86400000), // Within last 24 hours
      },
      profileImagesUrls: mockProfileImageUrls(),
    };

    profiles.push(profile);
  }

  return profiles;
};
