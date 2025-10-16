const config = {
  API_URL: import.meta.env.VITE_API_URL,
};

if (!import.meta.env.VITE_API_URL) {
  console.warn('API_URL not configured, using default');
}

export default config;
