import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Канонический хелпер shadcn/ui: объединяет классы и разрешает конфликты
// Tailwind-утилит (`px-2` + `px-4` → `px-4`).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
