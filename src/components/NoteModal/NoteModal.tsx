import { useEffect } from "react";
import { createPortal } from "react-dom";
import NoteForm from "../NoteForm/NoteForm";
import type { Note } from "../../types/note";
import css from "./NoteModal.module.css";

interface NoteModalProps {
  onClose: () => void;
  onSubmit: (note: Omit<Note, "_id">) => void;
}

export default function NoteModal({ onClose, onSubmit }: NoteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <NoteForm onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>,
    document.body
  );
}
