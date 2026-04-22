import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Tailwind + shadcn-токены подключаются одним файлом.
import "./index.css";

import App from "./App";
import { FormDataProvider } from "./context/FormDataContext";

/*
 * Один QueryClient на всё приложение. Используется для двух вещей:
 *  1) Кэш списка категорий (GET /products/category-list) — переиспользование
 *     результата при возврате со step-3 → step-2 (требование ТЗ).
 *  2) Мутация (POST /products/add) на шаге 3 с единой обработкой
 *     isPending/isError/onSuccess.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 минут — данные считаются свежими
      gcTime: 1000 * 60 * 30, // 30 минут — держим в памяти после unmount
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* basename = Vite base (dev: "/", prod на GitHub Pages: "/loan-application-spa/"). */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <FormDataProvider>
          <App />
        </FormDataProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
