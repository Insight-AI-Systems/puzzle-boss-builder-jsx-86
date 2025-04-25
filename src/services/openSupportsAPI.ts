
import { supabase } from '@/integrations/supabase/client';
import { OPEN_SUPPORTS_CONFIG, API_PATHS } from './openSupportsConfig';
import { Ticket, TicketComment, Department, TicketFilters } from '@/types/ticketTypes';

// Helper function to handle API requests
const apiRequest = async (endpoint: string, method: string, data?: any, token?: string) => {
  const url = `${OPEN_SUPPORTS_CONFIG.API_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OPEN_SUPPORTS_CONFIG.REQUEST_TIMEOUT);
    
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

// Get OpenSupports token for current user
const getOpenSupportsToken = async () => {
  try {
    // Check if we have a valid session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No authenticated session');
    }
    
    // Try to get token from edge function if in production
    try {
      const { data, error } = await supabase.functions.invoke('get-opensupports-token', {
        body: { user_id: session.user.id, email: session.user.email }
      });
      
      if (error) {
        throw new Error(`Failed to get OpenSupports token: ${error.message}`);
      }
      
      return data.token;
    } catch (edgeFunctionError) {
      console.warn('Edge function not available or failed:', edgeFunctionError);
      
      // For development/testing purposes, generate a mock token
      // This allows the app to function without the actual edge function
      console.info('Using mock token for development');
      return `mock_token_${session.user.id}_${Date.now()}`;
    }
  } catch (error) {
    console.error('Error getting OpenSupports token:', error);
    throw error;
  }
};

// Mock API implementation for development/testing
const mockApiImplementation = {
  getTickets: () => {
    return {
      tickets: [
        {
          id: 'mock-1',
          title: 'Test Ticket',
          content: 'This is a test ticket content',
          status: 'open',
          priority: 'medium',
          date: new Date().toISOString(),
          userId: 'current-user',
          userEmail: 'test@example.com',
          departmentId: 1,
          closed: false,
          unread: false
        }
      ],
      page: 1,
      pages: 1
    };
  },
  getTicket: (ticketId: string) => {
    return {
      ticket: {
        id: ticketId,
        title: 'Test Ticket Details',
        content: 'This is a detailed view of the test ticket',
        status: 'open',
        priority: 'medium',
        date: new Date().toISOString(),
        userId: 'current-user',
        userEmail: 'test@example.com',
        departmentId: 1,
        closed: false,
        unread: false
      },
      comments: [
        {
          id: 1,
          content: 'This is a test comment',
          date: new Date().toISOString(),
          authorId: 'staff-1',
          authorName: 'Support Staff',
          authorStaff: true
        }
      ]
    };
  },
  createTicket: (ticket: Partial<Ticket>) => {
    return {
      ticketNumber: `MOCK-${Math.floor(Math.random() * 10000)}`,
      ...ticket
    };
  },
  addComment: (ticketId: string, content: string) => {
    return {
      id: Date.now(),
      ticketId,
      content,
      date: new Date().toISOString()
    };
  },
  changeTicketStatus: (ticketId: string, status: string) => {
    return {
      status: 'success',
      ticketId,
      newStatus: status
    };
  },
  getDepartments: () => {
    return [
      { id: 1, name: 'General Support', private: false },
      { id: 2, name: 'Technical Issues', private: false },
      { id: 3, name: 'Billing', private: false }
    ];
  }
};

// Determine if we should use mock or real API
const useMockApi = () => {
  return OPEN_SUPPORTS_CONFIG.USE_MOCK_API || import.meta.env.DEV;
};

// API functions
export const openSupportsAPI = {
  // User authentication - normally handled by SSO
  // For completeness, included here
  async loginToOpenSupports(email: string, password: string) {
    if (useMockApi()) {
      return { success: true, token: 'mock_token' };
    }
    return await apiRequest(API_PATHS.USER.LOGIN, 'POST', { email, password });
  },
  
  // Ticket operations
  async getTickets(filters: TicketFilters) {
    if (useMockApi()) {
      return mockApiImplementation.getTickets();
    }
    
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.GET_ALL, 'POST', filters, token);
  },
  
  async getTicket(ticketId: string) {
    if (useMockApi()) {
      return mockApiImplementation.getTicket(ticketId);
    }
    
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.GET, 'POST', { ticketId }, token);
  },
  
  async createTicket(ticket: Partial<Ticket>) {
    if (useMockApi()) {
      return mockApiImplementation.createTicket(ticket);
    }
    
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.CREATE, 'POST', ticket, token);
  },
  
  async addComment(ticketId: string, content: string, file?: string) {
    if (useMockApi()) {
      return mockApiImplementation.addComment(ticketId, content);
    }
    
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.COMMENT, 'POST', {
      ticketId,
      content,
      file
    }, token);
  },
  
  async changeTicketStatus(ticketId: string, status: string) {
    if (useMockApi()) {
      return mockApiImplementation.changeTicketStatus(ticketId, status);
    }
    
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.CHANGE_STATUS, 'POST', {
      ticketId,
      status
    }, token);
  },
  
  // System operations
  async getDepartments(): Promise<Department[]> {
    if (useMockApi()) {
      return mockApiImplementation.getDepartments();
    }
    
    const token = await getOpenSupportsToken();
    const response = await apiRequest(API_PATHS.SYSTEM.GET_DEPARTMENTS, 'GET', null, token);
    return response.departments;
  },
};

export default openSupportsAPI;
