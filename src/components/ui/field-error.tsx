import { cn } from "@/lib/utils";

// Компактный компонент ошибки для полей TanStack Form.
// Принимает массив ошибок (field.state.meta.errors) и показывает первую.
interface FieldErrorProps {
  errors: Array<string | { message?: string } | undefined | null>;
  className?: string;
}

export function FieldError({ errors, className }: FieldErrorProps) {
  const first = errors?.find(Boolean);
  if (!first) return null;
  const message = typeof first === "string" ? first : (first.message ?? "Некорректное значение");
  return <p className={cn("text-xs text-destructive mt-1", className)}>{message}</p>;
}
