import path from 'path';
import { defineConfig } from 'vite';
import { geminiApiPlugin } from './api/gemini';

 codex/create-api-route-for-gemini
export default defineConfig({
  plugins: [geminiApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      test: {
        environment: 'jsdom'
      }
    };
 main
});
