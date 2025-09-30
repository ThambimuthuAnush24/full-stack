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

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('API Error interceptor:', error);
    
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.log('Error data:', error.response.data);
      console.log('Error status:', error.response.status);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login if needed
        console.log('Unauthorized access, clearing token');
        localStorage.removeItem('token');
        // We could redirect to login here if needed
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.log('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: (loginRequest) => {
    console.log('Sending login request to:', API_URL + '/auth/login');
    console.log('With credentials:', { username: loginRequest.username, password: '******' });
    
    return api.post('/auth/login', loginRequest)
      .then(response => {
        // Log successful response
        console.log('Login success response structure:', response);
        
        // Check if the expected data is there
        if (!response.data) {
          console.error('Warning: Login response is missing data!');
        } else if (!response.data.token) {
          console.error('Warning: Login response is missing token!', response.data);
          // Try to extract useful information
          console.log('Response data keys:', Object.keys(response.data));
        } else {
          // Validate response structure
          console.log('Token received:', response.data.token.substring(0, 20) + '...');
          console.log('User data:', {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role
          });
        }
        
        return response;
      })
      .catch(error => {
        // Enhanced error logging
        console.error('Login API error:', error);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        
        // Try with a direct fetch call as a diagnostic
        console.log('Trying direct fetch as diagnostic...');
        fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginRequest)
        }).then(res => {
          console.log('Diagnostic fetch status:', res.status);
          return res.text();
        }).then(text => {
          console.log('Diagnostic fetch response:', text);
        }).catch(fetchError => {
          console.error('Diagnostic fetch error:', fetchError);
        });
        
        throw error;
      });
  },
    
  register: (registerRequest) => {
    console.log('Sending registration request to:', API_URL + '/auth/register');
    console.log('With data:', { ...registerRequest, password: '******' });
    return api.post('/auth/register', registerRequest)
      .catch(error => {
        // Enhanced error logging
        console.error('Register API error:', error.response || error);
        throw error;
      });
  },
    
  getCurrentUser: () => {
    console.log('Getting current user info');
    
    // First, try with the /me endpoint on auth controller
    return api.get('/auth/me')
      .catch(error => {
        console.error('Get current user error with /auth/me:', error);
        
        // If that fails, try the user controller endpoint as fallback
        return api.get('/user/me')
          .catch(secondError => {
            console.error('Get current user error with /user/me:', secondError);
            throw secondError;
          });
      });
  },
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