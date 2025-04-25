// Configuration for internal support ticket system
// Based on existing Issues management system

export const SUPPORT_SYSTEM_CONFIG = {
  // Set to true to use Supabase for data storage instead of OpenSupports
  USE_INTERNAL_SYSTEM: true,
  
  // Default settings
  DEFAULT_LIMIT: 10,
  POLLING_INTERVAL: 60000,
  REQUEST_TIMEOUT: 30000,
  
  // Admin panel URL - for external admin interface if needed
  ADMIN_PANEL_URL: import.meta.env.VITE_SUPPORT_ADMIN_URL || '/admin/support',
  
  // Categories for support tickets
  TICKET_CATEGORIES: [
    { id: 'tech', name: 'Technical Issue' },
    { id: 'account', name: 'Account Problem' },
    { id: 'billing', name: 'Billing Question' },
    { id: 'prize', name: 'Prize Claim' },
    { id: 'feedback', name: 'Feedback' },
    { id: 'other', name: 'Other' }
  ],
  
  // Statuses for tickets
  TICKET_STATUSES: {
    OPEN: 'open',
    IN_PROGRESS: 'in-progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
  },
  
  // Priorities
  TICKET_PRIORITIES: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  }
};

// Keep existing API_PATHS object for backward compatibility
export const API_PATHS = {
  USER: {
    LOGIN: '/user/login',
    SIGNUP: '/user/signup',
    CHECK_SESSION: '/user/check-session',
    LOGOUT: '/user/logout',
  },
  TICKET: {
    CREATE: '/ticket/create',
    GET: '/ticket/get',
    GET_ALL: '/ticket/get-all',
    SEARCH: '/ticket/search',
    COMMENT: '/ticket/comment',
    CHANGE_STATUS: '/ticket/change-status',
    CHANGE_DEPARTMENT: '/ticket/change-department',
    DELETE: '/ticket/delete',
  },
  SYSTEM: {
    GET_SETTINGS: '/system/get-settings',
    GET_DEPARTMENTS: '/system/get-departments',
  },
};
