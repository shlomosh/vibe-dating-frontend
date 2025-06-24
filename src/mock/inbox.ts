import { generateRandomProfileNickNameSimple } from "@/utils/generator";
import { Conversation } from "@/types/chat";

// Helper function to get timestamp for X time ago
const getTimeAgo = (secondsAgo: number): number => {
  return Math.floor(Date.now() / 1000) - secondsAgo;
};

export const mockInboxConversations: Conversation[] = [
  {
    profile: {
      profileId: "1",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(1),
        aboutMe: "Hey there! Looking for fun connections 😊",
        age: "25",
        position: "vers",
        body: "fit",
        eggplantSize: "average",
        peachShape: "bubble",
        healthPractices: "condoms",
        hivStatus: "negative",
        preventionPractices: "prep",
        hosting: "hostAndTravel",
        travelDistance: "city",
        distance: 2.5,
        lastSeen: 0
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=1`]
    },
    lastMessage: "Hey! How are you doing? 😊",
    lastTime: getTimeAgo(120), // 2 minutes ago
    unreadCount: 3
  },
  {
    profile: {
      profileId: "2",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(2),
        aboutMe: "Adventure seeker and fun lover",
        age: "28",
        position: "top",
        body: "muscular",
        eggplantSize: "large",
        peachShape: "solid",
        healthPractices: "bb",
        hivStatus: "negative",
        preventionPractices: "prep",
        hosting: "hostOnly",
        travelDistance: "neighbourhood",
        distance: 1.2,
        lastSeen: 5
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=2`]
    },
    lastMessage: "Thanks for the message!",
    lastTime: getTimeAgo(300), // 5 minutes ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "3",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(3),
        aboutMe: "Looking for meaningful connections",
        age: "23",
        position: "bottom",
        body: "slim",
        eggplantSize: "small",
        peachShape: "small",
        healthPractices: "condoms",
        hivStatus: "negative",
        preventionPractices: "none",
        hosting: "travelOnly",
        travelDistance: "metropolitan",
        distance: 8.7,
        lastSeen: 15
      },
      profileImagesUrls: []
    },
    lastMessage: "Are you free this weekend?",
    lastTime: getTimeAgo(720), // 12 minutes ago
    unreadCount: 1
  },
  {
    profile: {
      profileId: "4",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(4),
        aboutMe: "Fun and outgoing personality",
        age: "30",
        position: "versTop",
        body: "average",
        eggplantSize: "average",
        peachShape: "average",
        healthPractices: "condomsOrBb",
        hivStatus: "negative",
        preventionPractices: "prepAndDoxypep",
        hosting: "hostAndTravel",
        travelDistance: "city",
        distance: 4.1,
        lastSeen: 45
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=4`]
    },
    lastMessage: "That sounds great! Let's meet up",
    lastTime: getTimeAgo(3600), // 1 hour ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "5",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(5),
        aboutMe: "Passionate about life and connections",
        age: "27",
        position: "versBottom",
        body: "fit",
        eggplantSize: "large",
        peachShape: "bubble",
        healthPractices: "bb",
        hivStatus: "negative",
        preventionPractices: "prep",
        hosting: "hostOnly",
        travelDistance: "block",
        distance: 0.8,
        lastSeen: 90
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=5`]
    },
    lastMessage: "I had a really good time last night",
    lastTime: getTimeAgo(7200), // 2 hours ago
    unreadCount: 5
  },
  {
    profile: {
      profileId: "6",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(6),
        aboutMe: "Easy going and friendly",
        age: "26",
        position: "top",
        body: "muscular",
        eggplantSize: "extraLarge",
        peachShape: "solid",
        healthPractices: "condoms",
        hivStatus: "negative",
        preventionPractices: "none",
        hosting: "travelOnly",
        travelDistance: "state",
        distance: 25.3,
        lastSeen: 120
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=6`]
    },
    lastMessage: "Can't wait to see you again!",
    lastTime: getTimeAgo(10800), // 3 hours ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "7",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(7),
        aboutMe: "Looking for fun and adventure",
        age: "24",
        position: "bottom",
        body: "petite",
        eggplantSize: "small",
        peachShape: "small",
        healthPractices: "condoms",
        hivStatus: "negative",
        preventionPractices: "prep",
        hosting: "hostAndTravel",
        travelDistance: "city",
        distance: 6.2,
        lastSeen: 180
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=7`]
    },
    lastMessage: "What are your plans for tonight?",
    lastTime: getTimeAgo(18000), // 5 hours ago
    unreadCount: 2
  },
  {
    profile: {
      profileId: "8",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(8),
        aboutMe: "Open minded and adventurous",
        age: "29",
        position: "vers",
        body: "stocky",
        eggplantSize: "average",
        peachShape: "large",
        healthPractices: "bb",
        hivStatus: "negative",
        preventionPractices: "prepAndDoxypep",
        hosting: "hostOnly",
        travelDistance: "neighbourhood",
        distance: 1.5,
        lastSeen: 1440
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=8`]
    },
    lastMessage: "Thanks for the great conversation",
    lastTime: getTimeAgo(86400), // 1 day ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "9",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(9),
        aboutMe: "Friendly and approachable",
        age: "31",
        position: "top",
        body: "large",
        eggplantSize: "gigantic",
        peachShape: "solid",
        healthPractices: "condomsOrBb",
        hivStatus: "negative",
        preventionPractices: "prep",
        hosting: "travelOnly",
        travelDistance: "metropolitan",
        distance: 12.8,
        lastSeen: 2880
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=9`]
    },
    lastMessage: "Hope you're having a good day!",
    lastTime: getTimeAgo(172800), // 2 days ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "10",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(10),
        aboutMe: "Passionate about connections",
        age: "25",
        position: "bottom",
        body: "chubby",
        eggplantSize: "small",
        peachShape: "bubble",
        healthPractices: "condoms",
        hivStatus: "negative",
        preventionPractices: "none",
        hosting: "hostAndTravel",
        travelDistance: "city",
        distance: 3.7,
        lastSeen: 4320
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=10`]
    },
    lastMessage: "Let's catch up soon!",
    lastTime: getTimeAgo(259200), // 3 days ago
    unreadCount: 1
  },
  {
    profile: {
      profileId: "11",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(11),
        aboutMe: "Looking for meaningful relationships",
        age: "28",
        position: "versTop",
        body: "fit",
        eggplantSize: "large",
        peachShape: "average",
        healthPractices: "bb",
        hivStatus: "negative",
        preventionPractices: "prep",
        hosting: "hostOnly",
        travelDistance: "block",
        distance: 0.9,
        lastSeen: 1440
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=11`]
    },
    lastMessage: "Thanks for the great conversation",
    lastTime: getTimeAgo(86400), // 1 day ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "12",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(12),
        aboutMe: "Adventure seeker and fun lover",
        age: "26",
        position: "versBottom",
        body: "slim",
        eggplantSize: "average",
        peachShape: "small",
        healthPractices: "condoms",
        hivStatus: "negative",
        preventionPractices: "prepAndDoxypep",
        hosting: "travelOnly",
        travelDistance: "state",
        distance: 18.4,
        lastSeen: 2880
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=12`]
    },
    lastMessage: "Hope you're having a good day!",
    lastTime: getTimeAgo(172800), // 2 days ago
    unreadCount: 0
  },
  {
    profile: {
      profileId: "13",
      profileInfo: {
        nickName: generateRandomProfileNickNameSimple(13),
        aboutMe: "Easy going and friendly",
        age: "30",
        position: "top",
        body: "muscular",
        eggplantSize: "extraLarge",
        peachShape: "solid",
        healthPractices: "condomsOrBb",
        hivStatus: "negative",
        preventionPractices: "prep",
        hosting: "hostAndTravel",
        travelDistance: "city",
        distance: 5.6,
        lastSeen: 4320
      },
      profileImagesUrls: [`https://picsum.photos/100/100?random=13`]
    },
    lastMessage: "Let's catch up soon!",
    lastTime: getTimeAgo(259200), // 3 days ago
    unreadCount: 1
  }
];
