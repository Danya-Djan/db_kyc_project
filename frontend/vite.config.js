import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './dist',
  },
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    plugins: [
      react({
        include: '**/*.{ts,js,jsx,tsx}',
      }),
    ]
  }
});
