import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" });

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": `http://localhost:${process.env.PORT}`,
      "/auth": `http://localhost:${process.env.PORT}`,
    },
  },
});
