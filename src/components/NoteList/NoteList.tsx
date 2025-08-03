import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li className={css.listItem} key={id}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={`${css.tag} ${css[`tag-${tag.toLowerCase()}`]}`}>
              {tag}
            </span>
            {/* Відключаємо кнопку під час виконання мутації, щоб запобігти дублюванню запитів */}
            <button
              className={css.button}
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
