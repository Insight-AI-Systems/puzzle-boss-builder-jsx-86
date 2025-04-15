
// Re-export auth components from the AuthProvider file
export { AuthProvider, useAuth, useAuthLoading } from './AuthProvider.jsx';

// Add a minimal auth context for debugging
export const MinimalAuthContext = {
  user: null,
  loading: false,
  profile: null,
  signIn: () => console.log('MinimalAuthContext: signIn called'),
  signOut: () => console.log('MinimalAuthContext: signOut called'),
  signUp: () => console.log('MinimalAuthContext: signUp called'),
  resetPassword: () => console.log('MinimalAuthContext: resetPassword called')
};
