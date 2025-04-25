
// Configuration for OpenSupports API
// Replace with actual production values in deployment

export const OPEN_SUPPORTS_CONFIG = {
  API_URL: import.meta.env.VITE_OPEN_SUPPORTS_API_URL || 'http://localhost:8080/api',
  // Time in milliseconds before an API request times out
  REQUEST_TIMEOUT: 30000,
  // Interval in milliseconds to check for ticket updates
  POLLING_INTERVAL: 60000,
  // Default pagination limit for ticket listings
  DEFAULT_LIMIT: 10,
};

// Endpoint paths
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
