import path from 'path';
import { defineConfig } from 'vite';
import { geminiApiPlugin } from './api/gemini';

export default defineConfig({
  plugins: [geminiApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
