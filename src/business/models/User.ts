
// User domain models and types
export interface User {
  id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
  last_sign_in: string | null;
  // Profile fields
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  custom_gender: string | null;
  age_group: AgeGroup | null;
  marketing_opt_in: boolean;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
}

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'category_manager' 
  | 'social_media_manager' 
  | 'partner_manager' 
  | 'cfo' 
  | 'player';

export type Gender = 'male' | 'female' | 'non-binary' | 'custom' | 'prefer-not-to-say' | 'other';

export type AgeGroup = '13-17' | '18-24' | '25-34' | '35-44' | '45-60' | '60+';

export interface UserStats {
  totalPuzzlesCompleted: number;
  totalTimePlayed: number;
  averageCompletionTime: number;
  fastestTime: number;
  categoriesPlayed: string[];
  achievements: Achievement[];
  rank: number;
  winnings: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface UserPuzzle {
  id: string;
  puzzle_id: string;
  title: string;
  category: string;
  completion_time: number;
  moves_count: number;
  completed_at: string;
  is_winner: boolean;
  prize_value: number;
}

export interface UserCreateData {
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
}

export interface UserUpdateData {
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  gender?: Gender;
  custom_gender?: string;
  age_group?: AgeGroup;
  marketing_opt_in?: boolean;
}

// User-specific errors
export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User with id ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class UserValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'UserValidationError';
  }
}

export class UserPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserPermissionError';
  }
}
