// Define all available environments
export type Environment = 'dev' | 'staging' | 'prod';

// Configuration for each environment
export const environments = {
  dev: {
    baseUrl: 'https://dev-opensource-demo.orangehrmlive.com/',
    apiUrl: 'https://dev-api.orangehrmlive.com/',
    credentials: {
      admin: { username: 'Admin', password: 'dev_admin123' }
      
    }
  },
  staging: {
    baseUrl: 'https://staging-opensource-demo.orangehrmlive.com/',
    apiUrl: 'https://staging-api.orangehrmlive.com/',
    credentials: {
      admin: { username: 'Admin', password: 'staging_admin123' }
    }
  },
  prod: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com/',
    apiUrl: 'https://api.orangehrmlive.com/',
    credentials: {
      admin: { username: 'Admin', password: 'admin123' }}
    }
};