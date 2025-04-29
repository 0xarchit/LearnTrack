import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "*",
        changeOrigin: true,
      },
      "/uploads": {
        target: "*",
        changeOrigin: true,
      },
    },
    allowedHosts: ["learntrack.0xarchit.is-a.dev", "db.0xarchit.is-a.dev"],
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
