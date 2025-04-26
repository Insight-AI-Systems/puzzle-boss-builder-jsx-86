
export interface PuzzleImage {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
}

export const PUZZLE_IMAGES: PuzzleImage[] = [
  {
    id: 'landscape',
    name: 'Mountain Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop&auto=format'
  },
  {
    id: 'code',
    name: 'Code',
    url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop&auto=format'
  },
  {
    id: 'matrix',
    name: 'Matrix',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop&auto=format'
  },
  {
    id: 'robot',
    name: 'Robot',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&auto=format'
  },
  {
    id: 'circuit',
    name: 'Circuit Board',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop&auto=format'
  },
  {
    id: 'laptop',
    name: 'Laptop',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop&auto=format'
  },
  {
    id: 'ducati',
    name: 'Ducati Motorcycle',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87',
    thumbnail: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=100&h=100&fit=crop&auto=format'
  }
];

