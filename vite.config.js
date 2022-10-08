import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as Path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': Path.join(__dirname, 'src'),
    },
  },
})
