import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = env.PORT || "3001";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: ["terminal.local"],
      watch: {
        // The admin is a separate Next.js app. Its generated HTML changes while
        // Next compiles and must not trigger reloads in the public Vite app.
        ignored: [
          "**/admin/.next/**",
          "**/admin/node_modules/**",
          "**/.ssr/**",
          "**/dist/**",
        ],
      },
      proxy: {
        "/api": `http://127.0.0.1:${apiPort}`,
        "/download-brochure/file": `http://127.0.0.1:${apiPort}`,
      },
    },
    build: { chunkSizeWarningLimit: 900 },
  };
});
