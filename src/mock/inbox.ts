import { generateRandomProfileNickName } from "@/utils/generator";
import { getImageRecord } from "@/types/profile";
import { Conversation } from "@/types/chat";

// Helper function to get timestamp for X time ago
const getTimeAgo = (secondsAgo: number): number => {
  return Math.floor(Date.now() / 1000) - secondsAgo;
};

const mockImageIds = [
  [ "D8f2A9Lk",  "Vy7XgE-P",  "aT_R4mJ0" ],
  [ "RfQm32rZ" ],
  [ "uc9HgWnN","0ZzD_2Pk", "MoIqABtX" ],
  [ "t6EzsMbM", "WmPFji6o", "Hrv8gRNV" ],
  [ "bU3XnScQ", "jYxOae0L", "XW4uWTx9" ],
  [ ],
  [ "NSmRwC-p", "qQeA3XvI" ],
  [ "Lf27Wm_T", "rJokP9Ae", "GTy84xZ-" ],
  [ "cwHJ1vMn", "UimZtXy9", "dBoL8Cq3", "fyQWe_nN" ],
  [ "O_0xpU8v", "azJ2kXFt" ],
  [ "MnR6_ojZ", "XeCgVbw-" ],
  [ "bTq8d9N4", "WzA1f_Hu" ],
  [ "P7nZVxgr", "Jlh28OeK", "QXz4A1t_" ],
  [ "A2Y4537t", "bX345aZ8" ],
];

export const useMockInboxConversations = (locale: any): Conversation[] => [
  {
    profile: {
      profileId: "1",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Hey there! Looking for fun connections 😊",
      age: "25",
      sexualPosition: "vers",
      bodyType: "fit",
      eggplantSize: "average",
      peachShape: "bubble",
      healthPractices: "condoms",
      hivStatus: "negative",
      preventionPractices: "prep",
      hosting: "hostAndTravel",
      travelDistance: "city",
      imageIds: mockImageIds[0],
      imageRecords: mockImageIds[0].map((imageId) => getImageRecord(imageId, true)),
      distance: 2.5,
      lastSeen: 0
    },
    lastMessage: "Hey! How are you doing? 😊",
    lastTime: getTimeAgo(120), // 2 minutes ago
    unreadCount: 3
  },
  {
    profile: {
      profileId: "2",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Adventure seeker and fun lover",
      age: "28",
      sexualPosition: "top",
      bodyType: "muscular",
      eggplantSize: "large",
      peachShape: "solid",
      healthPractices: "bb",
      hivStatus: "negative",
      preventionPractices: "prep",
      hosting: "hostOnly",
      travelDistance: "neighbourhood",
      imageIds: mockImageIds[1],
      imageRecords: mockImageIds[1].map((imageId) => getImageRecord(imageId, true)),
      distance: 1.2,
      lastSeen: 5
    },
    lastMessage: "Thanks for the message!",
    lastTime: getTimeAgo(300), // 5 minutes ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "3",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Looking for meaningful connections",
      age: "23",
      sexualPosition: "bottom",
      bodyType: "slim",
      eggplantSize: "small",
      peachShape: "small",
      healthPractices: "condoms",
      hivStatus: "negative",
      preventionPractices: "none",
      hosting: "travelOnly",
      travelDistance: "metropolitan",
      imageIds: mockImageIds[2],
      imageRecords: mockImageIds[2].map((imageId) => getImageRecord(imageId, true)),
      distance: 8.7,
      lastSeen: 15
    },
    lastMessage: "Are you free this weekend?",
    lastTime: getTimeAgo(720), // 12 minutes ago
    unreadCount: 1
  },
  {
    profile: {
      profileId: "4",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Fun and outgoing personality",
      age: "30",
      sexualPosition: "versTop",
      bodyType: "average",
      eggplantSize: "average",
      peachShape: "average",
      healthPractices: "condomsOrBb",
      hivStatus: "negative",
      preventionPractices: "prepAndDoxypep",
      hosting: "hostAndTravel",
      travelDistance: "city",
      imageIds: mockImageIds[3],
      imageRecords: mockImageIds[3].map((imageId) => getImageRecord(imageId, true)),
      distance: 4.1,
      lastSeen: 45
    },
    lastMessage: "That sounds great! Let's meet up",
    lastTime: getTimeAgo(3600), // 1 hour ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "5",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Passionate about life and connections",
      age: "27",
      sexualPosition: "versBottom",
      bodyType: "fit",
      eggplantSize: "large",
      peachShape: "bubble",
      healthPractices: "bb",
      hivStatus: "negative",
      preventionPractices: "prep",
      hosting: "hostOnly",
      travelDistance: "block",
      imageIds: mockImageIds[4],
      imageRecords: mockImageIds[4].map((imageId) => getImageRecord(imageId, true)),
      distance: 0.8,
      lastSeen: 90
    },
    lastMessage: "I had a really good time last night",
    lastTime: getTimeAgo(7200), // 2 hours ago
    unreadCount: 5
  },
  {
    profile: {
      profileId: "6",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Easy going and friendly",
      age: "26",
      sexualPosition: "top",
      bodyType: "muscular",
      eggplantSize: "extraLarge",
      peachShape: "solid",
      healthPractices: "condoms",
      hivStatus: "negative",
      preventionPractices: "none",
      hosting: "travelOnly",
      travelDistance: "state",
      imageIds: mockImageIds[5],
      imageRecords: mockImageIds[5].map((imageId) => getImageRecord(imageId, true)),
      distance: 25.3,
      lastSeen: 120
    },
    lastMessage: "Can't wait to see you again!",
    lastTime: getTimeAgo(10800), // 3 hours ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "7",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Looking for fun and adventure",
      age: "24",
      sexualPosition: "bottom",
      bodyType: "petite",
      eggplantSize: "small",
      peachShape: "small",
      healthPractices: "condoms",
      hivStatus: "negative",
      preventionPractices: "prep",
      hosting: "hostAndTravel",
      travelDistance: "city",
      imageIds: mockImageIds[6],
      imageRecords: mockImageIds[6].map((imageId) => getImageRecord(imageId, true)),
      distance: 6.2,
      lastSeen: 180
    },
    lastMessage: "What are your plans for tonight?",
    lastTime: getTimeAgo(18000), // 5 hours ago
    unreadCount: 2
  },
  {
    profile: {
      profileId: "8",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Open minded and adventurous",
      age: "29",
      sexualPosition: "vers",
      bodyType: "stocky",
      eggplantSize: "average",
      peachShape: "large",
      healthPractices: "bb",
      hivStatus: "negative",
      preventionPractices: "prepAndDoxypep",
      hosting: "hostOnly",
      travelDistance: "neighbourhood",
      imageIds: mockImageIds[7],
      imageRecords: mockImageIds[7].map((imageId) => getImageRecord(imageId, true)),
      distance: 1.5,
      lastSeen: 1440
    },
    lastMessage: "Thanks for the great conversation",
    lastTime: getTimeAgo(86400), // 1 day ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "9",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Friendly and approachable",
      age: "31",
      sexualPosition: "top",
      bodyType: "large",
      eggplantSize: "gigantic",
      peachShape: "solid",
      healthPractices: "condomsOrBb",
      hivStatus: "negative",
      preventionPractices: "prep",
      hosting: "travelOnly",
      travelDistance: "metropolitan",
      imageIds: mockImageIds[8],
      imageRecords: mockImageIds[8].map((imageId) => getImageRecord(imageId, true)),
      distance: 12.8,
      lastSeen: 2880
    },
    lastMessage: "Hope you're having a good day!",
    lastTime: getTimeAgo(172800), // 2 days ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "10",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Passionate about connections",
      age: "25",
      sexualPosition: "bottom",
      bodyType: "chubby",
      eggplantSize: "small",
      peachShape: "bubble",
      healthPractices: "condoms",
      hivStatus: "negative",
      preventionPractices: "none",
      hosting: "hostAndTravel",
      travelDistance: "city",
      imageIds: mockImageIds[9],
      imageRecords: mockImageIds[9].map((imageId) => getImageRecord(imageId, true)),
      distance: 3.7,
      lastSeen: 4320
    },
    lastMessage: "Let's catch up soon!",
    lastTime: getTimeAgo(259200), // 3 days ago
    unreadCount: 1
  },
  {
    profile: {
      profileId: "11",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Looking for meaningful relationships",
      age: "28",
      sexualPosition: "versTop",
      bodyType: "fit",
      eggplantSize: "large",
      peachShape: "average",
      healthPractices: "bb",
      hivStatus: "negative",
      preventionPractices: "prep",
      hosting: "hostOnly",
      travelDistance: "block",
      imageIds: mockImageIds[10],
      imageRecords: mockImageIds[10].map((imageId) => getImageRecord(imageId, true)),
      distance: 0.9,
      lastSeen: 1440
    },
    lastMessage: "Thanks for the great conversation",
    lastTime: getTimeAgo(86400), // 1 day ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "12",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Adventure seeker and fun lover",
      age: "26",
      sexualPosition: "versBottom",
      bodyType: "slim",
      eggplantSize: "average",
      peachShape: "small",
      healthPractices: "condoms",
      hivStatus: "negative",
      preventionPractices: "prepAndDoxypep",
      hosting: "travelOnly",
      travelDistance: "state",
      imageIds: mockImageIds[11],
      imageRecords: mockImageIds[11].map((imageId) => getImageRecord(imageId, true)),
      distance: 18.4,
      lastSeen: 2880
    },
    lastMessage: "Hope you're having a good day!",
    lastTime: getTimeAgo(172800), // 2 days ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "13",
      nickName: generateRandomProfileNickName(locale),
      aboutMe: "Easy going and friendly",
      age: "30",
      sexualPosition: "top",
      bodyType: "muscular",
      eggplantSize: "extraLarge",
      peachShape: "solid",
      healthPractices: "condomsOrBb",
      hivStatus: "negative",
      preventionPractices: "prep",
      hosting: "hostAndTravel",
      travelDistance: "city",
      imageIds: mockImageIds[12],
      imageRecords: mockImageIds[12].map((imageId) => getImageRecord(imageId, true)),
      distance: 5.6,
      lastSeen: 4320
    },
    lastMessage: "Let's catch up soon!",
    lastTime: getTimeAgo(259200), // 3 days ago
    unreadCount: 1
  }
];

