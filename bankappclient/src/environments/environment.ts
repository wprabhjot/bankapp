export const environment = {
  production: false,

  // Base backend URL (Spring Boot)
  apiBaseUrl: 'http://localhost:8080',

  // API version prefix
  apiVersion: '/api/v2',

  // Full API root (used by services)
  apiUrl: 'http://localhost:8080/api/v2',

  // Auth endpoint (outside api/v2 in your backend)
  authUrl: 'http://localhost:8080/authenticate'
};
