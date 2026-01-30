// admin/config.ts
const productionApiUrl = 'http://your-hostinger-domain.com/api'; // IMPORTANT: Update this with your actual production domain
const developmentApiUrl = 'http://localhost/africa-power-platform/api';

// This logic assumes you are using Vite and its environment variables.
const isDevelopment = import.meta.env.DEV;

export const API_URL = isDevelopment ? developmentApiUrl : productionApiUrl;
