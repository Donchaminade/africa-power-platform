// Lit les variables d'environnement fournies par Vite
// En développement, elles viendront de .env.local
// En production (sur Vercel), elles devront être configurées dans les paramètres du projet.
export const API_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// L'URL des uploads est construite à partir de l'URL de base
export const UPLOADS_URL = `${BASE_URL}public`;