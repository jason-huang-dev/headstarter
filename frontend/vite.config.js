import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// load .env file from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    port: 5173,
    open: true,
    cors: {
      origin: '*', // Allow all origins
      methods: '*',
      allowedHeaders: '*',
    },
  },
});