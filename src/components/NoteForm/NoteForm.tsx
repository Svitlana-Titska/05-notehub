import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

export interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (values: NoteFormValues) => void;
  submitting?: boolean;
}

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const Schema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500, "Max 500 characters"),
  tag: Yup.mixed<NoteTag>().oneOf(TAGS).required("Tag is required"),
});

const initialValues: NoteFormValues = { title: "", content: "", tag: "Todo" };

export default function NoteForm({
  onCancel,
  onSubmit,
  submitting = false,
}: NoteFormProps) {
  const handleSubmit = (
    values: NoteFormValues,
    helpers: FormikHelpers<NoteFormValues>
  ) => {
    onSubmit(values);
    helpers.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || isSubmitting || submitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
