import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  // In production, API calls go to the deployed backend URL
  define: {
    __API_URL__: JSON.stringify(
      mode === 'production' ? (process.env.VITE_API_URL || '') : ''
    )
  }
}));
