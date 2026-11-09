// vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      test: {
        globals: true, // Optional: if you want global APIs like 'expect'
        environment: 'jsdom', // Recommended for React component testing
      },
    });