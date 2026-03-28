export interface StaffMember {
  id: string;
  name: string;
  role: 'maid' | 'butler' | 'staff';
  personaName?: string;
  traits?: string[];
  description?: string;
  pairedWith?: string;
  block?: 'A' | 'B' | 'C';
  image?: string;
  accent: string;
}

export const maids: StaffMember[] = [
  {
    id: 'ryn',
    name: 'Ryn Kim',
    role: 'maid',
    personaName: 'Bakadere',
    traits: ['Airheaded', 'Clumsy', 'Lighthearted', 'Teasing'],
    description: "I may knock over a few things or forget your order but my heart's 1000% in the game! Please be patient with me, I swear I'm trying my best!",
    accent: '#FF9BD2',
  },
  {
    id: 'sarah',
    name: 'Sarah Wang',
    role: 'maid',
    personaName: 'Her Highness',
    traits: ['Smug', 'Dramatic', 'Energetic', 'Borderline-Delusional'],
    description: "I suppose even someone like you deserves proper service. Go on, sit nicely and feel blessed by my presence -- you're being served by the best maid here, after all!",
    accent: '#D4AF37',
  },
  {
    id: 'zhe',
    name: 'Zhe Shen',
    role: 'maid',
    personaName: 'Nerd Tsundere',
    traits: ['Tsundere', 'Nerdy', 'Secretly Caring'],
    description: "It's not like I like you or I care about you. Whatever. Hmph. Do you want to study with me in STEM lib?",
    pairedWith: 'Sarah (maybe)',
    accent: '#7B68EE',
  },
  {
    id: 'cecile',
    name: 'Cecile Chiu',
    role: 'maid',
    personaName: 'Deredere',
    traits: ['Affectionate', 'Energetic', 'Cheerful'],
    description: 'I promise to be as sweet as cake and as bright as the sun!',
    pairedWith: 'Ella Robinson',
    accent: '#FFB347',
  },
  {
    id: 'julian',
    name: 'Julian Hurst',
    role: 'maid',
    personaName: 'Mesugaki',
    traits: ['Immature', 'Smart', 'Teasing', 'Secretly a Nerd'],
    description: "Of course someone like you goshujin-sama wouldn't know the historical context behind Italian dark roasts simply originating from lower quality beans, I suppose. You were probably too busy thinking strange thoughts about my stockings.",
    accent: '#FF6B6B',
  },
  {
    id: 'justin',
    name: 'Justin Clark',
    role: 'maid',
    personaName: 'The Servant',
    traits: ['Intelligent', 'Aloof', 'Loyal'],
    description: 'Will go to the ends of the earth to get you that water refill. Is susceptible to bribes.',
    accent: '#4ECDC4',
  },
  {
    id: 'natalie',
    name: 'Natalie Chanthavong',
    role: 'maid',
    personaName: 'Moe/Kawaii',
    traits: ['Energetic', 'Enthusiastic', 'Friendly', 'Cute'],
    description: 'Energetic, Fun, and a little Cheeky! My cheeriness will brighten up your day!',
    accent: '#FF69B4',
  },
  {
    id: 'kiara',
    name: 'Kiara Planta',
    role: 'maid',
    personaName: 'The Sweet Sarcastic Type',
    traits: ['Sweet', 'Playful', 'Dry Humor', 'Clever'],
    description: "Maid by day, comedian by night. Always ready to serve up a smile with some yummy sweets and a side of sarcasm.",
    accent: '#DDA0DD',
  },
  {
    id: 'noah',
    name: 'Noah Martin',
    role: 'maid',
    personaName: 'Nonchalant Tsundere',
    traits: ['Nonchalant', 'Lowkey Tsundere'],
    description: "Whatever... it's not like I made this specially for you or anything.",
    pairedWith: 'Gabriel Khawaja',
    accent: '#87CEEB',
  },
  {
    id: 'jeremiah',
    name: 'Jeremiah Xiang Fan',
    role: 'maid',
    traits: ['Playful', 'Energetic', 'Curious'],
    description: 'A playful spirit with a mysterious animal theme. Might be a wolf, cat, or fox -- who knows?',
    accent: '#98D8C8',
  },
  {
    id: 'ramin',
    name: 'Ramin Patwary',
    role: 'maid',
    accent: '#C9B1FF',
  },
  {
    id: 'joyna',
    name: 'Joyna Qin',
    role: 'maid',
    pairedWith: 'Nina Xie',
    accent: '#FFB6C1',
  },
  {
    id: 'joely',
    name: 'Joely D',
    role: 'maid',
    pairedWith: 'Zayan Azom',
    accent: '#FFDAB9',
  },
  {
    id: 'kyle-d',
    name: 'Kyle Duong',
    role: 'maid',
    accent: '#B0E0E6',
  },
  {
    id: 'nina',
    name: 'Nina Xie',
    role: 'maid',
    pairedWith: 'Joyna Qin',
    accent: '#E6E6FA',
  },
  {
    id: 'ella',
    name: 'Ella Robinson',
    role: 'maid',
    pairedWith: 'Cecile Chiu',
    accent: '#FADADD',
  },
  {
    id: 'bryan',
    name: 'Bryan Wang',
    role: 'maid',
    accent: '#B2DFDB',
  },
  {
    id: 'amaya',
    name: 'Amaya Ake',
    role: 'maid',
    accent: '#F8BBD0',
  },
];

export const butlers: StaffMember[] = [
  {
    id: 'aahil',
    name: 'Aahil Syed',
    role: 'butler',
    personaName: 'Tigger',
    traits: ['Lighthearted', 'Outgoing', 'Rambunctious', 'Energetic'],
    description: "Tigger is here to serve you! A bouncy trouncy flouncy pouncy bundle of fun, and the most wonderful thing is that I'm the only one!",
    accent: '#FFA500',
  },
  {
    id: 'gabriel',
    name: 'Gabriel Khawaja',
    role: 'butler',
    personaName: 'The Chalant Butler',
    traits: ['Fun', 'Interactive', 'Welcoming'],
    description: 'Here to have fun with you and make you feel right at home. Sit back, relax, and enjoy the show.',
    pairedWith: 'Noah Martin',
    accent: '#C0A060',
  },
  {
    id: 'zayan',
    name: 'Zayan Azom',
    role: 'butler',
    personaName: 'Professional Degrader',
    traits: ['Snarky', 'Prickly', 'Condescending', 'Witty'],
    description: "You must be quite a loser to want to spend your time in a place like this. Your parents are probably so disappointed in you.",
    pairedWith: 'Joely D',
    accent: '#8B0000',
  },
  {
    id: 'nikolai',
    name: 'Nikolai Nemeroff',
    role: 'butler',
    personaName: 'Cowboy Butler',
    traits: ['Rugged', 'Rough but Caring', 'Mysterious'],
    description: "How're y'all doin'? 'Scuse the getup but I gotta act all prim n proper for the guests tonight. It's a special occasion.",
    accent: '#8B4513',
  },
  {
    id: 'adam',
    name: 'Adam Simone',
    role: 'butler',
    pairedWith: 'Nikolai Nemeroff',
    accent: '#708090',
  },
];

export const staffMembers: StaffMember[] = [
  { id: 'oliver', name: 'Oliver Aristoteles', role: 'staff', accent: '#666' },
  { id: 'anna', name: 'Anna Bobo', role: 'staff', accent: '#666' },
  { id: 'eisenhower', name: 'Eisenhower Kondo', role: 'staff', accent: '#666' },
  { id: 'quindin', name: 'Quindin', role: 'staff', accent: '#666' },
  { id: 'lucas', name: 'Lucas', role: 'staff', accent: '#666' },
  { id: 'kyle', name: 'Kyle', role: 'staff', accent: '#666' },
];

export const allServingStaff = [...maids, ...butlers];
