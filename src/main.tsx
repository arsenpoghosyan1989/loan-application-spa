import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Bootstrap CSS — для базовой стилизации (ТЗ разрешает Bootstrap)
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App";
import { FormDataProvider } from "./context/FormDataContext";

// Один экземпляр QueryClient на всё приложение.
// Используется для кэширования списка категорий (Форма 2),
// чтобы не перезапрашивать его при возврате на шаг назад.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 минут — данные считаются свежими
      gcTime: 1000 * 60 * 30, // 30 минут — хранение в памяти
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FormDataProvider>
          <App />
        </FormDataProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
