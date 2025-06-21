import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map(({ _id, title, content, tag }) => (
        <li className={css.listItem} key={_id}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={`${css.tag} ${css[`tag-${tag.toLowerCase()}`]}`}>
              {tag}
            </span>
            <button className={css.button} onClick={() => mutate(_id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
