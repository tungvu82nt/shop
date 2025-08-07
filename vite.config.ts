import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': process.env,
  },
  esbuild: {
    // Đảm bảo React được xử lý đúng cách
    jsxInject: `import React from 'react'`,
  },
});
