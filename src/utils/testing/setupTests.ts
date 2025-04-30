
// Test setup file
import '@testing-library/jest-dom';

// Add any global mocks or setup for testing here
// This ensures Jest DOM matchers like 'toBeInTheDocument' are available

// Mock Supabase if needed for tests
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({ data: null, error: null })),
        })),
      })),
    })),
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

// Set up a global browser-like environment for tests
global.window = Object.create(window);
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

// Mock browser console to avoid too much noise in tests
console.error = jest.fn();
console.warn = jest.fn();
console.log = jest.fn();
console.debug = jest.fn();

