import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import linaria from "@wyw-in-js/vite";

export default defineConfig({
  plugins: [react(), linaria()],
  build: {
    outDir: "./dist",
    cssMinify: false,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3300",
      },
    },
  },
});
