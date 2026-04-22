import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ApplicationData } from "../types";

// Контекст хранит данные всех трёх форм. Все три шага читают/обновляют
// этот объект, поэтому значения сохраняются при переходах назад/вперёд.
interface FormDataContextValue {
  data: ApplicationData;
  update: (patch: Partial<ApplicationData>) => void;
  reset: () => void;
}

const DEFAULT_DATA: ApplicationData = {
  phone: "",
  firstName: "",
  lastName: "",
  gender: "",
  workplace: "",
  address: "",
  amount: 200,
  term: 10,
};

const FormDataContext = createContext<FormDataContextValue | null>(null);

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ApplicationData>(DEFAULT_DATA);

  const update = useCallback((patch: Partial<ApplicationData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setData(DEFAULT_DATA), []);

  const value = useMemo(() => ({ data, update, reset }), [data, update, reset]);

  return <FormDataContext.Provider value={value}>{children}</FormDataContext.Provider>;
}

export function useFormData() {
  const ctx = useContext(FormDataContext);
  if (!ctx) throw new Error("useFormData must be used inside FormDataProvider");
  return ctx;
}
