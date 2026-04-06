import Constants from 'expo-constants';

const getBackendUrl = () => {
  // For production, use your production API URL
  // For development with local server, use machine's local IP instead of localhost
  // Example for local development: 'http://192.168.1.XX:5001/api'
  
  // Try to determine the local IP from expo constants (useful when using physical devices)
  const debuggerHost = Constants.expoConfig?.hostUri;
  const ip = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
  
  return `http://${ip}:5001/api`;
};

export const CONFIG = {
  API_BASE_URL: getBackendUrl(),
  TOKEN_KEY: 'auth_token',
};
