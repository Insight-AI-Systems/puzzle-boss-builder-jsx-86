
interface UserSession {
  email: string;
  userId: string;
  loginTime: number;
  isActive: boolean;
}

interface SessionStore {
  [email: string]: UserSession;
}

const SESSION_STORAGE_KEY = 'puzzleboss_active_sessions';

class SessionTracker {
  private storageKey = SESSION_STORAGE_KEY;

  // Get all active sessions
  private getSessionStore(): SessionStore {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading session store:', error);
      return {};
    }
  }

  // Save sessions to localStorage
  private saveSessionStore(store: SessionStore): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(store));
      // Broadcast storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.storageKey,
        newValue: JSON.stringify(store)
      }));
    } catch (error) {
      console.error('Error saving session store:', error);
    }
  }

  // Start tracking a user session
  startSession(email: string, userId: string): void {
    const store = this.getSessionStore();
    store[email] = {
      email,
      userId,
      loginTime: Date.now(),
      isActive: true
    };
    this.saveSessionStore(store);
    console.log('🟢 Session started for:', email);
  }

  // End tracking a user session
  endSession(email: string): void {
    const store = this.getSessionStore();
    if (store[email]) {
      store[email].isActive = false;
      this.saveSessionStore(store);
      console.log('🔴 Session ended for:', email);
    }
  }

  // Check if a user is currently active
  isUserActive(email: string): boolean {
    const store = this.getSessionStore();
    const session = store[email];
    return session?.isActive || false;
  }

  // Get session info for a user
  getUserSession(email: string): UserSession | null {
    const store = this.getSessionStore();
    return store[email] || null;
  }

  // Get all active users
  getActiveUsers(): string[] {
    const store = this.getSessionStore();
    return Object.values(store)
      .filter(session => session.isActive)
      .map(session => session.email);
  }

  // Clean up old inactive sessions (optional maintenance)
  cleanupInactiveSessions(): void {
    const store = this.getSessionStore();
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    Object.keys(store).forEach(email => {
      const session = store[email];
      if (!session.isActive && session.loginTime < cutoffTime) {
        delete store[email];
      }
    });
    
    this.saveSessionStore(store);
  }

  // Listen for cross-tab session changes
  onSessionChange(callback: (activeUsers: string[]) => void): () => void {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === this.storageKey) {
        callback(this.getActiveUsers());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }
}

// Export singleton instance
export const sessionTracker = new SessionTracker();
