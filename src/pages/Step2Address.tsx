import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useFormData } from "../context/FormDataContext";
import { useCategories } from "../hooks/useCategories";

const schema = z.object({
  workplace: z.string().min(1, "Выберите место работы"),
  address: z.string().trim().min(1, "Введите адрес проживания"),
});

type FormValues = z.infer<typeof schema>;

export default function Step2Address() {
  const navigate = useNavigate();
  const { data, update } = useFormData();
  const { data: categories, isLoading, isError, error, refetch } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { workplace: data.workplace, address: data.address },
    mode: "onTouched",
  });

  // Страховка: если шаг 1 не пройден, возвращаем пользователя назад.
  useEffect(() => {
    if (!data.firstName || !data.lastName || !data.phone || !data.gender) {
      navigate("/step-1", { replace: true });
    }
  }, [data, navigate]);

  // Когда категории догрузились, повторно синхронизируем уже сохранённое значение
  // workplace (если пользователь возвращается со step-3).
  useEffect(() => {
    if (categories && data.workplace) {
      reset({ workplace: data.workplace, address: data.address });
    }
  }, [categories, data.workplace, data.address, reset]);

  const onSubmit = (values: FormValues) => {
    update(values);
    navigate("/step-3");
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-3">Адрес и место работы</h4>

      <Form.Group className="mb-3" controlId="workplace">
        <Form.Label>Место работы</Form.Label>
        {isLoading && (
          <div className="d-flex align-items-center gap-2 text-muted">
            <Spinner animation="border" size="sm" /> Загрузка списка...
          </div>
        )}
        {isError && (
          <Alert variant="danger" className="py-2">
            {(error as Error)?.message ?? "Ошибка загрузки"}{" "}
            <Button size="sm" variant="link" onClick={() => refetch()}>
              Повторить
            </Button>
          </Alert>
        )}
        {categories && (
          <>
            <Form.Select isInvalid={!!errors.workplace} {...register("workplace")} defaultValue={data.workplace}>
              <option value="">— Выберите —</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.workplace?.message}</Form.Control.Feedback>
          </>
        )}
      </Form.Group>

      <Form.Group className="mb-4" controlId="address">
        <Form.Label>Адрес проживания</Form.Label>
        <Form.Control
          type="text"
          isInvalid={!!errors.address}
          {...register("address")}
        />
        <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={() => navigate("/step-1")}>
          Назад
        </Button>
        <Button type="submit" variant="primary" disabled={!categories}>
          Далее
        </Button>
      </div>
    </Form>
  );
}
