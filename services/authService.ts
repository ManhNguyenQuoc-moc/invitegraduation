import apiClient from './apiClient';

export const authService = {
  login: (data: any) => {
    return apiClient.post('/auth/login', data);
  },
  register: (data: any) => {
    return apiClient.post('/auth/register', data);
  },
  getProfile: () => {
    return apiClient.get('/auth/me');
  }
};
