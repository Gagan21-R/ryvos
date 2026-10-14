import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `npm run dev` proxies the API to the FastAPI backend; `npm run build` produces dist/ which FastAPI serves.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": { target: "http://localhost:8501", changeOrigin: true } } },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: { react: ["react", "react-dom"], map: ["leaflet"], charts: ["recharts"] },
      },
    },
  },
});
