/**
 * Global app configuration
 * Use this file for frontend constants
 */

export const AppConfig = {
  appName: 'Bank Management System',
  defaultPageSize: 10,             // For tables / lists
  supportedRoles: ['ROLE_MANAGER', 'ROLE_CLERK'],
  currencySymbol: '₹',
  dateFormat: 'dd/MM/yyyy HH:mm',  // For displaying dates
  // API endpoints can also be added here if needed
  apiEndpoints: {
    accounts: '/accounts',
    transactions: '/transactions',
    approvals: '/approvals',
    users: '/users',
    auth: '/authenticate'
  }
};
