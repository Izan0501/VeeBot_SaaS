import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // Necesario para Docker
    strictPort: true,
    port: 5173,
    // Allow *.localhost subdomains (tenant portals in local dev)
    // e.g. gzstms.localhost:5173 → served by this Vite instance
    allowedHosts: 'all',
    watch: {
      usePolling: true, // <--- ESTO ES LA CLAVE PARA WSL2
    }
  }
})
