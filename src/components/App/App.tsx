import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import NoteModal from "../NoteModal/NoteModal";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    staleTime: 5000,
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

  const handleCreateNote = (note: Omit<Note, "_id">) => {
    createMutation.mutate(note);
  };

  const handleDeleteNote = (_id: string) => {
    deleteMutation.mutate(_id);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.container}>
      <header className={css.header}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes.</p>}

      {!isLoading && !isError && data && (
        <>
          {data.notes.length === 0 ? (
            <p>No notes found.</p>
          ) : (
            <NoteList notes={data.notes} onDelete={handleDeleteNote} />
          )}
        </>
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
