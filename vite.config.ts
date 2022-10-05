import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 3000,
  },
  base: process.env.NODE_ENV === 'production' ? '/snake-game/' : "/",
})
