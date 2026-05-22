import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  envPrefix: ["VITE_", "REACT_APP_"],
  resolve: {
    alias: {
      "@data": path.resolve(__dirname, "src/@eclipse/engine/data"),
      "@eclipse": path.resolve(__dirname, "src/@eclipse"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
  },
});
