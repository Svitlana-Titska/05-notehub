import { useFormik } from "formik";
import * as Yup from "yup";
import type { Note } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
  onSubmit: (note: Omit<Note, "_id">) => void;
}

type NewNote = {
  title: string;
  content: string;
  tag: Note["tag"];
};

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onClose, onSubmit }: NoteFormProps) {
  const formik = useFormik<NewNote>({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <span className={css.error}>{formik.errors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content}
        />
        {formik.touched.content && formik.errors.content && (
          <span className={css.error}>{formik.errors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag && (
          <span className={css.error}>{formik.errors.tag}</span>
        )}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={!(formik.isValid && formik.dirty)}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
