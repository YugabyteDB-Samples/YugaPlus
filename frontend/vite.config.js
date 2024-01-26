import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Need this for running in Docker container
    port: 3000,
    proxy: {
      "/api": {
        target: "http://yugaplus-backend:8080", // Targets backend docker container
        // target: "http://localhost:8080", // Targets backend running locally
        changeOrigin: true,
      },
    },
  },
});
