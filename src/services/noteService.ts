import type { FetchNotesResponse, Note } from "../types/note";

export const fetchNotes = async (
  page: number,
  search = ""
): Promise<FetchNotesResponse> => {
  console.log("📦 Mock fetchNotes called with:", { page, search });

  const allMockNotes: Note[] = Array.from({ length: 30 }, (_, index) => ({
    _id: `mock-id-${index + 1}`,
    title: `Mock Note ${index + 1}`,
    content: `This is the content for note ${index + 1}.`,
    tag: ["Todo", "Work", "Personal", "Meeting", "Shopping"][
      index % 5
    ] as Note["tag"],
  }));

  const filtered = search
    ? allMockNotes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
      )
    : allMockNotes;

  const perPage = 12;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return {
    results: paginated,
    totalPages,
  };
};

export const createNote = async (note: Omit<Note, "_id">): Promise<Note> => {
  console.log("📌 Mock createNote:", note);
  return {
    _id: `mock-id-${Date.now()}`,
    ...note,
  };
};

export const deleteNote = async (id: string): Promise<void> => {
  console.log("🗑️ Mock deleteNote:", id);
};
