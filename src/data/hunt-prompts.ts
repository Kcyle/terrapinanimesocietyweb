export interface HuntPrompt {
  id: number;
  slug: string;
  title: string;
  anime: string;
  description: string;
  rules: string[];
  peopleRequired: string;
  type: 'video' | 'photo' | 'both';
  confirmQuestion: string;
}

export const HUNT_PROMPTS: HuntPrompt[] = [
  {
    id: 1,
    slug: 'x7k2m9',
    title: 'Denji Devil Execution',
    anime: 'Chainsaw Man',
    description: 'Choose any devil you want to be. Act out how that devil would defeat a human victim.',
    rules: [
      'Choose any devil you want to be',
      'Act out how that devil would defeat a human victim',
    ],
    peopleRequired: '2 people',
    type: 'video',
    confirmQuestion: 'Which devil did you choose?',
  },
  {
    id: 2,
    slug: 'p4w8n3',
    title: 'Global Speech',
    anime: 'Attack on Titan',
    description: 'Pretend you are addressing the entire world. Choose one side: Eren\'s side, or the rest of the world. Give a dramatic speech explaining why people should follow your side.',
    rules: [
      'Choose one side: Eren\'s side or the rest of the world',
      'Give a dramatic speech explaining why people should follow your side',
      'Must be at least 1 minute long',
    ],
    peopleRequired: '1 person',
    type: 'video',
    confirmQuestion: 'Which side did you choose?',
  },
  {
    id: 3,
    slug: 'r6j1v5',
    title: 'Create Your Quirk',
    anime: 'My Hero Academia',
    description: 'Invent your own Quirk ability. One person explains the power and demonstrates how to use it. The other person acts as the enemy being defeated by the Quirk.',
    rules: [
      'Invent your own Quirk ability',
      'One person explains the power and demonstrates it',
      'Other person acts as the enemy being defeated',
    ],
    peopleRequired: '2 people',
    type: 'video',
    confirmQuestion: 'What is your Quirk called and what does it do?',
  },
  {
    id: 4,
    slug: 'q3t9f7',
    title: 'Romantic Anime Protagonist Moment',
    anime: 'Romance Anime',
    description: 'You are the main character in a romantic anime. Confess your feelings dramatically like you\'re in the final episode confession scene.',
    rules: [
      'Confess your feelings dramatically',
      'Must feel like a final episode confession scene',
    ],
    peopleRequired: '2 people',
    type: 'video',
    confirmQuestion: 'Which romance anime inspired your confession?',
  },
  {
    id: 5,
    slug: 'b8y2h6',
    title: 'Sports Anime Moment',
    anime: 'Haikyuu!! / Blue Lock',
    description: 'Choose any sports anime. Recreate the sport they play as dramatically as you can.',
    rules: [
      'Choose any sports anime',
      'Recreate the sport as dramatically as you can',
    ],
    peopleRequired: '1 person',
    type: 'video',
    confirmQuestion: 'Which sports anime and sport did you recreate?',
  },
  {
    id: 6,
    slug: 'n5c4g1',
    title: 'Time Traveler Twist',
    anime: 'Steins;Gate',
    description: 'You have traveled to a different timeline. Choose one prompt you already completed and flip it. If you did the romantic confession, now reject them. If you gave Eren\'s speech, now support the opposite side.',
    rules: [
      'Choose a prompt you already completed',
      'Flip it to the opposite',
      'If you haven\'t completed another prompt yet, do one first then return',
    ],
    peopleRequired: '1-2 people',
    type: 'video',
    confirmQuestion: 'Which prompt did you flip and how?',
  },
  {
    id: 7,
    slug: 'w1d6s8',
    title: 'Isekai Arrival',
    anime: 'Re:Zero / Slime',
    description: 'You have just been transported to another world. React to being isekai\'d, explain your new world, describe how it works, and physically transition from inside to outside.',
    rules: [
      'React to realizing you\'ve been isekai\'d',
      'Explain the new world (magic system, races, factions)',
      'Start inside the building, go outside as your "entering the new world" moment',
    ],
    peopleRequired: 'Everyone',
    type: 'video',
    confirmQuestion: 'What is your isekai world called and how does it work?',
  },
  {
    id: 8,
    slug: 'v9a3e2',
    title: 'Group Anime Selfie',
    anime: 'Ensemble Character Pose',
    description: 'Take a selfie of your entire group. Each person poses as a different character from the same anime.',
    rules: [
      'Each person poses as a different character from the same anime',
      'All members must be from the same series',
    ],
    peopleRequired: 'Everyone',
    type: 'photo',
    confirmQuestion: 'Which anime did your group pose as?',
  },
  {
    id: 9,
    slug: 'z2l7u4',
    title: 'Training Arc Montage',
    anime: 'Shonen Training Arc',
    description: 'Your team is in a training arc. Include at least three different training scenes.',
    rules: [
      'Include at least 3 different training scenes',
      'Examples: running, push-ups, powering up, practicing moves, yelling',
    ],
    peopleRequired: '1-2 people',
    type: 'video',
    confirmQuestion: 'Which exercises/training did you do?',
  },
];

export const GOOGLE_DRIVE_UPLOAD_URL = 'https://drive.google.com/drive/folders/1ahzQav4_qWv-FJ4OCj0Ng0kGEW7tRaO8?usp=sharing';
