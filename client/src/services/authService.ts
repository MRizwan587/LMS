// src/services/authService.ts
import axios, { AxiosError, type AxiosResponse as AxiosResponse } from 'axios';
import type { LoginData as LoginDataType, SignupData as SignupDataType, AuthResponse as AuthResponseType, User as UserType } from '../types/auth';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});


export const login = async (data: LoginDataType): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>('/auth/login', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};

export const signup = async (data: SignupDataType): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>('/auth/signup', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || 'Signup failed');
  }
};

export const logout = () => {
  const navigate = useNavigate();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login');
};

export const verifyOtp = async (email: string, otp: string): Promise<AuthResponseType> => {
  try {
    const response = await api.post<AuthResponseType>('/auth/verify-otp', { email, otp });
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
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data?.message || 'Reset password failed');
  }
};