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

export const EquipmentSizeTypeOptions = [
    'small',
    'average',
    'large',
    'extraLarge',
    'gigantic'
] as const;

export type EquipmentSizeType = typeof EquipmentSizeTypeOptions[number];

export const ButtShapeTypeOptions = [
  'small',
  'average',
  'bubble',
  'solid',
  'large'
] as const;

export type ButtShapeType = typeof ButtShapeTypeOptions[number];

const HealthPracticesTypeOptions = [
  'condoms',
  'bb',
  'condomsOrBb',
  'noPenetrations'
] as const;

export type HealthPracticesType = typeof HealthPracticesTypeOptions[number];

const HivStatusTypeOptions = [
  'negative',
  'positive',
  'positiveUndetectable'
] as const;

export type HivStatusType = typeof HivStatusTypeOptions[number];

const PreventionPracticesTypeOptions = [
  'none',
  'prep',
  'doxypep',
  'prepAndDoxypep'
] as const;

export type PreventionPracticesType = typeof PreventionPracticesTypeOptions[number];

const MeetingTimeTypeOptions = [
  'now',
  'today',
  'whenever'
] as const;

export type MeetingTimeType = typeof MeetingTimeTypeOptions[number];

const ChatStatusTypeOptions = [
  'online',
  'busy',
  'offline',
] as const;

export type ChatStatusType = typeof ChatStatusTypeOptions[number];

export interface ProfileRecord {
    profileName: string;
    nickName: string;
    aboutMe: string;
    age: AgeType | undefined;
    position: PositionType | undefined;
    body: BodyType | undefined;
    equipmentSize: EquipmentSizeType | undefined;
    buttShape: ButtShapeType | undefined;
    healthPractices: HealthPracticesType | undefined;
    hivStatus: HivStatusType | undefined;
    preventionPractices: PreventionPracticesType | undefined;
    hosting: HostingType | undefined;
    travelDistance: TravelDistanceType | undefined;
};

export type ProfileId = string;

export interface ProfileDB {
  id: ProfileId | undefined;
  db: Record<ProfileId, ProfileRecord>;
};

export const defaultProfile: ProfileRecord = {
  profileName: 'My Profile',
  nickName: '',
  aboutMe: '',
  age: undefined,
  position: undefined,
  body: undefined,
  equipmentSize: undefined,
  buttShape: undefined,
  healthPractices: undefined,
  hivStatus: undefined,
  preventionPractices: undefined,
  hosting: undefined,
  travelDistance: undefined,
};
