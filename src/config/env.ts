/** Change this to your product name; it is shown on the sign-in screens. */
export const APP_NAME = 'ERP Platform';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'https://erp-backend-updated.onrender.com/api';
