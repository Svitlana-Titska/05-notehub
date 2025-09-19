import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

const modalRoot = document.getElementById("modal-root");

if (!modalRoot) {
  throw new Error("Modal root element (#modal-root) not found in index.html");
}

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onBackdrop}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
