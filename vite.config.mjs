import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // same port react-scripts used
  },
  build: {
    outDir: "build", // same output folder react-scripts used
  },
});
