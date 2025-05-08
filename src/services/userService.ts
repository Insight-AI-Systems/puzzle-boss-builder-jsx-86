
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { debugLog, DebugLevel } from '@/utils/debug';
import { monitoringService } from '@/utils/monitoring/monitoringService';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/config/securityConfig';

// In-memory cache for users to reduce API calls
type UserCache = {
  [key: string]: {
    profile: UserProfile;
    timestamp: number;
  }
};

interface UserFilterOptions {
  searchQuery?: string;
  role?: UserRole | null;
  country?: string | null;
  userType?: 'all' | 'admin' | 'player' | 'regular';
}

/**
 * User Service
 * Central service for managing user operations
 */
class UserService {
  private static instance: UserService;
  private cache: UserCache = {};
  private cacheExpiry = 1000 * 60 * 5; // 5 minutes
  private maxRetries = 3;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get user by ID with caching
   */
  public async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      // Check cache first
      if (this.cache[userId] && Date.now() - this.cache[userId].timestamp < this.cacheExpiry) {
        debugLog('UserService', `Cache hit for user ${userId}`, DebugLevel.INFO);
        return this.cache[userId].profile;
      }
      
      debugLog('UserService', `Fetching user by ID: ${userId}`, DebugLevel.INFO);
      let retries = 0;
      
      const fetchUser = async (): Promise<UserProfile | null> => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (error) {
            throw error;
          }
          
          if (!data) {
            return null;
          }
          
          // Convert to UserProfile and cache
          const profile: UserProfile = {
            id: data.id,
            display_name: data.username || data.display_name || null,
            email: data.email || null,
            bio: data.bio || null,
            avatar_url: data.avatar_url || null,
            role: data.role as UserRole,
            country: data.country || null,
            categories_played: data.categories_played || [],
            credits: data.credits || 0,
            achievements: data.achievements || [],
            referral_code: data.referral_code || null,
            gender: data.gender || undefined,
            custom_gender: data.custom_gender || null,
            age_group: data.age_group || undefined,
            created_at: data.created_at,
            updated_at: data.updated_at,
            last_sign_in: data.last_sign_in || null,
            account_locked: data.account_locked || false
          };
          
          this.cache[userId] = { profile, timestamp: Date.now() };
          return profile;
          
        } catch (err) {
          // Handle network errors with retry
          if (retries < this.maxRetries) {
            retries++;
            const delay = Math.pow(2, retries) * 500; // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchUser();
          }
          throw err;
        }
      };
      
      return await fetchUser();
      
    } catch (err) {
      debugLog('UserService', `Error getting user by ID: ${userId}`, DebugLevel.ERROR, { error: err });
      monitoringService.trackError(err instanceof Error ? err : new Error('Failed to get user'), 'medium', {
        userId,
        operation: 'getUserById'
      });
      return null;
    }
  }

  /**
   * Get all users
   */
  public async getAllUsers(): Promise<UserProfile[]> {
    try {
      debugLog('UserService', 'Fetching all users', DebugLevel.INFO);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (!data || !Array.isArray(data)) {
        return [];
      }
      
      // Convert to UserProfiles and update cache
      const profiles: UserProfile[] = data.map(item => {
        const profile: UserProfile = {
          id: item.id,
          display_name: item.username || item.display_name || null,
          email: item.email || null,
          bio: item.bio || null,
          avatar_url: item.avatar_url || null,
          role: item.role as UserRole,
          country: item.country || null,
          categories_played: item.categories_played || [],
          credits: item.credits || 0,
          achievements: item.achievements || [],
          referral_code: item.referral_code || null,
          created_at: item.created_at,
          updated_at: item.updated_at,
          last_sign_in: item.last_sign_in || null,
          gender: item.gender || undefined,
          custom_gender: item.custom_gender || null,
          age_group: item.age_group || undefined,
          account_locked: item.account_locked || false
        };
        
        // Update cache
        this.cache[item.id] = { profile, timestamp: Date.now() };
        return profile;
      });
      
      return profiles;
      
    } catch (err) {
      debugLog('UserService', 'Error fetching all users', DebugLevel.ERROR, { error: err });
      monitoringService.trackError(err instanceof Error ? err : new Error('Failed to get users'), 'medium', {
        operation: 'getAllUsers'
      });
      return [];
    }
  }

  /**
   * Search users by query
   */
  public async searchUsers(query: string): Promise<UserProfile[]> {
    if (!query || query.length < 2) {
      return [];
    }
    
    try {
      debugLog('UserService', `Searching users with query: ${query}`, DebugLevel.INFO);
      
      // Search by email, display_name, username
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,email.ilike.%${query}%,id.eq.${query}`);
      
      if (error) {
        throw error;
      }
      
      if (!data || !Array.isArray(data)) {
        return [];
      }
      
      // Convert to UserProfiles and update cache
      const profiles: UserProfile[] = data.map(item => {
        const profile = {
          id: item.id,
          display_name: item.username || item.display_name || null,
          email: item.email || null,
          bio: item.bio || null,
          avatar_url: item.avatar_url || null,
          role: item.role as UserRole,
          country: item.country || null,
          categories_played: item.categories_played || [],
          credits: item.credits || 0,
          achievements: item.achievements || [],
          referral_code: item.referral_code || null,
          created_at: item.created_at,
          updated_at: item.updated_at,
          last_sign_in: item.last_sign_in || null,
          gender: item.gender || undefined,
          custom_gender: item.custom_gender || null,
          age_group: item.age_group || undefined
        };
        
        // Update cache
        this.cache[item.id] = { profile, timestamp: Date.now() };
        return profile;
      });
      
      return profiles;
      
    } catch (err) {
      debugLog('UserService', `Error searching users: ${query}`, DebugLevel.ERROR, { error: err });
      return [];
    }
  }
  
  /**
   * Filter users based on criteria
   */
  public filterUsers(users: UserProfile[], options: UserFilterOptions): UserProfile[] {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    
    let filtered = [...users];
    
    // Filter by search query
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.display_name?.toLowerCase().includes(query) || 
        user.email?.toLowerCase().includes(query) || 
        user.id.toLowerCase().includes(query)
      );
    }
    
    // Filter by role
    if (options.role) {
      filtered = filtered.filter(user => user.role === options.role);
    }
    
    // Filter by country
    if (options.country) {
      filtered = filtered.filter(user => user.country === options.country);
    }
    
    // Filter by user type
    if (options.userType === 'admin') {
      filtered = filtered.filter(user => 
        user.role === 'admin' || 
        user.role === 'super_admin' ||
        user.role === 'category_manager' ||
        user.role === 'social_media_manager' ||
        user.role === 'partner_manager' ||
        user.role === 'cfo'
      );
    } else if (options.userType === 'player') {
      filtered = filtered.filter(user => user.role === 'player');
    }
    
    return filtered;
  }
  
  /**
   * Create a new user
   */
  public async createUser(email: string, password: string, userData: Partial<UserProfile>): Promise<{success: boolean, error?: Error, user?: UserProfile}> {
    try {
      debugLog('UserService', `Creating new user: ${email}`, DebugLevel.INFO);
      
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: userData.display_name
          }
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('User creation failed');
      }
      
      // Then, update the profile with additional data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          username: userData.display_name,
          bio: userData.bio,
          avatar_url: userData.avatar_url,
          role: userData.role || 'player',
          country: userData.country
        })
        .eq('id', authData.user.id)
        .select();
      
      if (profileError) {
        throw profileError;
      }
      
      // Get the complete user profile
      const user = await this.getUserById(authData.user.id);
      
      if (!user) {
        throw new Error('Failed to retrieve created user');
      }
      
      return {success: true, user};
      
    } catch (err) {
      debugLog('UserService', `Error creating user: ${err}`, DebugLevel.ERROR);
      return {success: false, error: err instanceof Error ? err : new Error('User creation failed')};
    }
  }
  
  /**
   * Update user profile
   */
  public async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{success: boolean, error?: Error}> {
    try {
      debugLog('UserService', `Updating user ${userId}`, DebugLevel.INFO, { updates });
      
      // Remove properties that cannot be updated directly
      const { id, created_at, updated_at, ...updateData } = updates;
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Invalidate cache
      delete this.cache[userId];
      
      return {success: true};
      
    } catch (err) {
      debugLog('UserService', `Error updating user ${userId}`, DebugLevel.ERROR, { error: err });
      return {success: false, error: err instanceof Error ? err : new Error('Failed to update user')};
    }
  }
  
  /**
   * Delete a user
   */
  public async deleteUser(userId: string): Promise<{success: boolean, error?: Error}> {
    try {
      debugLog('UserService', `Deleting user ${userId}`, DebugLevel.INFO);
      
      // Check if this is a protected admin
      const user = await this.getUserById(userId);
      if (user && this.isProtectedAdmin(user.email)) {
        return {
          success: false,
          error: new Error('Cannot delete protected admin account')
        };
      }
      
      // Delete from auth (this should cascade to profiles due to RLS)
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });
      
      if (error) {
        throw error;
      }
      
      // Remove from cache
      delete this.cache[userId];
      
      return {success: true};
      
    } catch (err) {
      debugLog('UserService', `Error deleting user ${userId}`, DebugLevel.ERROR, { error: err });
      return {success: false, error: err instanceof Error ? err : new Error('Failed to delete user')};
    }
  }
  
  /**
   * Check if an email belongs to a protected admin
   */
  public isProtectedAdmin(email?: string | null): boolean {
    if (!email) return false;
    return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
  }
  
  /**
   * Check if an email belongs to a protected admin
   */
  public isProtectedAdminEmail(email?: string | null): boolean {
    return isProtectedAdmin(email);
  }
}

// Export singleton instance
export const userService = UserService.getInstance();
