import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    allowedHosts: ["learntrack.0xarchit.is-a.dev", "db.0xarchit.is-a.dev"],
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
