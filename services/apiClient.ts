import axios from 'axios';

// Khởi tạo instance Axios
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor Request: Tự động đính kèm Token JWT
apiClient.interceptors.request.use(
  (config) => {
    // Chỉ chạy trên Client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Xử lý lỗi tập trung
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Logic xử lý khi token hết hạn (ví dụ: đăng xuất, clear localStorage)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
