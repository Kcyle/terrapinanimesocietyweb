export interface HuntPrompt {
  id: number;
  slug: string;
  title: string;
  anime: string;
  description: string;
  rules: string[];
  peopleRequired: string;
  type: 'video' | 'photo' | 'both';
}

export const HUNT_PROMPTS: HuntPrompt[] = [
  {
    id: 1,
    slug: 'x7k2m9',
    title: 'Denji Devil Execution',
    anime: 'Chainsaw Man',
    description: 'Choose any devil you want to be. Act out how that devil would defeat a human victim in the most over-the-top anime way possible.',
    rules: [
      'Choose any devil you want to be',
      'Act out how that devil would defeat a human victim',
      'Must be the most over-the-top anime way possible',
    ],
    peopleRequired: '2 people',
    type: 'video',
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
  },
  {
    id: 3,
    slug: 'r6j1v5',
    title: 'Create Your Quirk',
    anime: 'My Hero Academia',
    description: 'Invent your own Quirk ability. One person must explain the power and demonstrate how to use it. The other person must act as the enemy being defeated by the Quirk.',
    rules: [
      'Invent your own Quirk ability',
      'One person explains the power and demonstrates it',
      'Other person acts as the enemy being defeated',
    ],
    peopleRequired: '2 people',
    type: 'video',
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
      'Optional: fall to your knees, stare into the sunset, or shout their name',
    ],
    peopleRequired: '2 people',
    type: 'video',
  },
  {
    id: 5,
    slug: 'b8y2h6',
    title: 'Sports Anime Moment',
    anime: 'Haikyuu!! / Blue Lock',
    description: 'Choose any sports anime. Recreate the sport they play in the most dramatic anime way possible.',
    rules: [
      'Choose any sports anime',
      'Recreate the sport in the most dramatic anime way',
      'Include: slow-motion jumps, intense yelling, internal monologues, etc.',
    ],
    peopleRequired: '1 person',
    type: 'video',
  },
  {
    id: 6,
    slug: 'n5c4g1',
    title: 'Time Traveler Twist',
    anime: 'Steins;Gate',
    description: 'You have traveled to a different timeline. Choose one prompt you already completed and flip it. If you did the romantic confession, you must now reject them. If you gave Eren\'s speech, you must now support the opposite side.',
    rules: [
      'Choose a prompt you already completed',
      'Flip it to the opposite',
      'If you haven\'t completed another prompt yet, do one first then return',
    ],
    peopleRequired: '1-2 people',
    type: 'video',
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
      'Be as dramatic and creative as possible',
    ],
    peopleRequired: 'Everyone',
    type: 'video',
  },
  {
    id: 8,
    slug: 'v9a3e2',
    title: 'Group Anime Selfie',
    anime: 'Ensemble Character Pose',
    description: 'Take a selfie of your entire group. Each person must pose as a character from the same anime. All team members must be from the same series.',
    rules: [
      'Each person poses as a character from the same anime',
      'All members must be from the same series',
      'Bonus: matching iconic poses, facial expressions, props',
    ],
    peopleRequired: 'Everyone',
    type: 'photo',
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
      'Bonus points for slow-motion or narration',
    ],
    peopleRequired: '1-2 people',
    type: 'video',
  },
];

export const GOOGLE_DRIVE_UPLOAD_URL = 'https://drive.google.com/drive/folders/1ahzQav4_qWv-FJ4OCj0Ng0kGEW7tRaO8?usp=sharing';
