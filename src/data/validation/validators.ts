
/**
 * Custom validation functions for business logic
 */

import { ValidationError } from '@/infrastructure/errors/ValidationError';

// Credit balance validation
export const validateCreditBalance = (
  userCredits: number,
  requiredCredits: number
): void => {
  if (userCredits < requiredCredits) {
    throw new ValidationError(
      `Insufficient credits. Required: ${requiredCredits}, Available: ${userCredits}`,
      'INSUFFICIENT_CREDITS',
      'credits',
      'medium',
      true,
      `You need ${requiredCredits - userCredits} more credits to play this game.`,
      { required: requiredCredits, available: userCredits }
    );
  }
};

// Game entry validation
export const validateGameEntry = (
  game: any,
  user: any
): void => {
  // Check if game is active
  if (game.status !== 'active') {
    throw new ValidationError(
      'Game is not active',
      'GAME_NOT_ACTIVE',
      'game',
      'medium',
      true,
      'This game is not currently available for play.'
    );
  }

  // Check entry fee vs user credits
  if (game.entry_fee > 0) {
    validateCreditBalance(user.credits, game.entry_fee);
  }

  // Check if user already has an active session
  if (user.current_games?.some((g: any) => g.game_id === game.id && g.status === 'active')) {
    throw new ValidationError(
      'Already have active session for this game',
      'DUPLICATE_GAME_SESSION',
      'game',
      'medium',
      true,
      'You already have an active session for this game. Please complete or abandon it first.'
    );
  }
};

// Puzzle piece validation
export const validatePuzzlePieces = (
  totalPieces: number,
  placedPieces: number[],
  newPiecePosition: number
): void => {
  // Check if piece position is valid
  if (newPiecePosition < 0 || newPiecePosition >= totalPieces) {
    throw new ValidationError(
      'Invalid piece position',
      'INVALID_PIECE_POSITION',
      'position',
      'medium',
      true,
      'The piece cannot be placed in this position.'
    );
  }

  // Check if position is already occupied
  if (placedPieces.includes(newPiecePosition)) {
    throw new ValidationError(
      'Position already occupied',
      'POSITION_OCCUPIED',
      'position',
      'medium',
      true,
      'A piece is already placed in this position.'
    );
  }
};

// Time limit validation
export const validateTimeLimit = (
  startTime: number,
  timeLimit: number
): void => {
  const elapsedTime = (Date.now() - startTime) / 1000;
  
  if (elapsedTime > timeLimit) {
    throw new ValidationError(
      'Time limit exceeded',
      'TIME_LIMIT_EXCEEDED',
      'time',
      'medium',
      false,
      'Time limit has been exceeded for this game.'
    );
  }
};

// Username uniqueness validation
export const validateUsernameUniqueness = async (
  username: string,
  checkFunction: (username: string) => Promise<boolean>
): Promise<void> => {
  const isAvailable = await checkFunction(username);
  
  if (!isAvailable) {
    throw new ValidationError(
      'Username already taken',
      'USERNAME_TAKEN',
      'username',
      'medium',
      true,
      'This username is already taken. Please choose a different one.'
    );
  }
};

// Email uniqueness validation
export const validateEmailUniqueness = async (
  email: string,
  checkFunction: (email: string) => Promise<boolean>
): Promise<void> => {
  const isAvailable = await checkFunction(email);
  
  if (!isAvailable) {
    throw new ValidationError(
      'Email already registered',
      'EMAIL_TAKEN',
      'email',
      'medium',
      true,
      'This email is already registered. Please use a different email or sign in.'
    );
  }
};

// Age verification
export const validateAge = (
  dateOfBirth: string,
  minimumAge: number = 13
): void => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ? age - 1
    : age;
  
  if (actualAge < minimumAge) {
    throw new ValidationError(
      `User must be at least ${minimumAge} years old`,
      'AGE_REQUIREMENT_NOT_MET',
      'dateOfBirth',
      'medium',
      true,
      `You must be at least ${minimumAge} years old to use this service.`
    );
  }
};

// Password strength validation
export const validatePasswordStrength = (
  password: string
): { score: number; feedback: string[] } => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score++;
  else feedback.push('Consider using 12 or more characters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  if (!/(.)\1{2,}/.test(password)) score++;
  else feedback.push('Avoid repeated characters');

  return { score, feedback };
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Prize payout validation
export const validatePrizePayout = (
  userWinnings: number,
  gameResults: any[],
  minimumPayout: number = 5.00
): void => {
  if (userWinnings < minimumPayout) {
    throw new ValidationError(
      `Minimum payout amount is $${minimumPayout}`,
      'MINIMUM_PAYOUT_NOT_MET',
      'winnings',
      'medium',
      true,
      `You need at least $${minimumPayout} in winnings to request a payout.`
    );
  }

  // Verify game results
  const validatedWinnings = gameResults.reduce((total, result) => {
    if (result.is_winner && result.prize_value > 0) {
      return total + result.prize_value;
    }
    return total;
  }, 0);

  if (Math.abs(validatedWinnings - userWinnings) > 0.01) {
    throw new ValidationError(
      'Winnings amount does not match game results',
      'WINNINGS_MISMATCH',
      'winnings',
      'high',
      false,
      'There is a discrepancy in your winnings calculation. Please contact support.'
    );
  }
};

// File upload validation
export const validateFileUpload = (
  file: File,
  allowedTypes: string[],
  maxSize: number
): void => {
  if (!allowedTypes.includes(file.type)) {
    throw new ValidationError(
      'Invalid file type',
      'INVALID_FILE_TYPE',
      'file',
      'medium',
      true,
      `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    );
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / 1024 / 1024);
    throw new ValidationError(
      'File too large',
      'FILE_TOO_LARGE',
      'file',
      'medium',
      true,
      `File size cannot exceed ${maxSizeMB}MB`
    );
  }

  // Check for potentially malicious file names
  if (/[<>:"/\\|?*]/.test(file.name)) {
    throw new ValidationError(
      'Invalid file name',
      'INVALID_FILE_NAME',
      'file',
      'medium',
      true,
      'File name contains invalid characters'
    );
  }
};

// IP address validation
export const validateIpAddress = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Business logic validation helpers
export const businessValidators = {
  creditBalance: validateCreditBalance,
  gameEntry: validateGameEntry,
  puzzlePieces: validatePuzzlePieces,
  timeLimit: validateTimeLimit,
  usernameUniqueness: validateUsernameUniqueness,
  emailUniqueness: validateEmailUniqueness,
  age: validateAge,
  passwordStrength: validatePasswordStrength,
  creditCard: validateCreditCard,
  prizePayout: validatePrizePayout,
  fileUpload: validateFileUpload,
  ipAddress: validateIpAddress
};
