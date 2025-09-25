import axios from 'axios';

// For development, we'll use the backend URL directly
const BACKEND_URL = 'http://localhost:8080';
const API_URL = `${BACKEND_URL}/api`;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Add interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: (loginRequest) => 
    api.post('/auth/login', loginRequest),
    
  register: (registerRequest) => {
    console.log('Sending registration request to:', API_URL + '/auth/register');
    console.log('With data:', registerRequest);
    return api.post('/auth/register', registerRequest);
  },
    
  getCurrentUser: () => 
    api.get('/user/me'),
};

// User profile services
export const userService = {
  getProfile: () => 
    api.get('/user/profile'),
    
  updateProfile: (userData) => 
    api.put('/user/profile', userData),
    
  changePassword: (passwordData) => 
    api.post('/user/change-password', passwordData),
};

// Income services
export const incomeService = {
  getAll: () => 
    api.get('/income'),
    
  getById: (id) => 
    api.get(`/income/${id}`),
    
  create: (income) => 
    api.post('/income', income),
    
  update: (id, income) => 
    api.put(`/income/${id}`, income),
    
  delete: (id) => 
    api.delete(`/income/${id}`),
    
  getByDateRange: (dateRange) => 
    api.post('/income/date-range', dateRange),
};

// Expense services
export const expenseService = {
  getAll: () => 
    api.get('/expense'),
    
  getById: (id) => 
    api.get(`/expense/${id}`),
    
  create: (expense) => 
    api.post('/expense', expense),
    
  update: (id, expense) => 
    api.put(`/expense/${id}`, expense),
    
  delete: (id) => 
    api.delete(`/expense/${id}`),
    
  getByDateRange: (dateRange) => 
    api.post('/expense/date-range', dateRange),
};

// Dashboard services
export const dashboardService = {
  getDashboard: () => 
    api.get('/dashboard'),
    
  getDashboardByDateRange: (dateRange) => 
    api.post('/dashboard/date-range', dateRange),
};

// Categories services
export const categoryService = {
  getCategories: () => 
    api.get('/utils/categories'),
};

export default api;