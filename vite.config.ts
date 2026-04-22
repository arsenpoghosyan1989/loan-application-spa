import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tailwind v4 — подключается нативным Vite-плагином (без PostCSS-конфига).
// Alias "@/*" — канонический для shadcn/ui: импорты вида "@/components/ui/button".
//
// base — публичный префикс URL. В production деплое на GitHub Pages сайт
// живёт по адресу https://<user>.github.io/loan-application-spa/, поэтому все
// ассеты должны грузиться из подпапки. В dev-режиме оставляем "/".
const base = process.env.NODE_ENV === "production" ? "/loan-application-spa/" : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: { port: 5173, open: true },
});
