import axios from "axios";
import type { Note, FetchNotesResponse } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async (
  search: string,
  page: number
): Promise<FetchNotesResponse> => {
  const params: Record<string, any> = {
    page,
    perPage: 12,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  const response = await axiosInstance.get<FetchNotesResponse>("", { params });

  return response.data;
};

export const createNote = async (data: {
  title: string;
  content: string;
  tag: Note["tag"];
}): Promise<Note> => {
  const response = await axiosInstance.post("", data);
  return response.data;
};

export const deleteNote = async (_id: string): Promise<void> => {
  await axiosInstance.delete(`/${_id}`);
};
