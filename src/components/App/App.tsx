import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { Note, FetchNotesResponse } from "../../types/note";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import NoteModal from "../NoteModal/NoteModal";
import Pagination from "../Pagination/Pagination";

import styles from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const { data } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    staleTime: 5000,
    placeholderData: (prevData) => prevData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreateNote = (noteData: Omit<Note, "id">) => {
    createMutation.mutate(noteData);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const hasNotes = Array.isArray(data?.results) && data.results.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchBox value={search} onChange={setSearch} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button
          className={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </div>

      {hasNotes ? (
        <NoteList notes={data!.results} onDelete={handleDeleteNote} />
      ) : (
        <p>No notes found.</p>
      )}

      {isModalOpen && (
        <NoteModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateNote}
        />
      )}
    </div>
  );
}
