
// Simple mapping utility to convert frontend ticket status to database status
export const mapFrontendStatusToDb = (status: string): string => {
  switch (status) {
    case 'in-progress':
      return 'wip';
    case 'resolved':
      return 'completed';
    case 'closed':
      return 'completed';
    case 'pending':
      return 'pending';
    case 'open':
    default:
      return 'open';
  }
};

// Map database status to frontend status
export const mapDbStatusToFrontend = (dbStatus: string): string => {
  switch (dbStatus) {
    case 'wip':
      return 'in-progress';
    case 'completed':
      return 'resolved';
    case 'pending':
      return 'pending';
    case 'open':
    default:
      return 'open';
  }
};
