import axios from 'axios';

const baseURL = import.meta.env.PROD
    ? 'https://cookie-heaven-api.onrender.com/api'
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
