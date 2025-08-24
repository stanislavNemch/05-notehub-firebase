export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

// Оновлений інтерфейс для роботи з Firestore
export interface Note {
    id: string; // Firestore використовує 'id'
    title: string;
    content: string;
    tag: NoteTag;
    userId: string; // Для прив'язки нотатки до користувача
}

// Цей тип використовується для створення нових нотаток, де id ще немає
export interface NewNotePayload {
    title: string;
    content: string;
    tag: NoteTag;
}
