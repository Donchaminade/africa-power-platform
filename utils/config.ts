const productionApiUrl = 'http://your-hostinger-domain.com/api'; // IMPORTANT: Update this with your actual Hostinger domain/subdomain
const developmentApiUrl = 'http://localhost/africa-power-platform/api';

// Vite automatically sets import.meta.env.PROD to true for production builds
export const API_URL = import.meta.env.PROD ? productionApiUrl : developmentApiUrl;
