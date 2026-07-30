import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ Attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('fitaix_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle errors safely
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error) => {
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message ||
      'API error';

    console.error('API ERROR:', errorMessage);

    if (error?.response?.status === 401) {
      localStorage.removeItem('fitaix_token');
    }

    return Promise.reject(errorMessage);
  }
);