import { defineConfig } from "vite";

// base: "./" so the built site also works when opened directly as a static file
// (file://) or hosted from any subpath — not just the dev server root.
export default defineConfig({
  base: "./",
  server: { port: 5174, host: "127.0.0.1", strictPort: false },
  build: { target: "es2022", outDir: "dist", cssCodeSplit: false },
});