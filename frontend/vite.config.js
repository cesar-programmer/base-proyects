import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto permite que el servidor acepte conexiones externas
    port: 5173, // Puerto predeterminado para Vite
    strictPort: true, // Garantiza que se use este puerto o falle si no está disponible
    watch: {
      usePolling: true, // Recomendado cuando trabajas con sistemas de archivos compartidos (e.g., Docker volumes)
    },
  },
});
