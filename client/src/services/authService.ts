// src/services/authService.ts
import axios, { AxiosError } from 'axios';
import type { LoginData as LoginDataType, SignupData as SignupDataType, AuthResponse as AuthResponseType } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

// On 401, clear auth and let caller handle redirect if needed
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

function setAuthFromResponse(data: { token?: string; user?: unknown }) {
  if (data.token) localStorage.setItem('token', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
}

export const login = async (data: LoginDataType): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>('/auth/login', data);
    setAuthFromResponse(response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};

export const signup = async (data: SignupDataType): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>('/auth/signup', data);
    if (response.data.token != null && response.data.user != null) {
      setAuthFromResponse(response.data);
    }
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || 'Signup failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const verifyOtp = async (email: string, otp: string): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>('/auth/verify-otp', { email, otp });
    setAuthFromResponse(response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || 'Verify OTP failed');
  }
};

export const regenerateOtp = async (email: string): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>('/auth/regenerate-otp', { email });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || 'Resend OTP failed');
  }
};

export const resetPassword = async (email: string, password: string): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>('/auth/reset-password', { email, password });
    setAuthFromResponse(response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || 'Reset password failed');
  }
};