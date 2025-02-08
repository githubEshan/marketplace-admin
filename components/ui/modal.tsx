"use client";

//good practice
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

//defining the interface
// prop is a wa
interface ModalProps {
  // Prop should hold string as the title and description
  title: string;
  description: string;
  isOpen: boolean;
  //when onClose return void
  onClose: () => void;
  //? indicates it being optional
  children?: React.ReactNode;
}

//React.FC = react. Function component to specify props that a function component will accept
//

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
