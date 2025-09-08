import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Check if token is valid JWT format (xxx.yyy.zzz)
                if (token.split('.').length !== 3) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return config;
                }
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Invalid token format:', error);
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 Request:', config.method?.toUpperCase(), config.url, config.data);
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
            // Clear invalid token
            localStorage.removeItem('token');
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;