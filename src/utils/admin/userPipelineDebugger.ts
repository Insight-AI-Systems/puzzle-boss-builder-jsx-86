
import { UserProfile } from '@/types/userTypes';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Utility to help debug and diagnose issues with the user data pipeline
 */
export const userPipelineDebugger = {
  /**
   * Log current state of user loading
   */
  logUserLoadingState: (
    source: string, 
    users: UserProfile[] | null | undefined, 
    loading: boolean, 
    error: Error | null | undefined
  ) => {
    debugLog(
      'UserPipelineDebug', 
      `[${source}] User loading state`, 
      DebugLevel.INFO,
      {
        usersLoaded: !!users,
        userCount: users?.length || 0,
        isLoading: loading,
        hasError: !!error,
        errorMessage: error?.message,
        timestamp: new Date().toISOString()
      }
    );
    
    // Log some sample user data for debugging if available
    if (users && users.length > 0) {
      const sampleUser = { ...users[0] };
      // Remove sensitive fields
      delete (sampleUser as any).email;
      debugLog(
        'UserPipelineDebug', 
        `[${source}] Sample user data`, 
        DebugLevel.INFO,
        {
          sampleUser,
          roleDistribution: countRoles(users)
        }
      );
    }
  },

  /**
   * Log data transformation issues
   */
  logDataTransformation: (
    source: string,
    inputData: any,
    outputData: any,
    transformationName: string
  ) => {
    debugLog(
      'UserPipelineDebug', 
      `[${source}] Data transformation: ${transformationName}`, 
      DebugLevel.INFO,
      {
        inputSize: Array.isArray(inputData) ? inputData.length : 'not array',
        outputSize: Array.isArray(outputData) ? outputData.length : 'not array',
        timestamp: new Date().toISOString()
      }
    );
  },

  /**
   * Log filter operations
   */
  logFilterOperation: (
    source: string,
    inputCount: number,
    outputCount: number,
    filterCriteria: any
  ) => {
    debugLog(
      'UserPipelineDebug', 
      `[${source}] Filter operation`, 
      DebugLevel.INFO,
      {
        inputCount,
        outputCount,
        filterCriteria,
        reduction: `${inputCount - outputCount} users filtered out`,
        timestamp: new Date().toISOString()
      }
    );
  },

  /**
   * Log API calls
   */
  logApiCall: (
    source: string,
    endpoint: string,
    startTime: number,
    endTime: number,
    success: boolean,
    errorMessage?: string
  ) => {
    const duration = endTime - startTime;
    
    debugLog(
      'UserPipelineDebug', 
      `[${source}] API call to ${endpoint}`, 
      success ? DebugLevel.INFO : DebugLevel.ERROR,
      {
        duration: `${duration}ms`,
        success,
        errorMessage,
        timestamp: new Date().toISOString()
      }
    );
  }
};

/**
 * Helper function to count roles in a user array
 */
function countRoles(users: UserProfile[]): Record<string, number> {
  const roleCounts: Record<string, number> = {};
  
  users.forEach(user => {
    roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
  });
  
  return roleCounts;
}
