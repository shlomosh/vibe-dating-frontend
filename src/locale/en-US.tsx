import { 
  AgeType,
  TravelDistanceType, 
  PositionType, 
  BodyType, 
  SexualityType,
  HostingType,
  MeetingTimeType,
  EquipmentSizeType,
  ButtShapeType,
  HealthPracticesType,
  HivStatusType,
  PreventionPracticesType,
  ChatStatusType,
} from '../types/profile';

export const globalDict = {
    // general app info
    appName: (<>Vibe</>),
    appSlogon: (<>Find what makes you vibe.</>),

    // general buttons  
    accept: (<>Accept</>),
    cancel: (<>Cancel</>),
    delete: (<>Delete</>),
    next: (<>Next</>),
    select: (<>Select</>),
    create: (<>Create</>),

    // general text
    loading: (<>Loading...</>),

    // terms and conditions
    termsAndConditions: (<>Terms and Conditions</>),
    readTermsAndConditions: (<>Read Terms & Conditions</>),
    acceptTermsAndLogin: (<>Accept Terms & Login</>),

    // profile
    deleteProfile: (<>Delete Profile</>),
    deleteProfileAreYouSureQ: (profileId: string) => (<>{`Delete '${profileId}' profile? This action cannot be undone.`}</>),
    selectProfile: (<>Select Profile</>),
    addProfile: (<>Add Profile</>),
    enterNewProfileName: (<>Enter new profile name (visible only to you)</>),
    profileName: (<>Profile Name</>),
}

export const nameGenerator = {
    animals: [
        'Lion', 'Stallion', 'Bull', 'Dog', 'Rooster', 'Billy', 'Buck', 'Drake', 'Jack', 'Tom',
        'Boar', 'Ram', 'Tiercel', 'Hob', 'Jackass', 'Drake', 'Buck', 'Stag', 'Gander', 'Cock',
        'Hart', 'Bullock', 'Stud', 'Colt', 'Filly', 'Foal', 'Jackal', 'Tiger', 'Wolf', 'Bear',
        'Hawk', 'Falcon', 'Eagle', 'Cheetah', 'Panther', 'Jaguar', 'Leopard'
    ] as const,
    adjectives: [
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
    ] as const
};

export const termsAndConditionsDict = {
  sectionsText: [
    {
      title: (<>1. Introduction</>),
      content: (<>
          <p>Welcome to {globalDict.appName} ! By using our app, you agree to abide by these Terms and Conditions.
          If you do not agree, please refrain from using the service.</p>
        </>)
    },
    {
      title: (<>2. Eligibility</>),
      content: (<>
        <p>You must be at least 18 years old to use {globalDict.appName}.
        By signing up, you confirm that all information you provide is accurate.</p>
      </>)
    },
    {
      title: (<>3. Respect Yourself and Respect Others</>),
      content: (<>
          <p>At {globalDict.appName}, we believe in fostering a safe and respectful environment. Users must adhere to the following principles:</p>
          <p>
            <p className="ps-[1em] pt-1">• Respect others and treat all users with kindness and dignity. Hate speech, harassment, or discrimination will not be tolerated.</p>
            <p className="ps-[1em] pt-1">• Respect yourself and engage in positive interactions and practice self-care while using the platform.</p>
            <p className="ps-[1em] pt-1">• Always ensure all conversations and interactions are consensual.</p>
            <p className="ps-[1em] pt-1">• Reporting violations, if you experience or witness inappropriate behavior, please report it through the app's reporting system.</p>
          </p>
        </>)
    },
    {
      title: (<>4. User Conduct</>),
      content: (<>
        <p>Users must not:</p>
        <p>
          <p className="ps-[1em] pt-1">• Use {globalDict.appName} for illegal activities.</p>
          <p className="ps-[1em] pt-1">• Share or distribute harmful, explicit, or deceptive content.</p>
          <p className="ps-[1em] pt-1">• Impersonate another person or create fake profiles.</p>
        </p>
      </>)
    },
    {
      title: (<>5. Privacy & Data Protection</>),
      content: (<>
        <p>Your personal data will be handled according to our privacy policy.</p>
        <p>We take reasonable security measures to protect your information, but we cannot guarantee absolute security.</p>
      </>)
    },
    {
      title: (<>6. Liability & Disclaimers</>),
      content: (<>
        <p>{globalDict.appName} provides a platform for connection but is not responsible for user interactions outside the app.</p>
        <p>Users assume full responsibility for their communication and meet-ups.</p>
      </>)
    },
    {
      title: (<>7. Termination of Account</>),
      content: (<>
        <p>{globalDict.appName} reserves the right to suspend or terminate accounts that violate our terms.</p>
      </>)
    },
    {
      title: (<>8. Changes to Terms</>),
      content: (<>
        <p>We may update these terms from time to time. Continued use of {globalDict.appName} after updates implies acceptance of changes.</p>
      </>)
    },
  ],
};

export const profileDict = {
  nickName: {
      label: 'Nick Name',
  },
  aboutMe: {
      label: 'About Me',
  },
  sexuality: {
      label: 'Sexuality',
      options: {
        gay: 'Gay',
        bisexual: 'Bi',
        curious: 'Curious',
        trans: 'Trans',
        fluid: 'Fluid'
      }
  } satisfies {
    label: string,
    options: Record<SexualityType, string>
  },
  age: {
      label: 'Age',
      options: {
        ...Object.fromEntries(
          Array.from({ length: 59 - 18 + 1 }, (_, i) => [
            `${18 + i}`, `${18 + i}`
          ])
        ),
        '60-64': '60-64',
        '65-69': '65-69',
        '70-79': '70-79',
        '80+': '80+'
      }
  } satisfies {
    label: string,
    options: Record<AgeType, string>
  },
  hosting: {
      label: 'Hosting',
      options: {
        hostAndTravel: 'Host & Travel',
        hostOnly: 'Host Only',
        travelOnly: 'Travel Only'
      }
  } satisfies {
    label: string,
    options: Record<HostingType, string>
  },
  travelDistance: {
      label: 'Travel Range',
      options: {
        none: '0 Km',
        block: '1 Km',
        neighbourhood: '2 Km',
        city: '5 Km',
        metropolitan: '10 Km',
        state: '20+ Km'
      }
  } satisfies {
    label: string,
    options: Record<TravelDistanceType, string>
  },
  position: {
      label: 'Position',
      options: {
        bottom: 'Bottom',
        versBottom: 'Vers Bottom',
        vers: 'Vers',
        versTop: 'Vers Top',
        top: 'Top',
        side: 'Side',
        blower: 'Blower',
        blowie: 'Blowie'
      }
  } satisfies {
    label: string,
    options: Record<PositionType, string>
  },
  body: {
      label: 'Body Type',
      options: {
        petite: 'Petite',
        slim: 'Slim',
        average: 'Average',
        fit: 'Fit',
        muscular: 'Muscular',
        stocky: 'Stocky',
        chubby: 'Chubby',
        large: 'Large'
      }
  } satisfies {
    label: string,
    options: Record<BodyType, string>
  },
  equipmentSize: {
      label: 'Equipment 🍆',
      options: {
        small: 'Small',
        average: 'Average',
        large: 'Large',
        extraLarge: 'Extra Large',
        gigantic: 'Gigantic'
      }
  } satisfies {
    label: string,
    options: Record<EquipmentSizeType, string>
  },
  buttShape: {
      label: 'Butt 🍑',
      options: {
        small: 'Small',
        average: 'Average',
        bubble: 'Bubble',
        solid: 'Solid',
        large: 'Large',
      }
  } satisfies {
    label: string,
    options: Record<ButtShapeType, string>
  },
  healthPractices: {
      label: 'Sex Practices',
      options: {
        condoms: 'Condoms',
        bb: 'BB',
        condomsOrBb: 'Condoms or BB',
        noPenetrations: 'No Penetrations'
      }
  } satisfies {
    label: string,
    options: Record<HealthPracticesType, string>
  },
  hivStatus: {
    label: 'HIV Status',
    options: {
      negative: 'Negative',
      positive: 'Positive',
      positiveUndetectable: 'Positive, Undetectable'
    }
  } satisfies {
    label: string,
    options: Record<HivStatusType, string>
  },
  preventionPractices: {
    label: 'STD Prevention',
    options: {
      none: 'None',
      prep: 'PrEP',
      doxypep: 'DoxyPEP',
      prepAndDoxypep: 'PrEP & DoxyPEP',
    }
  } satisfies {
    label: string,
    options: Record<PreventionPracticesType, string>
  },
  meetingTime: {
      label: 'Meeting Time',
      options: {
        now: 'Now',
        today: 'Today',
        whenever: 'Whenever'
      }
  } satisfies {
    label: string,
    options: Record<MeetingTimeType, string>
  },
  chatStatus: {
    label: 'Chat Status',
    options: {
      online: 'Online',
      busy: 'Busy',
      offline: 'Offline',
    }
  } satisfies {
    label: string,
    options: Record<ChatStatusType, string>
  },
};