import { environments, Environment } from './environments';

// Get environment from command line or environment variable, default to 'prod'
const getEnvironment = (): Environment => {
  // Check for environment variable
  const envVar = process.env.TEST_ENV as Environment;
  if (envVar && ['dev', 'staging', 'prod'].includes(envVar)) {
    return envVar;
  }
  
  // Default to prod
  return 'prod';
};

// Current active environment
const activeEnv = getEnvironment();
console.log(`Running tests against ${activeEnv} environment`);

// Export the configuration for the active environment
export const testConfig = environments[activeEnv];