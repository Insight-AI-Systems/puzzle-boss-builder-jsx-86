
// Database status is restricted to these specific values
export type DbStatus = 'wip' | 'completed' | 'deferred';

// Simple mapping utility to convert frontend ticket status to database status
export const mapFrontendStatusToDb = (status: string): DbStatus => {
  switch (status) {
    case 'in-progress':
      return 'wip';
    case 'resolved':
    case 'closed':
      return 'completed';
    case 'pending':
      return 'deferred';
    case 'open':
    default:
      return 'wip';
  }
};

// Map database status to frontend status
export const mapDbStatusToFrontend = (dbStatus: string): string => {
  switch (dbStatus) {
    case 'wip':
      return 'in-progress';
    case 'completed':
      return 'resolved';
    case 'deferred':
      return 'pending';
    default:
      return 'open';
  }
};
