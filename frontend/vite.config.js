import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.REACT_APP_RUNTIME_ENVIRONMENT === "docker" ? true : false,
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.REACT_APP_PROXY_URL || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
