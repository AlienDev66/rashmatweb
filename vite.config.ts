import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  server: { port: 5173 },
  build: { outDir: "dist", emptyOutDir: true },
});
