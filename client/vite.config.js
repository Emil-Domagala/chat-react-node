import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import json from '@rollup/plugin-json';
// import { config } from 'dotenv';
// config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), json()],
  //   build: {
  //     outDir: 'dist', // Ensure this is set
  //     sourcemap: false, // No need for sourcemaps in production
  //     minify: 'esbuild', // Uses esbuild for fast minification
  //     rollupOptions: {
  //       output: {
  //         entryFileNames: 'assets/[name].[hash].js',
  //         chunkFileNames: 'assets/[name].[hash].js',
  //         assetFileNames: 'assets/[name].[hash].[ext]',
  //       },
  //     },
  //   },
});
