import { PeerProfileRecord, SexualPositionTypeOptions, BodyTypeOptions, EggplantSizeTypeOptions, PeachShapeTypeOptions, HealthPracticesTypeOptions, HivStatusTypeOptions, PreventionPracticesTypeOptions, HostingTypeOptions, TravelDistanceTypeOptions, getImageRecord } from "../types/profile";
import { generateRandomProfileNickName } from "../utils/generator";
import { useMockProfileImageIds } from "./profile";

const generateBase64Id = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getRandomItem = <T>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const mockImageIds = Array.from({ length: 32 }, () => useMockProfileImageIds());

const sampleAboutMe = [
  'Looking for fun and adventure. Love to travel and meet new people.',
  'Fitness enthusiast who enjoys outdoor activities and good conversation.',
  'Creative soul seeking meaningful connections and exciting experiences.',
  'Easy-going guy who loves music, movies, and spontaneous adventures.',
  'Professional by day, wild by night. Let\'s make some memories together.'
];

export const useMockRadarProfiles = (locale: any, count: number = 10): PeerProfileRecord[] => {
  const profiles: PeerProfileRecord[] = [];

  for (let i = 0; i < count; i++) {
    const imageIds = mockImageIds[i % mockImageIds.length];

    const profile: PeerProfileRecord = {
      profileId: generateBase64Id(),
      nickName: generateRandomProfileNickName(locale),
      aboutMe: getRandomItem(sampleAboutMe),
      age: (Math.floor(Math.random() * 30) + 18).toString(), // 18-47
      sexualPosition: getRandomItem(SexualPositionTypeOptions),
      bodyType: getRandomItem(BodyTypeOptions),
      eggplantSize: getRandomItem(EggplantSizeTypeOptions),
      peachShape: getRandomItem(PeachShapeTypeOptions),
      healthPractices: getRandomItem(HealthPracticesTypeOptions),
      hivStatus: getRandomItem(HivStatusTypeOptions),
      preventionPractices: getRandomItem(PreventionPracticesTypeOptions),
      hosting: getRandomItem(HostingTypeOptions),
      travelDistance: getRandomItem(TravelDistanceTypeOptions),
      imageIds: imageIds,
      distance: Math.floor(Math.random() * 50000) + 100, // 100-50000 meters (100m to 50km)
      lastSeen: Date.now() - Math.floor(Math.random() * 86400000), // Within last 24 hours
      imageRecords: imageIds.map((imageId) => getImageRecord(imageId, true)),
    };

    profiles.push(profile);
  }

  return profiles;
};
