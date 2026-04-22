import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useFormData } from "../context/FormDataContext";
import { addProduct } from "../api/products";
import SuccessModal from "../components/SuccessModal";

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    // valueAsNumber — чтобы значения из range-инпутов приходили как числа.
    defaultValues: { amount: data.amount, term: data.term },
  });

  const amount = watch("amount");
  const term = watch("term");

  useEffect(() => {
    if (!data.workplace || !data.address) {
      navigate("/step-2", { replace: true });
    }
  }, [data, navigate]);

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => setShowModal(true),
  });

  const onSubmit = (values: FormValues) => {
    update(values);
    mutation.mutate({ title: `${data.firstName} ${data.lastName}` });
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
    navigate("/step-1", { replace: true });
  };

  return (
    <>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <h4 className="mb-3">Параметры займа</h4>

        <Form.Group className="mb-4" controlId="amount">
          <Form.Label>
            Сумма займа: <span className="range-value">${amount}</span>
          </Form.Label>
          <Form.Range
            min={AMOUNT.min}
            max={AMOUNT.max}
            step={AMOUNT.step}
            {...register("amount", { valueAsNumber: true })}
          />
          <div className="d-flex justify-content-between text-muted small">
            <span>${AMOUNT.min}</span>
            <span>${AMOUNT.max}</span>
          </div>
          {errors.amount && <div className="invalid-feedback d-block">{errors.amount.message}</div>}
        </Form.Group>

        <Form.Group className="mb-4" controlId="term">
          <Form.Label>
            Срок займа: <span className="range-value">{term} дн.</span>
          </Form.Label>
          <Form.Range
            min={TERM.min}
            max={TERM.max}
            step={TERM.step}
            {...register("term", { valueAsNumber: true })}
          />
          <div className="d-flex justify-content-between text-muted small">
            <span>{TERM.min} дн.</span>
            <span>{TERM.max} дн.</span>
          </div>
          {errors.term && <div className="invalid-feedback d-block">{errors.term.message}</div>}
        </Form.Group>

        {mutation.isError && (
          <Alert variant="danger" className="py-2">
            {(mutation.error as Error)?.message ?? "Ошибка отправки"}
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="outline-secondary" onClick={() => navigate("/step-2")} disabled={mutation.isPending}>
            Назад
          </Button>
          <Button type="submit" variant="success" disabled={mutation.isPending}>
            {mutation.isPending ? "Отправка..." : "Подать заявку"}
          </Button>
        </div>
      </Form>

      <SuccessModal
        show={showModal}
        firstName={data.firstName}
        lastName={data.lastName}
        amount={amount}
        term={term}
        onClose={handleClose}
      />
    </>
  );
}
