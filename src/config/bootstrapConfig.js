
// Stages of the bootstrap process
export const bootstrapStages = [
  { 
    name: 'environment', 
    description: 'Loading environment variables and configuration', 
    delay: 100 
  },
  { 
    name: 'libraries', 
    description: 'Initializing core libraries and dependencies', 
    delay: 200 
  },
  { 
    name: 'configuration', 
    description: 'Setting up application configuration', 
    delay: 300 
  },
  { 
    name: 'services', 
    description: 'Connecting to services and APIs', 
    delay: 500 
  },
  { 
    name: 'components', 
    description: 'Preparing React components', 
    delay: 400 
  },
  { 
    name: 'complete', 
    description: 'Finalizing application startup', 
    delay: 200 
  }
];

// Bootstrap configuration settings
export const bootstrapConfig = {
  defaultTimeout: 10000,
  minimalModeUrl: '/?mode=minimal',
  defaultFallback: null,
  debugEnabled: process.env.NODE_ENV === 'development'
};
