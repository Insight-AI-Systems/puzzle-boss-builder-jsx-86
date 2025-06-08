
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';

// User session state interface
export interface UserSessionState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  credits: number;
  currentGames: string[];
  achievements: Achievement[];
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: string;
  lastActivity: number;
  sessionTimeout: number;
}

export interface UserProfile {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earned_at: string;
}

// User session actions
type UserSessionAction =
  | { type: 'SET_SESSION'; payload: { user: User | null; session: Session | null } }
  | { type: 'SET_PROFILE'; payload: UserProfile | null }
  | { type: 'UPDATE_CREDITS'; payload: number }
  | { type: 'ADD_CURRENT_GAME'; payload: string }
  | { type: 'REMOVE_CURRENT_GAME'; payload: string }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_ACTIVITY' }
  | { type: 'CLEAR_SESSION' }
  | { type: 'LOAD_SAVED_STATE'; payload: Partial<UserSessionState> };

// Initial state
const initialState: UserSessionState = {
  user: null,
  session: null,
  profile: null,
  credits: 0,
  currentGames: [],
  achievements: [],
  isLoading: true,
  isAuthenticated: false,
  lastActivity: Date.now(),
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
};

// User session reducer
function userSessionReducer(state: UserSessionState, action: UserSessionAction): UserSessionState {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: undefined,
        lastActivity: Date.now(),
      };

    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        credits: action.payload?.credits || 0,
      };

    case 'UPDATE_CREDITS':
      return {
        ...state,
        credits: action.payload,
        profile: state.profile ? { ...state.profile, credits: action.payload } : null,
      };

    case 'ADD_CURRENT_GAME':
      return {
        ...state,
        currentGames: [...state.currentGames.filter(id => id !== action.payload), action.payload],
      };

    case 'REMOVE_CURRENT_GAME':
      return {
        ...state,
        currentGames: state.currentGames.filter(id => id !== action.payload),
      };

    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: undefined,
      };

    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: Date.now(),
      };

    case 'CLEAR_SESSION':
      return {
        ...initialState,
        isLoading: false,
      };

    case 'LOAD_SAVED_STATE':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
}

// Context interface
interface UserContextType {
  userState: UserSessionState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, options?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateCredits: (credits: number) => void;
  addCurrentGame: (gameId: string) => void;
  removeCurrentGame: (gameId: string) => void;
  addAchievement: (achievement: Achievement) => void;
  clearError: () => void;
  checkSessionTimeout: () => boolean;
  refreshSession: () => Promise<void>;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Storage key for persistence
const USER_STORAGE_KEY = 'puzzleboss-user-session';

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [userState, dispatch] = useReducer(userSessionReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(USER_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Don't restore session tokens, let Supabase handle that
        const stateToRestore = {
          ...parsed,
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: true,
        };
        dispatch({ type: 'LOAD_SAVED_STATE', payload: stateToRestore });
      }
    } catch (error) {
      console.error('Failed to load saved user state:', error);
    }

    // Initialize Supabase session
    initializeAuth();
  }, []);

  // Save state to localStorage (excluding sensitive data)
  useEffect(() => {
    try {
      const stateToSave = {
        profile: userState.profile,
        credits: userState.credits,
        currentGames: userState.currentGames,
        achievements: userState.achievements,
        lastActivity: userState.lastActivity,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save user state:', error);
    }
  }, [userState.profile, userState.credits, userState.currentGames, userState.achievements]);

  // Activity tracker
  useEffect(() => {
    const handleActivity = () => {
      dispatch({ type: 'UPDATE_ACTIVITY' });
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Session timeout checker
  useEffect(() => {
    const interval = setInterval(() => {
      if (userState.isAuthenticated && checkSessionTimeout()) {
        console.log('Session timed out due to inactivity');
        signOut();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [userState.isAuthenticated, userState.lastActivity]);

  const initializeAuth = async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        dispatch({ type: 'SET_SESSION', payload: { user: session.user, session } });
        await loadUserProfile(session.user.id);
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state change:', event);
          
          if (session) {
            dispatch({ type: 'SET_SESSION', payload: { user: session.user, session } });
            await loadUserProfile(session.user.id);
          } else {
            dispatch({ type: 'CLEAR_SESSION' });
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const profile: UserProfile = {
          id: data.id,
          email: data.email,
          username: data.username,
          avatar_url: data.avatar_url,
          role: data.role || 'player',
          bio: data.bio,
          credits: data.credits || 0,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        dispatch({ type: 'SET_PROFILE', payload: profile });
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, options?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          ...options,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userState.user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userState.user.id);

      if (error) throw error;

      const updatedProfile = { ...userState.profile, ...updates } as UserProfile;
      dispatch({ type: 'SET_PROFILE', payload: updatedProfile });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const updateCredits = (credits: number) => {
    dispatch({ type: 'UPDATE_CREDITS', payload: credits });
  };

  const addCurrentGame = (gameId: string) => {
    dispatch({ type: 'ADD_CURRENT_GAME', payload: gameId });
  };

  const removeCurrentGame = (gameId: string) => {
    dispatch({ type: 'REMOVE_CURRENT_GAME', payload: gameId });
  };

  const addAchievement = (achievement: Achievement) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const checkSessionTimeout = (): boolean => {
    const now = Date.now();
    const timeSinceActivity = now - userState.lastActivity;
    return timeSinceActivity > userState.sessionTimeout;
  };

  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
    } catch (error) {
      console.error('Session refresh error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh session' });
    }
  };

  const value: UserContextType = {
    userState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateCredits,
    addCurrentGame,
    removeCurrentGame,
    addAchievement,
    clearError,
    checkSessionTimeout,
    refreshSession,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use user context
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
