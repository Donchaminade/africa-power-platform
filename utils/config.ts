const productionApiUrl = 'http://your-hostinger-domain.com/api'; // IMPORTANT: Update this with your actual Hostinger domain/subdomain
const developmentApiUrl = 'http://localhost/africa-power-platform/api';

// Use hostname to determine environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = isDevelopment ? developmentApiUrl : productionApiUrl;