import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { IMaskInput } from "react-imask";
import { useNavigate } from "react-router-dom";

import { useFormData } from "@/context/FormDataContext";
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
import { FieldError } from "@/components/ui/field-error";

/*
 * Форма 1 — личные данные.
 *
 * Стек конкретного шага:
 *   - @tanstack/react-form: headless-формы от TanStack, хорошо типизируются
 *     и интегрируются с React Query (обе библиотеки от одной команды).
 *   - zod: единая схема валидации + вывод TS-типов через z.infer.
 *   - react-imask: маска телефона 0XXX XXX XXX (готовое решение).
 *   - shadcn/ui + Tailwind: визуальный слой.
 *
 * Валидатор zod подключается декларативно через `validators: { onChange: schema }`.
 * TanStack Form сам прогонит схему при каждом изменении и положит ошибки
 * в `field.state.meta.errors`.
 */
const schema = z.object({
  // IMask отдаёт итоговую строку вида "0XXX XXX XXX" — проверяем регуляркой.
  phone: z
    .string()
    .min(1, "Введите телефон")
    .regex(/^0\d{3} \d{3} \d{3}$/, "Формат: 0XXX XXX XXX"),
  firstName: z.string().trim().min(1, "Введите имя"),
  lastName: z.string().trim().min(1, "Введите фамилию"),
  gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Выберите пол" }) }),
});

type FormValues = z.infer<typeof schema>;

export default function Step1Personal() {
  const navigate = useNavigate();
  const { data, update } = useFormData();

  // Расширенный тип формы: gender может быть "" до первого выбора пользователя.
  type InternalValues = Omit<FormValues, "gender"> & { gender: FormValues["gender"] | "" };

  const form = useForm({
    // Значения берутся из общего контекста — при возврате "Назад" форма восстанавливается.
    defaultValues: {
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
    } as InternalValues,
    validators: { onChange: schema },
    onSubmit: ({ value }) => {
      update(value as FormValues);
      navigate("/step-2");
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
      <h2 className="text-xl font-semibold">Личные данные</h2>

      <form.Field name="phone">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Телефон</Label>
            <IMaskInput
              id={field.name}
              name={field.name}
              mask="0000 000 000"
              type="tel"
              placeholder="0XXX XXX XXX"
              value={field.state.value ?? ""}
              onAccept={(val: string) => field.handleChange(val)}
              onBlur={field.handleBlur}
              aria-invalid={field.state.meta.errors.length > 0}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20"
            />
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <form.Field name="firstName">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Имя</Label>
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

      <form.Field name="lastName">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Фамилия</Label>
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

      <form.Field name="gender">
        {(field) => (
          <div className="space-y-1.5">
            <Label htmlFor={field.name}>Пол</Label>
            <Select
              value={field.state.value || undefined}
              onValueChange={(val) => field.handleChange(val as FormValues["gender"])}
            >
              <SelectTrigger
                id={field.name}
                aria-invalid={field.state.meta.errors.length > 0}
                onBlur={field.handleBlur}
              >
                <SelectValue placeholder="— Выберите —" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Мужской</SelectItem>
                <SelectItem value="female">Женский</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <div className="flex justify-end pt-2">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              Далее
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
