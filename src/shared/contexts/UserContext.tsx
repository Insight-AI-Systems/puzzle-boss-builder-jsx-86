import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/business/models/User';

// Define the types for the context
export interface UserProfile {
  id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  credits: number;
  created_at: string;
  updated_at: string;
  last_sign_in: string | null;
}

export interface UserCurrentGame {
  id: string;
  gameId: string;
  startTime: number;
  endTime?: number;
  score: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface UserContextState {
  isAuthenticated: boolean;
  user: SupabaseUser | null;
  profile: UserProfile | null;
  credits: number;
  currentGames: UserCurrentGame[];
  achievements: UserAchievement[];
  sessionStartTime: number | null;
  lastActivity: number | null;
}

interface UserContextType {
  state: UserContextState;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: {
    username?: string;
    full_name?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  updateCredits: (amount: number) => Promise<{ success: boolean; error?: string }>;
  addCurrentGame: (game: UserCurrentGame) => void;
  removeCurrentGame: (gameId: string) => void;
  updateCurrentGame: (gameId: string, updates: Partial<UserCurrentGame>) => void;
  addAchievement: (achievement: UserAchievement) => void;
  refreshSession: () => void;
  initializeAuth: () => void;
  subscribe: (listener: (state: UserContextState) => void) => () => void;
  getState: () => UserContextState;
}

const defaultState: UserContextState = {
  isAuthenticated: false,
  user: null,
  profile: null,
  credits: 0,
  currentGames: [],
  achievements: [],
  sessionStartTime: null,
  lastActivity: null
};

const UserContext = createContext<UserContextType>({
  state: defaultState,
  signIn: async () => ({ success: false, error: 'Not implemented' }),
  signUp: async () => ({ success: false, error: 'Not implemented' }),
  signOut: async () => { },
  updateProfile: async () => ({ success: false, error: 'Not implemented' }),
  updateCredits: async () => ({ success: false, error: 'Not implemented' }),
  addCurrentGame: () => { },
  removeCurrentGame: () => { },
  updateCurrentGame: () => { },
  addAchievement: () => { },
  refreshSession: () => { },
  initializeAuth: () => { },
  subscribe: () => () => { },
  getState: () => defaultState,
});

const SESSION_TIMEOUT = 1000 * 60 * 60; // 1 hour
const STORAGE_KEY = 'puzzleboss_user_context';

class UserContextService {
  private state: UserContextState = defaultState;
  private listeners: Set<(state: UserContextState) => void> = new Set();
  private sessionTimeoutId: NodeJS.Timeout | null = null;

  constructor() {
    this.state = this.loadFromStorage();
    this.startSessionTimeout();
  }

  private startSessionTimeout(): void {
    if (this.state.isAuthenticated && this.state.sessionStartTime) {
      const timeLeft = this.state.sessionStartTime + SESSION_TIMEOUT - Date.now();
      if (timeLeft > 0) {
        this.sessionTimeoutId = setTimeout(() => this.handleSessionExpired(), timeLeft);
      } else {
        this.handleSessionExpired();
      }
    }
  }

  private clearSessionTimeout(): void {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
      this.sessionTimeoutId = null;
    }
  }

  private resetSessionTimeout(): void {
    this.clearSessionTimeout();
    if (this.state.isAuthenticated) {
      this.state.sessionStartTime = Date.now();
      this.startSessionTimeout();
    }
  }

  private loadFromStorage(): UserContextState {
    try {
      const storedState = localStorage.getItem(STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        return {
          ...defaultState,
          ...parsedState,
          isAuthenticated: parsedState.isAuthenticated || false,
          user: parsedState.user || null,
          profile: parsedState.profile || null,
          credits: parsedState.credits || 0,
          currentGames: parsedState.currentGames || [],
          achievements: parsedState.achievements || [],
          sessionStartTime: parsedState.sessionStartTime || null,
          lastActivity: parsedState.lastActivity || null
        };
      }
    } catch (error) {
      console.error('Error loading user context from local storage:', error);
    }
    return defaultState;
  }

  private saveToStorage(state: UserContextState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Unable to save user context to local storage:', error);
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to clear user context from local storage:', error);
    }
  }

  private handleSessionExpired(): void {
    console.log('Session expired due to inactivity.');
    this.signOut();
  }

  // Authentication methods
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const updatedState: UserContextState = {
          isAuthenticated: true,
          user: data.user,
          profile: profile || null,
          credits: profile?.credits || 0,
          currentGames: [],
          achievements: [],
          sessionStartTime: Date.now(),
          lastActivity: Date.now()
        };

        this.setState(updatedState);
        this.saveToStorage(updatedState);
        this.resetSessionTimeout();

        return { success: true };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      };
    }
  }

  async signUp(email: string, password: string, userData?: {
    username?: string;
    full_name?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      
      const clearedState: UserContextState = {
        isAuthenticated: false,
        user: null,
        profile: null,
        credits: 0,
        currentGames: [],
        achievements: [],
        sessionStartTime: null,
        lastActivity: null
      };

      this.setState(clearedState);
      this.clearStorage();
      this.clearSessionTimeout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // Profile methods
  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.state.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', this.state.user.id)
        .select()
        .single();

      if (error) throw error;

      this.setState({
        ...this.state,
        profile: data as UserProfile,
        lastActivity: Date.now()
      });

      this.saveToStorage(this.state);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      };
    }
  }

  // Credits methods
  async updateCredits(amount: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.state.user?.id) {
        throw new Error('User not authenticated');
      }

      const newCredits = Math.max(0, this.state.credits + amount);

      const { error } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', this.state.user.id);

      if (error) throw error;

      this.setState({
        ...this.state,
        credits: newCredits,
        lastActivity: Date.now()
      });

      this.saveToStorage(this.state);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Credits update failed' 
      };
    }
  }

  // Games methods
  addCurrentGame(game: UserCurrentGame): void {
    const updatedGames = [...this.state.currentGames, game];
    this.setState({
      ...this.state,
      currentGames: updatedGames,
      lastActivity: Date.now()
    });
    this.saveToStorage(this.state);
  }

  removeCurrentGame(gameId: string): void {
    const updatedGames = this.state.currentGames.filter(game => game.id !== gameId);
    this.setState({
      ...this.state,
      currentGames: updatedGames,
      lastActivity: Date.now()
    });
    this.saveToStorage(this.state);
  }

  updateCurrentGame(gameId: string, updates: Partial<UserCurrentGame>): void {
    const updatedGames = this.state.currentGames.map(game =>
      game.id === gameId ? { ...game, ...updates } : game
    );
    this.setState({
      ...this.state,
      currentGames: updatedGames,
      lastActivity: Date.now()
    });
    this.saveToStorage(this.state);
  }

  // Achievements methods
  addAchievement(achievement: UserAchievement): void {
    const updatedAchievements = [...this.state.achievements, achievement];
    this.setState({
      ...this.state,
      achievements: updatedAchievements,
      lastActivity: Date.now()
    });
    this.saveToStorage(this.state);
  }

  // Session management
  refreshSession(): void {
    this.setState({
      ...this.state,
      lastActivity: Date.now()
    });
    this.resetSessionTimeout();
    this.saveToStorage(this.state);
  }

  // State management
  setState(newState: UserContextState): void {
    this.state = newState;
    this.listeners.forEach(listener => listener(newState));
  }

  getState(): UserContextState {
    return this.state;
  }

  subscribe(listener: (state: UserContextState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Initialize authentication listener
  initializeAuth(): void {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const role = profile?.role || 'player';

        const updatedState: UserContextState = {
          isAuthenticated: true,
          user: session.user,
          profile: profile ? { ...profile, role: role as UserRole } : null,
          credits: profile?.credits || 0,
          currentGames: this.state.currentGames,
          achievements: this.state.achievements,
          sessionStartTime: Date.now(),
          lastActivity: Date.now()
        };

        this.setState(updatedState);
        this.saveToStorage(updatedState);
        this.resetSessionTimeout();
      } else if (event === 'SIGNED_OUT') {
        const clearedState: UserContextState = {
          isAuthenticated: false,
          user: null,
          profile: null,
          credits: 0,
          currentGames: [],
          achievements: [],
          sessionStartTime: null,
          lastActivity: null
        };

        this.setState(clearedState);
        this.clearStorage();
        this.clearSessionTimeout();
      }
    });
  }
}

// Create the service instance
const userContextService = new UserContextService();

// Create the provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserContextState>(userContextService.getState());

  useEffect(() => {
    const unsubscribe = userContextService.subscribe(setState);
    userContextService.initializeAuth();
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(
    (email: string, password: string) => userContextService.signIn(email, password),
    []
  );

  const signUp = useCallback(
    (email: string, password: string, userData?: { username?: string; full_name?: string }) => userContextService.signUp(email, password, userData),
    []
  );

  const signOut = useCallback(
    () => userContextService.signOut(),
    []
  );

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => userContextService.updateProfile(updates),
    []
  );

  const updateCredits = useCallback(
    (amount: number) => userContextService.updateCredits(amount),
    []
  );

  const addCurrentGame = useCallback(
    (game: UserCurrentGame) => userContextService.addCurrentGame(game),
    []
  );

  const removeCurrentGame = useCallback(
    (gameId: string) => userContextService.removeCurrentGame(gameId),
    []
  );

  const updateCurrentGame = useCallback(
    (gameId: string, updates: Partial<UserCurrentGame>) => userContextService.updateCurrentGame(gameId, updates),
    []
  );

  const addAchievement = useCallback(
    (achievement: UserAchievement) => userContextService.addAchievement(achievement),
    []
  );

  const refreshSession = useCallback(
    () => userContextService.refreshSession(),
    []
  );

  return (
    <UserContext.Provider
      value={{
        state,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updateCredits,
        addCurrentGame,
        removeCurrentGame,
        updateCurrentGame,
        addAchievement,
        refreshSession,
        initializeAuth: userContextService.initializeAuth,
        subscribe: userContextService.subscribe,
        getState: userContextService.getState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create the hook
export const useUser = (): UserContextType => {
  return useContext(UserContext);
};
