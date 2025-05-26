
export { AuthProvider } from './auth';
export { useAuth } from '@/hooks/auth';

// Export AuthContext and AuthContextType for testing
export type AuthContextType = {
  user: any;
  session: any;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  userRole: string | null;
  userRoles: string[];
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = null; // Placeholder for tests
