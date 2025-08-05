import { generateRandomProfileNickName, base64ToSeed } from "@/utils/generator";

export type AgeType = string;

export const SexualPositionTypeOptions = [
  'bottom',
  'versBottom',
  'vers',
  'versTop',
  'top',
  'side',
  'blower',
  'blowie'
] as const;

export type SexualPositionType = typeof SexualPositionTypeOptions[number];

export const BodyTypeOptions = [
  'petite',
  'slim',
  'average',
  'fit',
  'muscular',
  'stocky',
  'chubby',
  'large'
] as const;

export type BodyType = typeof BodyTypeOptions[number];

export const SexualityTypeOptions = [
  'gay',
  'bisexual',
  'curious',
  'trans',
  'fluid'
] as const;

export type SexualityType = typeof SexualityTypeOptions[number];

export const HostingTypeOptions = [
  'hostAndTravel',
  'hostOnly',
  'travelOnly'
] as const;

export type HostingType = typeof HostingTypeOptions[number];

export const TravelDistanceTypeOptions = [
  'none',
  'block',
  'neighbourhood',
  'city',
  'metropolitan',
  'state'
] as const;

export type TravelDistanceType = typeof TravelDistanceTypeOptions[number];

export const EggplantSizeTypeOptions = [
  'small',
  'average',
  'large',
  'extraLarge',
  'gigantic'
] as const;

export type EggplantSizeType = typeof EggplantSizeTypeOptions[number];

export const PeachShapeTypeOptions = [
  'small',
  'average',
  'bubble',
  'solid',
  'large'
] as const;

export type PeachShapeType = typeof PeachShapeTypeOptions[number];

export const HealthPracticesTypeOptions = [
  'condoms',
  'bb',
  'condomsOrBb',
  'noPenetrations'
] as const;

export type HealthPracticesType = typeof HealthPracticesTypeOptions[number];

export const HivStatusTypeOptions = [
  'negative',
  'positive',
  'positiveUndetectable'
] as const;

export type HivStatusType = typeof HivStatusTypeOptions[number];

export const PreventionPracticesTypeOptions = [
  'none',
  'prep',
  'doxypep',
  'prepAndDoxypep'
] as const;

export type PreventionPracticesType = typeof PreventionPracticesTypeOptions[number];

export const MeetingTimeTypeOptions = [
  'now',
  'today',
  'whenever'
] as const;

export type MeetingTimeType = typeof MeetingTimeTypeOptions[number];

export const ChatStatusTypeOptions = [
  'online',
  'busy',
  'offline',
] as const;

export type ChatStatusType = typeof ChatStatusTypeOptions[number];

export type ProfileId = string;
export type ImageId = string;

export interface ProfileRecord {
  profileId: ProfileId | null;
  nickName: string | undefined;
  aboutMe: string | undefined;
  age: AgeType | undefined;
  sexualPosition: SexualPositionType | undefined;
  bodyType: BodyType | undefined;
  eggplantSize: EggplantSizeType | undefined;
  peachShape: PeachShapeType | undefined;
  healthPractices: HealthPracticesType | undefined;
  hivStatus: HivStatusType | undefined;
  preventionPractices: PreventionPracticesType | undefined;
  hosting: HostingType | undefined;
  travelDistance: TravelDistanceType | undefined;
  imageIds: ImageId[];
};

export type ImageAttributes = Record<string, string>;

export interface ImageRecord {
  imageId: ImageId;
  url: string;
  urlThumbnail: string;
  attributes: ImageAttributes;
}

export interface SelfProfileRecord extends ProfileRecord {
  profileName: string | undefined;
  imageRecords: ImageRecord[];
};

export const upcastSelfProfileRecord = (record: SelfProfileRecord): ProfileRecord => {
  const { profileName, imageRecords, ...profileRecord } = record;
  return profileRecord;
}

export interface PeerProfileRecord extends ProfileRecord {
  distance: number;
  lastSeen: number;
  imageRecords: ImageRecord[];
};

export const upcastPeerProfileRecord = (record: PeerProfileRecord): ProfileRecord => {
  const { distance, lastSeen, imageRecords, ...profileRecord } = record;
  return profileRecord;
}

export interface ProfileDB {
  activeProfileId: ProfileId;
  profileRecords: Record<ProfileId, SelfProfileRecord>;
  freeProfileIds: ProfileId[];
};

export const getImageRecord = (imageId: ImageId, isMock: boolean = false): ImageRecord => (
  (isMock) ? {
    imageId,
    url: `https://picsum.dev//static/${base64ToSeed(imageId)}/300/400`,
    urlThumbnail: `https://picsum.dev//static/${base64ToSeed(imageId)}/90/120`,
    attributes: {}
  } : {
    imageId,
    url: `https://media.vibe-dating.io/original/${imageId}.jpg`,
    urlThumbnail: `https://media.vibe-dating.io/thumb/${imageId}.jpg`,
    attributes: {}
  }
);

export const createProfileRecord = (locale: any, profileId: ProfileId, record: Partial<SelfProfileRecord> = {}, isMock: boolean = false): SelfProfileRecord => ({
  profileId: profileId,
  profileName: record?.profileName || locale.toString(locale.translations.globalDict.myProfile),
  nickName: record?.nickName || generateRandomProfileNickName(locale, profileId),
  aboutMe: record?.aboutMe,
  age: record?.age,
  sexualPosition: record?.sexualPosition,
  bodyType: record?.bodyType,
  eggplantSize: record?.eggplantSize,
  peachShape: record?.peachShape,
  healthPractices: record?.healthPractices,
  hivStatus: record?.hivStatus,
  preventionPractices: record?.preventionPractices,
  hosting: record?.hosting,
  travelDistance: record?.travelDistance,
  imageIds: record?.imageIds || [],
  imageRecords: (record?.imageIds || []).map((imageId) => getImageRecord(imageId, isMock))
});
