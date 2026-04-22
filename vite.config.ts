import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tailwind v4 — подключается нативным Vite-плагином (без PostCSS-конфига).
// Alias "@/*" — канонический для shadcn/ui: импорты вида "@/components/ui/button".
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: { port: 5173, open: true },
});
