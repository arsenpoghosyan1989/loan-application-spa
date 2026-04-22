import { useLocation } from "react-router-dom";

const STEPS = [
  { path: "/step-1", label: "1. Личные данные" },
  { path: "/step-2", label: "2. Адрес и работа" },
  { path: "/step-3", label: "3. Параметры займа" },
];

export default function StepIndicator() {
  const { pathname } = useLocation();
  const currentIdx = STEPS.findIndex((s) => s.path === pathname);

  return (
    <div className="step-indicator">
      {STEPS.map((step, idx) => {
        const cls = idx === currentIdx ? "step active" : idx < currentIdx ? "step completed" : "step";
        return (
          <div key={step.path} className={cls}>
            {step.label}
          </div>
        );
      })}
    </div>
  );
}
