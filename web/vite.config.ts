import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import linaria from "@wyw-in-js/vite";

export default defineConfig({
  plugins: [react(), linaria()],
  build: {
    outDir: "./dist",
    cssMinify: true, // Use default CSS minification
    rollupOptions: {
      output: {
        // Better chunking for caching
        manualChunks: (id: string) => {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router")) {
            return "vendor";
          }
          if (id.includes("node_modules/@codemirror") || id.includes("node_modules/@uiw/react-codemirror")) {
            return "codemirror";
          }
          if (id.includes("node_modules/@mdx-js") || id.includes("node_modules/remark-gfm")) {
            return "mdx";
          }
          return undefined;
        },
      },
    },
    // Enable gzip compression for better SEO performance
    minify: "esbuild",
    sourcemap: false, // Disable in production for better performance
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3300",
      },
    },
    // Enable HMR for better development experience
    hmr: {
      overlay: true,
    },
  },
  // SEO-related optimizations
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "@mdx-js/mdx",
      "@mdx-js/react",
      "axios",
    ],
  },
});
