
export const getThemeStyles = (theme: string) => {
  switch (theme) {
    case 'light':
      return 'bg-white';
    case 'dark':
      return 'bg-gray-900 text-white';
    case 'colorful':
      return 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white';
    default:
      return 'bg-white';
  }
};

