import { useQuery } from "@tanstack/react-query";
import { fetchCategoryList, type ProductCategory } from "../api/products";

// TanStack Query кэширует результат по ключу ["categories"] на всё время жизни
// QueryClient. При возврате с шага 3 на шаг 2 запрос не повторяется (staleTime=10m).
// Это и есть "переиспользование результата", требуемое по ТЗ.
export function useCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: ["categories"],
    queryFn: fetchCategoryList,
  });
}
