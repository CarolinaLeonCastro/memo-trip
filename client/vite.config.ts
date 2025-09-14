import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    chunkSizeWarningLimit: 800,
  },
  // Optimisation développement
  server: {
    hmr: {
      overlay: false, // Réduit la consommation
    },
  },
});
