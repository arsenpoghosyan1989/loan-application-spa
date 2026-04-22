import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useFormData } from "@/context/FormDataContext";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FieldError } from "@/components/ui/field-error";

/*
 * Форма 2 — адрес и место работы.
 *
 * Источник опций "Место работы" — dummyjson /products/category-list.
 * Запрос живёт внутри useCategories и кэшируется TanStack Query на уровне
 * QueryClient (staleTime = 10 мин), поэтому при возврате со step-3 → step-2
 * повторного сетевого запроса нет — это и есть "переиспользование результата" по ТЗ.
 */
const schema = z.object({
  workplace: z.string().min(1, "Выберите место работы"),
  address: z.string().trim().min(1, "Введите адрес проживания"),
});

type FormValues = z.infer<typeof schema>;

export default function Step2Address() {
  const navigate = useNavigate();
  const { data, update } = useFormData();
  const { data: categories, isLoading, isError, error, refetch } = useCategories();

  // Страховка от прямого перехода по URL мимо шага 1.
  useEffect(() => {
    if (!data.firstName || !data.lastName || !data.phone || !data.gender) {
      navigate("/step-1", { replace: true });
    }
  }, [data, navigate]);

  const form = useForm({
    defaultValues: {
      workplace: data.workplace,
      address: data.address,
    } satisfies FormValues,
    validators: { onChange: schema },
    onSubmit: ({ value }) => {
      update(value);
      navigate("/step-3");
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">Адрес и место работы</h2>

      <form.Field name="workplace">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Место работы</Label>

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Загрузка списка...
              </div>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertDescription className="flex items-center justify-between gap-3">
                  <span>{(error as Error)?.message ?? "Ошибка загрузки"}</span>
                  <Button size="sm" variant="outline" onClick={() => refetch()} type="button">
                    Повторить
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {categories && (
              <Select
                value={field.state.value || undefined}
                onValueChange={(val) => field.handleChange(val)}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={field.state.meta.errors.length > 0}
                  onBlur={field.handleBlur}
                >
                  <SelectValue placeholder="— Выберите —" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <form.Field name="address">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Адрес проживания</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={() => navigate("/step-1")}>
          Назад
        </Button>
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting || !categories}>
              Далее
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
