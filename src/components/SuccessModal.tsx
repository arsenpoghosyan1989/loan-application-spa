import { Button, Modal } from "react-bootstrap";

interface Props {
  show: boolean;
  firstName: string;
  lastName: string;
  amount: number;
  term: number;
  onClose: () => void;
}

export default function SuccessModal({ show, firstName, lastName, amount, term, onClose }: Props) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Заявка одобрена</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <p className="fs-5 mb-0">
          Поздравляем, <strong>{lastName} {firstName}</strong>.
        </p>
        <p className="fs-5 mt-2">
          Вам одобрена <strong>${amount}</strong> на <strong>{term}</strong> дней.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Отлично
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
