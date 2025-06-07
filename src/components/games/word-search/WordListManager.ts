
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
      'PEACOCK', 'HAMSTER', 'RACCOON', 'PORCUPINE', 'LEOPARD'
    ]
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    description: 'Delicious foods and beverages',
    words: [
      'PIZZA', 'HAMBURGER', 'CHOCOLATE', 'STRAWBERRY', 'BANANA',
      'SANDWICH', 'PANCAKE', 'COOKIE', 'SMOOTHIE', 'MUFFIN',
      'PRETZEL', 'POPCORN', 'WAFFLE', 'CUPCAKE', 'MILKSHAKE'
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletic activities and games',
    words: [
      'FOOTBALL', 'BASKETBALL', 'BASEBALL', 'TENNIS', 'VOLLEYBALL',
      'SWIMMING', 'CYCLING', 'RUNNING', 'GOLF', 'HOCKEY',
      'BOWLING', 'BOXING', 'WRESTLING', 'SKIING', 'SURFING'
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Natural world and outdoors',
    words: [
      'MOUNTAIN', 'RAINBOW', 'THUNDER', 'LIGHTNING', 'WATERFALL',
      'FOREST', 'DESERT', 'OCEAN', 'RIVER', 'VALLEY',
      'MEADOW', 'GLACIER', 'VOLCANO', 'ISLAND', 'CANYON'
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Modern tech and gadgets',
    words: [
      'COMPUTER', 'SMARTPHONE', 'INTERNET', 'WEBSITE', 'SOFTWARE',
      'KEYBOARD', 'MONITOR', 'PRINTER', 'SCANNER', 'CAMERA',
      'TABLET', 'LAPTOP', 'ROUTER', 'BLUETOOTH', 'WIRELESS'
    ]
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Cosmic objects and astronomy',
    words: [
      'GALAXY', 'PLANET', 'ASTEROID', 'COMET', 'NEBULA',
      'SATELLITE', 'TELESCOPE', 'ASTRONAUT', 'ROCKET', 'SPACECRAFT',
      'METEOR', 'UNIVERSE', 'CONSTELLATION', 'SUPERNOVA', 'BLACKHOLE'
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
      return 8;
    case 'pro':
      return 12;
    case 'master':
      return 15;
    default:
      return 8;
  }
};
