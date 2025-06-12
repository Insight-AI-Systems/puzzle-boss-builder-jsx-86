
export interface WordCategory {
  id: string;
  name: string;
  description: string;
  words: string[];
}

export const wordCategories: WordCategory[] = [
  {
    id: 'animals',
    name: 'Animals',
    description: 'Creatures from around the world',
    words: [
      'ELEPHANT', 'GIRAFFE', 'PENGUIN', 'KANGAROO', 'BUTTERFLY',
      'DOLPHIN', 'OCTOPUS', 'CHEETAH', 'RHINOCEROS', 'FLAMINGO',
      'PEACOCK', 'HAMSTER', 'RACCOON', 'PORCUPINE', 'LEOPARD',
      'TIGER', 'ZEBRA', 'MONKEY', 'RABBIT', 'SQUIRREL',
      'BEAR', 'WOLF', 'FOX', 'DEER', 'EAGLE'
    ]
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    description: 'Delicious foods and beverages',
    words: [
      'PIZZA', 'HAMBURGER', 'CHOCOLATE', 'STRAWBERRY', 'BANANA',
      'SANDWICH', 'PANCAKE', 'COOKIE', 'SMOOTHIE', 'MUFFIN',
      'PRETZEL', 'POPCORN', 'WAFFLE', 'CUPCAKE', 'MILKSHAKE',
      'APPLE', 'ORANGE', 'GRAPE', 'CHERRY', 'LEMON',
      'BREAD', 'CHEESE', 'PASTA', 'SALAD', 'SOUP'
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletic activities and games',
    words: [
      'FOOTBALL', 'BASKETBALL', 'BASEBALL', 'TENNIS', 'VOLLEYBALL',
      'SWIMMING', 'CYCLING', 'RUNNING', 'GOLF', 'HOCKEY',
      'BOWLING', 'BOXING', 'WRESTLING', 'SKIING', 'SURFING',
      'SOCCER', 'CRICKET', 'RUGBY', 'TRACK', 'FIELD',
      'RACING', 'JUMPING', 'THROWING', 'MARATHON', 'SPRINT'
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Natural world and outdoors',
    words: [
      'MOUNTAIN', 'RAINBOW', 'THUNDER', 'LIGHTNING', 'WATERFALL',
      'FOREST', 'DESERT', 'OCEAN', 'RIVER', 'VALLEY',
      'MEADOW', 'GLACIER', 'VOLCANO', 'ISLAND', 'CANYON',
      'TREE', 'FLOWER', 'GRASS', 'LAKE', 'STREAM',
      'CLOUD', 'WIND', 'RAIN', 'SNOW', 'SUN'
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Modern tech and gadgets',
    words: [
      'COMPUTER', 'SMARTPHONE', 'INTERNET', 'WEBSITE', 'SOFTWARE',
      'KEYBOARD', 'MONITOR', 'PRINTER', 'SCANNER', 'CAMERA',
      'TABLET', 'LAPTOP', 'ROUTER', 'BLUETOOTH', 'WIRELESS',
      'PHONE', 'EMAIL', 'GAME', 'APP', 'CODE',
      'ROBOT', 'DRONE', 'VIRTUAL', 'DIGITAL', 'CYBER'
    ]
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Cosmic objects and astronomy',
    words: [
      'GALAXY', 'PLANET', 'ASTEROID', 'COMET', 'NEBULA',
      'SATELLITE', 'TELESCOPE', 'ASTRONAUT', 'ROCKET', 'SPACECRAFT',
      'METEOR', 'UNIVERSE', 'CONSTELLATION', 'SUPERNOVA', 'BLACKHOLE',
      'STAR', 'MOON', 'EARTH', 'MARS', 'VENUS',
      'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'
    ]
  }
];

export const getWordsByCategory = (categoryId: string): string[] => {
  const category = wordCategories.find(cat => cat.id === categoryId);
  return category ? category.words : [];
};

export const getRandomWordsFromCategory = (categoryId: string, count: number, difficulty: 'rookie' | 'pro' | 'master'): string[] => {
  const allWords = getWordsByCategory(categoryId);
  
  // Filter by difficulty (word length)
  const filteredWords = allWords.filter(word => {
    switch (difficulty) {
      case 'rookie':
        return word.length >= 4 && word.length <= 8;
      case 'pro':
        return word.length >= 6 && word.length <= 10;
      case 'master':
        return word.length >= 7 && word.length <= 12;
      default:
        return true;
    }
  });
  
  // Shuffle and take requested count
  const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getDifficultyWordCount = (difficulty: 'rookie' | 'pro' | 'master'): number => {
  switch (difficulty) {
    case 'rookie':
      return 15;
    case 'pro':
      return 20;
    case 'master':
      return 25;
    default:
      return 15;
  }
};
