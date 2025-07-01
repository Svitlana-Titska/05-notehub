import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  search: string,
  page: number
): Promise<FetchNotesResponse> => {
  const params = {
    page,
    perPage: 12,
    ...(search.trim() && { search: search.trim() }),
  };

  try {
    const response = await axiosInstance.get<FetchNotesResponse>("", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    throw error;
  }
};

export const createNote = async (note: CreateNoteInput): Promise<Note> => {
  const response = await axiosInstance.post<Note, { data: Note }>("", note);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axiosInstance.delete<Note, { data: Note }>(`/${id}`);
  return response.data;
};
