import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useFormData } from "@/context/FormDataContext";
import { addProduct } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SuccessModal from "@/components/SuccessModal";

/*
 * Форма 3 — параметры займа.
 *
 * - Два Radix-слайдера (через shadcn): сумма $200–$1000 шаг $100, срок 10–30 дней шаг 1.
 * - Submit делает POST https://dummyjson.com/products/add с телом
 *   { title: `${firstName} ${lastName}` } через TanStack Query useMutation
 *   (единая обработка isPending / isError / onSuccess).
 * - На onSuccess показывается модалка shadcn Dialog с поздравлением.
 */
const AMOUNT = { min: 200, max: 1000, step: 100 } as const;
const TERM = { min: 10, max: 30, step: 1 } as const;

const schema = z.object({
  amount: z.number().min(AMOUNT.min).max(AMOUNT.max),
  term: z.number().min(TERM.min).max(TERM.max),
});

type FormValues = z.infer<typeof schema>;

export default function Step3Loan() {
  const navigate = useNavigate();
  const { data, update, reset } = useFormData();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!data.workplace || !data.address) {
      navigate("/step-2", { replace: true });
    }
  }, [data, navigate]);

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => setShowModal(true),
  });

  const form = useForm({
    defaultValues: {
      amount: data.amount,
      term: data.term,
    } satisfies FormValues,
    validators: { onChange: schema },
    onSubmit: ({ value }) => {
      update(value);
      mutation.mutate({ title: `${data.firstName} ${data.lastName}` });
    },
  });

  const handleClose = () => {
    setShowModal(false);
    reset();
    navigate("/step-1", { replace: true });
  };

  return (
    <>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <h2 className="text-xl font-semibold">Параметры займа</h2>

        <form.Field name="amount">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>Сумма займа</Label>
                <span className="text-sm font-semibold text-primary">${field.state.value}</span>
              </div>
              <Slider
                id={field.name}
                min={AMOUNT.min}
                max={AMOUNT.max}
                step={AMOUNT.step}
                value={[field.state.value]}
                onValueChange={(v) => field.handleChange(v[0] ?? AMOUNT.min)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${AMOUNT.min}</span>
                <span>${AMOUNT.max}</span>
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="term">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>Срок займа</Label>
                <span className="text-sm font-semibold text-primary">
                  {field.state.value} дн.
                </span>
              </div>
              <Slider
                id={field.name}
                min={TERM.min}
                max={TERM.max}
                step={TERM.step}
                value={[field.state.value]}
                onValueChange={(v) => field.handleChange(v[0] ?? TERM.min)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{TERM.min} дн.</span>
                <span>{TERM.max} дн.</span>
              </div>
            </div>
          )}
        </form.Field>

        {mutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {(mutation.error as Error)?.message ?? "Ошибка отправки"}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/step-2")}
            disabled={mutation.isPending}
          >
            Назад
          </Button>
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting || mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Подать заявку"
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>

      <SuccessModal
        open={showModal}
        onOpenChange={(open) => (open ? setShowModal(true) : handleClose())}
        firstName={data.firstName}
        lastName={data.lastName}
        amount={form.state.values.amount}
        term={form.state.values.term}
      />
    </>
  );
}
