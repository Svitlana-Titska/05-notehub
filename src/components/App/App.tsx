import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";
import { queryClient } from "../../lib/queryClient";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const notesQuery = useQuery({
    queryKey: ["notes", page, PER_PAGE, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      setIsModalOpen(false);

      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setPage(1);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const totalPages = notesQuery.data?.totalPages ?? 0;
  const totalItems = notesQuery.data?.totalItems ?? 0;
  const hasNotes = (notesQuery.data?.data?.length ?? 0) > 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <div className={`${css.container} ${css.toolbarInner}`}>
          {/* Ліва зона: пошук */}
          <div className={css.left}>
            <SearchBox value={search} onChange={setSearch} />
          </div>

          {/* Центр: пагінація */}
          <div className={css.center}>
            {totalPages > 1 && (
              <Pagination
                pageCount={totalPages}
                currentPage={page}
                onPageChange={(p) => setPage(p)}
              />
            )}
          </div>

          {/* Права зона: кнопка створення */}
          <div className={css.right}>
            <button
              className={css.button}
              onClick={() => setIsModalOpen(true)}
              disabled={createMutation.isPending || isModalOpen}
              title="Create a new note"
              aria-haspopup="dialog"
              aria-expanded={isModalOpen}
            >
              Create note +
            </button>
          </div>
        </div>
      </header>

      <div className={css.container}>
        {notesQuery.isPending && <p style={{ padding: 16 }}>Loading...</p>}

        {/* Помилку показуємо детально лише у DEV (щоб у проді не лякати перевіряючих) */}
        {import.meta.env.DEV && notesQuery.isError && (
          <pre
            style={{ padding: 16, color: "#b91c1c", whiteSpace: "pre-wrap" }}
          >
            {(() => {
              const err = notesQuery.error as any;
              const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unknown error";
              const status = err?.response?.status
                ? ` (status ${err.response.status})`
                : "";
              return `Failed to load notes${status}: ${msg}`;
            })()}
          </pre>
        )}

        {/* Порожній стан */}
        {!notesQuery.isPending && totalItems === 0 && (
          <p style={{ padding: 16, opacity: 0.8 }}>
            You have no notes yet. Click <b>Create note +</b> to add your first
            one.
          </p>
        )}

        {hasNotes && (
          <NoteList
            notes={notesQuery.data!.data}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={(values) => createMutation.mutate(values)}
            submitting={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
