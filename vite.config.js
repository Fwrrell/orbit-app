import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA": JSON.stringify(
      process.env.VERCEL_GIT_COMMIT_SHA
    ),
    "import.meta.env.VITE_VERCEL_GIT_REPO_OWNER": JSON.stringify(
      process.env.VERCEL_GIT_REPO_OWNER
    ),
    "import.meta.env.VITE_VERCEL_GIT_REPO_SLUG": JSON.stringify(
      process.env.VERCEL_GIT_REPO_SLUG
    ),
  },
});
