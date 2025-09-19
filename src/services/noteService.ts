import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;

if (!token) {
  console.warn("Missing VITE_NOTEHUB_TOKEN. Set it in your environment.");
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  data: Note[];
}

type ApiNotesResponseV1 = {
  page?: number;
  perPage?: number;
  totalPages?: number;
  totalItems?: number;
  data?: Note[];
};
type ApiNotesResponseV2 = {
  totalPages?: number;
  notes?: Note[];
};

type AnyApiNotesResponse = ApiNotesResponseV1 | ApiNotesResponseV2;

function normalizeNotesResponse(
  raw: AnyApiNotesResponse,
  fallback: { page: number; perPage: number }
): FetchNotesResponse {
  const list: Note[] =
    (Array.isArray((raw as ApiNotesResponseV1).data) &&
      (raw as ApiNotesResponseV1).data!) ||
    (Array.isArray((raw as ApiNotesResponseV2).notes) &&
      (raw as ApiNotesResponseV2).notes!) ||
    [];

  const page = (raw as ApiNotesResponseV1).page ?? fallback.page;
  const perPage = (raw as ApiNotesResponseV1).perPage ?? fallback.perPage;
  const totalPages =
    (raw as ApiNotesResponseV1).totalPages ??
    (raw as ApiNotesResponseV2).totalPages ??
    1;

  const totalItems =
    (raw as ApiNotesResponseV1).totalItems ??
    (totalPages > 0 ? totalPages * perPage : list.length);

  return { page, perPage, totalPages, totalItems, data: list };
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const url = `${API_BASE_URL}/notes`;
  const res = await axios.get<AnyApiNotesResponse>(url, {
    params: { page, perPage, search: search || undefined },
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return normalizeNotesResponse(res.data, { page, perPage });
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const url = `${API_BASE_URL}/notes`;
  const res = await axios.post<Note>(url, payload, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const url = `${API_BASE_URL}/notes/${id}`;
  const res = await axios.delete<Note>(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
