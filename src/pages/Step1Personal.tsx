import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button } from "react-bootstrap";
import { IMaskInput } from "react-imask";
import { useNavigate } from "react-router-dom";

import { useFormData } from "../context/FormDataContext";

// react-hook-form + zod + @hookform/resolvers:
//   - react-hook-form: производительные неконтролируемые формы, мало ре-рендеров.
//   - zod: декларативные схемы валидации + вывод TS-типа из схемы (единый источник правды).
//   - @hookform/resolvers: мост между zod-схемой и react-hook-form.
// react-imask: готовое решение для маски ввода телефона (0XXX XXX XXX).
const schema = z.object({
  // Маска даёт строку "0XXX XXX XXX" — проверяем итоговый формат регуляркой.
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    // Подставляем уже введённые значения, чтобы при возврате "Назад" форма
    // восстанавливалась из общего состояния.
    defaultValues: {
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: (data.gender || undefined) as FormValues["gender"],
    },
    mode: "onTouched",
  });

  const onSubmit = (values: FormValues) => {
    update(values);
    navigate("/step-2");
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-3">Личные данные</h4>

      <Form.Group className="mb-3" controlId="phone">
        <Form.Label>Телефон</Form.Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <IMaskInput
              mask="0000 000 000"
              type="tel"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="0XXX XXX XXX"
              value={field.value ?? ""}
              onAccept={(val: string) => field.onChange(val)}
              onBlur={field.onBlur}
              inputRef={field.ref}
            />
          )}
        />
        {errors.phone && <div className="invalid-feedback d-block">{errors.phone.message}</div>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="firstName">
        <Form.Label>Имя</Form.Label>
        <Form.Control
          type="text"
          isInvalid={!!errors.firstName}
          {...register("firstName")}
        />
        <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="lastName">
        <Form.Label>Фамилия</Form.Label>
        <Form.Control
          type="text"
          isInvalid={!!errors.lastName}
          {...register("lastName")}
        />
        <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4" controlId="gender">
        <Form.Label>Пол</Form.Label>
        <Form.Select isInvalid={!!errors.gender} {...register("gender")} defaultValue={data.gender}>
          <option value="">— Выберите —</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.gender?.message}</Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button type="submit" variant="primary">
          Далее
        </Button>
      </div>
    </Form>
  );
}
