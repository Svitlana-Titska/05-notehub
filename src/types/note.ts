export interface Note {
  _id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
