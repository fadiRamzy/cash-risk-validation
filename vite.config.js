import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/cash-risk-validation/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});