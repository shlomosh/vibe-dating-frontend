export type AgeType = string;

export const PositionTypeOptions = [
  'bottom',
  'versBottom',
  'vers',
  'versTop',
  'top',
  'side',
  'blower',
  'blowie'
] as const;

export type PositionType = typeof PositionTypeOptions[number];

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

export interface ProfileInfo {
  nickName: string;
  aboutMe: string;
  age: AgeType | undefined;
  position: PositionType | undefined;
  body: BodyType | undefined;
  eggplantSize: EggplantSizeType | undefined;
  peachShape: PeachShapeType | undefined;
  healthPractices: HealthPracticesType | undefined;
  hivStatus: HivStatusType | undefined;
  preventionPractices: PreventionPracticesType | undefined;
  hosting: HostingType | undefined;
  travelDistance: TravelDistanceType | undefined;
};

export interface MyProfileInfo extends ProfileInfo {
  profileName: string;
};

export interface OtherProfileInfo extends ProfileInfo {
  distance: number;
  lastSeen: number;
};

export type ProfileId = string;

export interface ProfileDB {
  id: ProfileId | undefined;
  db: Record<ProfileId, MyProfileInfo>;
};

export const defaultMyProfileInfo: MyProfileInfo = {
  profileName: 'My Profile',
  nickName: '',
  aboutMe: '',
  age: undefined,
  position: undefined,
  body: undefined,
  eggplantSize: undefined,
  peachShape: undefined,
  healthPractices: undefined,
  hivStatus: undefined,
  preventionPractices: undefined,
  hosting: undefined,
  travelDistance: undefined,
};

export interface ProfileRecord {
  profileId: string;
  profileInfo: OtherProfileInfo;
  profileImagesUrls: string[];
}
