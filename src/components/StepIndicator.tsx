import { useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

const STEPS = [
  { path: "/step-1", label: "1. Личные данные" },
  { path: "/step-2", label: "2. Адрес и работа" },
  { path: "/step-3", label: "3. Параметры займа" },
];

// Прогресс-индикатор текущего шага. Подкрашивает пройденные/активный шаги
// с помощью Tailwind-утилит и токенов shadcn (text-primary / text-muted-foreground).
export default function StepIndicator() {
  const { pathname } = useLocation();
  const currentIdx = STEPS.findIndex((s) => s.path === pathname);

  return (
    <ol className="mb-6 flex gap-1 text-xs sm:text-sm">
      {STEPS.map((step, idx) => {
        const isActive = idx === currentIdx;
        const isCompleted = idx < currentIdx;
        return (
          <li
            key={step.path}
            className={cn(
              "flex-1 border-b-2 pb-2 text-center font-medium transition-colors",
              isActive && "border-primary text-primary",
              isCompleted && "border-emerald-500 text-emerald-600",
              !isActive && !isCompleted && "border-border text-muted-foreground",
            )}
          >
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
