export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";

export const API_ENDPOINTS = {
  tenants: `${API_BASE_URL}/api/tenants`,
  settings: `${API_BASE_URL}/api/settings`,
  customers: `${API_BASE_URL}/api/customers`,
  parts: `${API_BASE_URL}/api/parts`,
  jobs: `${API_BASE_URL}/api/jobs`,
  invoices: `${API_BASE_URL}/api/invoices`,
  activities: `${API_BASE_URL}/api/activities`,
  login: `${API_BASE_URL}/api/users/login`,
};
