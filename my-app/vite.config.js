import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // expect() や describe() を global で使えるようにする（任意）
    setupFiles: './src/test/setup.js', // jest-dom の読み込み（後述）
  },
});
