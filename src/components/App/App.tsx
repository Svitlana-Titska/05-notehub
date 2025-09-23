import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";

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

  const totalPages = notesQuery.data?.totalPages ?? 0;
  const totalItems = notesQuery.data?.totalItems ?? 0;
  const hasNotes = (notesQuery.data?.data?.length ?? 0) > 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <div className={`${css.container} ${css.toolbarInner}`}>
          <div className={css.left}>
            <SearchBox value={search} onChange={setSearch} />
          </div>

          <div className={css.center}>
            {totalPages > 1 && (
              <Pagination
                pageCount={totalPages}
                currentPage={page}
                onPageChange={(p) => setPage(p)}
              />
            )}
          </div>

          <div className={css.right}>
            <button
              className={css.button}
              onClick={() => setIsModalOpen(true)}
              title="Create a new note"
            >
              Create note +
            </button>
          </div>
        </div>
      </header>

      <div className={css.container}>
        {notesQuery.isPending && <p style={{ padding: 16 }}>Loading...</p>}

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

        {!notesQuery.isPending && totalItems === 0 && (
          <p style={{ padding: 16, opacity: 0.8 }}>
            You have no notes yet. Click <b>Create note +</b> to add your first
            one.
          </p>
        )}

        {hasNotes && <NoteList notes={notesQuery.data!.data} />}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {/* NoteForm сам викликає useMutation(createNote) і робить invalidate */}
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
