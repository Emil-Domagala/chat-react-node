import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import json from '@rollup/plugin-json';
// import { config } from 'dotenv';
// config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), json()],
  json: {
    namedExports: true,
    stringify: true, // Ensures JSON files are handled as strings
  },
  build: {
    outDir: 'dist', // Ensure this is set
    sourcemap: true, // No need for sourcemaps in production
    minify: 'esbuild', // Uses esbuild for fast minification
  },
});
