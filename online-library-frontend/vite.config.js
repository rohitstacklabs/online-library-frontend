import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // 0.0.0.0 ke equivalent, network pe accessible
    port: 5173,        // default Vite port
    strictPort: true,  // agar port busy ho toh error throw kare
  },
})
