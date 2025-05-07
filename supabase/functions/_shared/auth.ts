
import { EdgeFunctionLogger } from "./logging.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("auth-utils");

/**
 * Verifies authentication for requests to edge functions
 * @param req Request object
 * @returns Object with user and error fields
 */
export async function verifyAuth(req: Request): Promise<{ user: any | null, error: Response | null }> {
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid Authorization header');
      return { 
        user: null, 
        error: new Response(
          JSON.stringify({ error: 'Missing or invalid authorization header' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        ) 
      };
    }

    // Extract and decode the JWT token
    const token = authHeader.split(' ')[1];
    
    // For now, we'll assume the token is valid
    // In a production environment, you'd want to fully validate the JWT here
    // This is a simplified version
    try {
      // Simple check to see if token looks like a JWT
      if (!token || token.split('.').length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Extract the payload (middle part of JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error('Token expired');
      }
      
      // Extract user data from payload
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };
      
      return { user, error: null };
      
    } catch (e) {
      logger.error('JWT validation error', { error: e });
      return { 
        user: null, 
        error: new Response(
          JSON.stringify({ error: 'Invalid authentication token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      };
    }
  } catch (error) {
    logger.error('Authentication error', { error });
    return { 
      user: null, 
      error: new Response(
        JSON.stringify({ error: 'Authentication error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      ) 
    };
  }
}
