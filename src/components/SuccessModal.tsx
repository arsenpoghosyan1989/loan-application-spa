import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName: string;
  lastName: string;
  amount: number;
  term: number;
}

// Финальная модалка. Текст по ТЗ:
// «Поздравляем, <Фамилия> <Имя>. Вам одобрена <сумма> на <срок> дней.»
export default function SuccessModal({
  open,
  onOpenChange,
  firstName,
  lastName,
  amount,
  term,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Заявка одобрена</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-center text-base">
          <p>
            Поздравляем, <strong>{lastName} {firstName}</strong>.
          </p>
          <p className="mt-2">
            Вам одобрена <strong>${amount}</strong> на <strong>{term}</strong> дней.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Отлично</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
