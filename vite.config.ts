import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    react(),
    // checker({
    //   overlay: { initialIsOpen: false },
    //   typescript: true,
    //   eslint: {
    //     lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
    //   },
    // }),
    viteTsconfigPaths(),
    svgrPlugin(),
  ],
  server: {
    port: 3030,
    // proxy: {
    //   '/api-server/': '...',
    //   '/authorization/': '...',
    // },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
