
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
  'block',
  'neighbourhood',
  'city',
  'metropolitan',
  'state'
] as const;

export type TravelDistanceType = typeof TravelDistanceTypeOptions[number];

export const EquipmentTypeOptions = [
    'small',
    'average',
    'large',
    'extraLarge',
    'gigantic'
] as const;

export type EquipmentType = typeof EquipmentTypeOptions[number];

const HealthPracticesTypeOptions = [
  'condoms',
  'bb',
  'condomsOrBb',
  'noPenetrations'
] as const;

export type HealthPracticesType = typeof HealthPracticesTypeOptions[number];

const HivStatusTypeOptions = [
  'negative',
  'negativeOnPrep',
  'positive',
  'positiveUndetectable'
] as const;

export type HivStatusType = typeof HivStatusTypeOptions[number];

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
