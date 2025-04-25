
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
    
    // In a real implementation, you would exchange the Supabase token
    // for an OpenSupports token through a custom API or edge function
    
    // For demo purposes, we'll call a hypothetical edge function
    const { data, error } = await supabase.functions.invoke('get-opensupports-token', {
      body: { user_id: session.user.id, email: session.user.email }
    });
    
    if (error) {
      throw new Error(`Failed to get OpenSupports token: ${error.message}`);
    }
    
    return data.token;
  } catch (error) {
    console.error('Error getting OpenSupports token:', error);
    throw error;
  }
};

// API functions
export const openSupportsAPI = {
  // User authentication - normally handled by SSO
  // For completeness, included here
  async loginToOpenSupports(email: string, password: string) {
    return await apiRequest(API_PATHS.USER.LOGIN, 'POST', { email, password });
  },
  
  // Ticket operations
  async getTickets(filters: TicketFilters) {
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.GET_ALL, 'POST', filters, token);
  },
  
  async getTicket(ticketId: string) {
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.GET, 'POST', { ticketId }, token);
  },
  
  async createTicket(ticket: Partial<Ticket>) {
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.CREATE, 'POST', ticket, token);
  },
  
  async addComment(ticketId: string, content: string, file?: string) {
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.COMMENT, 'POST', {
      ticketId,
      content,
      file
    }, token);
  },
  
  async changeTicketStatus(ticketId: string, status: string) {
    const token = await getOpenSupportsToken();
    return await apiRequest(API_PATHS.TICKET.CHANGE_STATUS, 'POST', {
      ticketId,
      status
    }, token);
  },
  
  // System operations
  async getDepartments(): Promise<Department[]> {
    const token = await getOpenSupportsToken();
    const response = await apiRequest(API_PATHS.SYSTEM.GET_DEPARTMENTS, 'GET', null, token);
    return response.departments;
  },
};

export default openSupportsAPI;
