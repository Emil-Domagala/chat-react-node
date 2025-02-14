import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// import { config } from 'dotenv';
// config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
 
  ],

  build: {
    outDir: 'dist', // Ensure this is set
    sourcemap: true, // No need for sourcemaps in production
    minify: 'esbuild', // Uses esbuild for fast minification
  },
});
