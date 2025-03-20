import axios from 'axios';

const api = axios.create({
  baseURL: 'https://landing-page-gere.onrender.com', // Replace with your backend Render link
});

export default api;

