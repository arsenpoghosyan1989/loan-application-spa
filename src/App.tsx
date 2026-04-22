import { Navigate, Route, Routes } from "react-router-dom";

import Step1Personal from "@/pages/Step1Personal";
import Step2Address from "@/pages/Step2Address";
import Step3Loan from "@/pages/Step3Loan";
import StepIndicator from "@/components/StepIndicator";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight">Заявка на займ</h1>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <StepIndicator />
          <Routes>
            <Route path="/" element={<Navigate to="/step-1" replace />} />
            <Route path="/step-1" element={<Step1Personal />} />
            <Route path="/step-2" element={<Step2Address />} />
            <Route path="/step-3" element={<Step3Loan />} />
            <Route path="*" element={<Navigate to="/step-1" replace />} />
          </Routes>
        </CardContent>
      </Card>
    </div>
  );
}
