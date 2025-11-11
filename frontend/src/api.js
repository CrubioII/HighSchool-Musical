import axios from 'axios';
import { useAuth } from './context/AuthContext.jsx';

// This module exports a configured axios instance. It attaches the JWT
// automatically to outgoing requests via an interceptor.
const api = axios.create();

export function useApi() {
  const { token } = useAuth();
  // Attach the token to the Authorization header before each request
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return api;
}

export default api;