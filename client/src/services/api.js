import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    signup: (data) => apiClient.post('/auth/signup', data),
    login: (data) => apiClient.post('/auth/login', data),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    changePassword: (data) => apiClient.post('/auth/change-password', data),
};

// Loans API calls
export const loansAPI = {
    getAll: () => apiClient.get('/loans'),
    getById: (id) => apiClient.get(`/loans/${id}`),
    create: (data) => apiClient.post('/loans', data),
    update: (id, data) => apiClient.put(`/loans/${id}`, data),
    delete: (id) => apiClient.delete(`/loans/${id}`),
    makePayment: (id, data) => apiClient.post(`/loans/${id}/pay`, data),
    simulatePayment: (id, data) => apiClient.post(`/loans/${id}/simulate`, data),
    getAmortization: (id) => apiClient.get(`/loans/${id}/amortization`),
    getDashboard: () => apiClient.get('/loans/analytics/dashboard'),
};

export default apiClient;
