const productionApiUrl = 'https://app.africapowerplatform.com/api'; // IMPORTANT: Update this with your actual Hostinger domain/subdomain
const developmentApiUrl = 'http://localhost/africa-power-platform/api';

const productionBaseUrl = 'https://app.africapowerplatform.com/';
const developmentBaseUrl = 'http://localhost/africa-power-platform/';


// Use hostname to determine environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_URL = isDevelopment ? developmentApiUrl : productionApiUrl;
export const BASE_URL = isDevelopment ? developmentBaseUrl : productionBaseUrl;
export const UPLOADS_URL = `${BASE_URL}public`;