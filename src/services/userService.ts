
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/utils/constants';
import { debugLog, DebugLevel } from '@/utils/debug';
import { toast } from '@/hooks/use-toast';
import { QueryClient } from '@tanstack/react-query';

/**
 * User Service
 * Centralized service for handling all user-related operations
 */
export class UserService {
  private queryClient: QueryClient | null = null;
  private static instance: UserService;
  private maxRetries = 3;

  private constructor() {}

  /**
   * Get singleton instance of UserService
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Set the QueryClient instance for cache invalidation
   */
  public setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Get all users with retry mechanism
   */
  public async getAllUsers(retryCount = 0): Promise<UserProfile[]> {
    try {
      debugLog('UserService', 'Fetching all users', DebugLevel.INFO);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`Failed to get current user: ${userError.message}`);
      }

      // Special case for protected admin
      const isCurrentUserProtectedAdmin = isProtectedAdmin(userData?.user?.email);
      
      const { data, error } = await supabase.functions.invoke('get-all-users', {
        method: 'GET',
      });

      if (error) {
        debugLog('UserService', `Error fetching users (attempt ${retryCount + 1}/${this.maxRetries})`, DebugLevel.ERROR, { error });
        
        // Retry logic
        if (retryCount < this.maxRetries) {
          debugLog('UserService', `Retrying user fetch (${retryCount + 1}/${this.maxRetries})`, DebugLevel.INFO);
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.getAllUsers(retryCount + 1);
        }
        
        // If protected admin, provide fallback users list
        if (isCurrentUserProtectedAdmin) {
          debugLog('UserService', 'Using fallback for protected admin', DebugLevel.INFO);
          return this.getFallbackUsers(userData?.user);
        }
        
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        debugLog('UserService', 'Invalid response format from get-all-users', DebugLevel.ERROR);
        
        if (isCurrentUserProtectedAdmin) {
          return this.getFallbackUsers(userData?.user);
        }
        
        throw new Error('Invalid response format from server');
      }
      
      // Transform data into UserProfile format
      const profiles = data.map(user => this.transformUserData(user));
      
      // Special case: ensure protected admin is in the list
      if (isCurrentUserProtectedAdmin && !profiles.some(p => isProtectedAdmin(p.email))) {
        profiles.push({
          id: userData?.user?.id || 'protected-admin',
          email: PROTECTED_ADMIN_EMAIL,
          display_name: 'Protected Admin',
          bio: null,
          avatar_url: null,
          role: 'super_admin',
          country: null,
          categories_played: [],
          credits: 0,
          achievements: [],
          referral_code: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString()
        });
      }
      
      debugLog('UserService', `Successfully retrieved ${profiles.length} users`, DebugLevel.INFO);
      return profiles;
      
    } catch (err) {
      debugLog('UserService', 'Error in getAllUsers', DebugLevel.ERROR, { error: err });
      throw err;
    }
  }

  /**
   * Get a fallback list of users with at least the protected admin
   */
  private getFallbackUsers(currentUser: any): UserProfile[] {
    return [{
      id: currentUser?.id || 'protected-admin',
      email: PROTECTED_ADMIN_EMAIL,
      display_name: 'Protected Admin',
      bio: null,
      avatar_url: null,
      role: 'super_admin',
      country: null,
      categories_played: [],
      credits: 0,
      achievements: [],
      referral_code: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in: new Date().toISOString()
    }];
  }

  /**
   * Transform raw user data into UserProfile format
   */
  private transformUserData(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email || null,
      display_name: user.display_name || user.email?.split('@')[0] || 'Anonymous User',
      bio: user.bio || null,
      avatar_url: user.avatar_url || null,
      role: (user.role || 'player') as UserRole,
      country: user.country || null,
      categories_played: user.categories_played || [],
      credits: user.credits || 0,
      achievements: [],
      referral_code: null,
      gender: user.gender || null,
      custom_gender: user.custom_gender || null,
      age_group: user.age_group || null,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
      last_sign_in: user.last_sign_in || null
    };
  }

  /**
   * Validate user data before sending to the database
   */
  private validateUserData(user: Partial<UserProfile>): string | null {
    if (!user.id) {
      return 'User ID is required';
    }
    
    if (user.email && !this.isValidEmail(user.email)) {
      return 'Invalid email format';
    }
    
    if (user.role && !this.isValidRole(user.role)) {
      return `Invalid role: ${user.role}`;
    }
    
    return null;
  }

  /**
   * Check if email is the protected admin
   */
  public isProtectedAdmin(email?: string | null): boolean {
    return isProtectedAdmin(email);
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate user role
   */
  private isValidRole(role: string): boolean {
    const validRoles = [
      'super_admin', 
      'admin', 
      'category_manager', 
      'social_media_manager', 
      'partner_manager',
      'cfo',
      'player'
    ];
    
    return validRoles.includes(role);
  }

  /**
   * Get user profile by ID
   */
  public async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      debugLog('UserService', `Fetching user profile for ${userId}`, DebugLevel.INFO);
      
      // Check if this is the protected admin
      if (userId === PROTECTED_ADMIN_EMAIL) {
        return {
          id: userId,
          email: PROTECTED_ADMIN_EMAIL,
          display_name: 'Protected Admin',
          bio: null,
          avatar_url: null,
          role: 'super_admin',
          country: null,
          categories_played: [],
          credits: 0,
          achievements: [],
          referral_code: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString()
        };
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        debugLog('UserService', `Error fetching user ${userId}`, DebugLevel.ERROR, { error });
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return this.transformUserData(data);
      
    } catch (err) {
      debugLog('UserService', `Error getting user ${userId}`, DebugLevel.ERROR, { error: err });
      throw err;
    }
  }

  /**
   * Update user profile data
   */
  public async updateUserProfile(userId: string, userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // Validate data
      const validationError = this.validateUserData({ ...userData, id: userId });
      if (validationError) {
        throw new Error(`Validation error: ${validationError}`);
      }
      
      debugLog('UserService', `Updating user ${userId}`, DebugLevel.INFO, { userData });
      
      // Create a sanitized version of the user data that matches the database schema
      // This fixes the type mismatch with age_group and other enum fields
      const sanitizedData: Record<string, any> = {};
      
      // Only copy fields that are actually present and not null/undefined
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          sanitizedData[key] = value;
        }
      });
      
      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', userId)
        .select('*')
        .single();
      
      if (error) {
        debugLog('UserService', `Error updating user ${userId}`, DebugLevel.ERROR, { error });
        throw error;
      }
      
      // Invalidate cache
      if (this.queryClient) {
        this.queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        this.queryClient.invalidateQueries({ queryKey: ['all-users'] });
      }
      
      return this.transformUserData(data);
      
    } catch (err) {
      debugLog('UserService', `Error updating user ${userId}`, DebugLevel.ERROR, { error: err });
      throw err;
    }
  }

  /**
   * Filter users based on criteria
   */
  public filterUsers(users: UserProfile[], filters: {
    searchQuery?: string;
    role?: string | null;
    country?: string | null;
    userType?: 'regular' | 'admin';
  }): UserProfile[] {
    const adminRoles = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
    
    return users.filter(user => {
      // User type filter (admin vs regular)
      if (filters.userType === 'admin') {
        if (!adminRoles.includes(user.role)) return false;
      } else if (filters.userType === 'regular') {
        if (adminRoles.includes(user.role)) return false;
      }
      
      // Search query filter
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const emailMatch = user.email?.toLowerCase().includes(query);
        const nameMatch = user.display_name?.toLowerCase().includes(query);
        if (!emailMatch && !nameMatch) return false;
      }
      
      // Role filter
      if (filters.role && user.role !== filters.role) {
        return false;
      }
      
      // Country filter
      if (filters.country && user.country !== filters.country) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Sort users by various criteria
   */
  public sortUsers(users: UserProfile[], sortBy: string, sortDirection: 'asc' | 'desc'): UserProfile[] {
    return [...users].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortBy) {
        case 'role':
          valueA = a.role;
          valueB = b.role;
          break;
        case 'lastLogin':
          valueA = a.last_sign_in ? new Date(a.last_sign_in).getTime() : 0;
          valueB = b.last_sign_in ? new Date(b.last_sign_in).getTime() : 0;
          break;
        case 'created':
          valueA = new Date(a.created_at).getTime();
          valueB = new Date(b.created_at).getTime();
          break;
        case 'name':
          valueA = a.display_name || '';
          valueB = b.display_name || '';
          break;
        default:
          valueA = a.display_name || '';
          valueB = b.display_name || '';
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }
}

// Export singleton instance
export const userService = UserService.getInstance();
