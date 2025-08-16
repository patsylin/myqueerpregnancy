import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../server/.env" });
}

const PORT = process.env.PORT || 8080;

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": `http://localhost:${PORT}`,
    },
  },
});
