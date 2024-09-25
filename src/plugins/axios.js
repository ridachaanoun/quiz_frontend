import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance
const instance = axios.create({
  baseURL: 'http://localhost:8000/api/', // Adjust as needed
});

// Set default headers if the token is available in cookies
const token = Cookies.get('token');

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Optionally, you can add an interceptor to update the token dynamically
instance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
