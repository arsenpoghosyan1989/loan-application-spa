import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

import Step1Personal from "./pages/Step1Personal";
import Step2Address from "./pages/Step2Address";
import Step3Loan from "./pages/Step3Loan";
import StepIndicator from "./components/StepIndicator";

export default function App() {
  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Заявка на займ</h1>
      <div className="form-card">
        <StepIndicator />
        <Routes>
          <Route path="/" element={<Navigate to="/step-1" replace />} />
          <Route path="/step-1" element={<Step1Personal />} />
          <Route path="/step-2" element={<Step2Address />} />
          <Route path="/step-3" element={<Step3Loan />} />
          <Route path="*" element={<Navigate to="/step-1" replace />} />
        </Routes>
      </div>
    </Container>
  );
}
