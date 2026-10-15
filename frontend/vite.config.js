import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `npm run dev` proxies the API to the FastAPI backend; `npm run build` produces dist/ which FastAPI serves.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy: { "/api": { target: "http://localhost:8501", changeOrigin: true } } },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: { react: ["react", "react-dom"], motion: ["motion"], map: ["leaflet"], charts: ["recharts"] },
      },
    },
  },
});
