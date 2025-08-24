import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    Timestamp,
    limit,
    startAfter,
    updateDoc,
    type QueryDocumentSnapshot,
    type DocumentData,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import type { NewNotePayload, Note } from "../types/note";

interface FetchNotesParams {
    pageParam?: QueryDocumentSnapshot<DocumentData>;
    searchQuery?: string;
}

// Функція для отримання нотаток з пагінацією та пошуком
export const fetchNotes = async ({
    pageParam,
    searchQuery,
}: FetchNotesParams) => {
    const user = auth.currentUser;
    if (!user) return { notes: [], nextCursor: undefined };

    const notesPerPage = 12;
    const notesCollectionRef = collection(db, "notes");

    // Збираємо умови для запиту
    const constraints = [
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
    ];

    if (searchQuery) {
        // Firestore може робити пошук тільки по повному збігу або по префіксу
        constraints.push(where("title", ">=", searchQuery));
        constraints.push(where("title", "<=", searchQuery + "\uf8ff"));
    }

    if (pageParam) {
        constraints.push(startAfter(pageParam));
    }

    constraints.push(limit(notesPerPage));

    const q = query(notesCollectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Note[];

    const nextCursor = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { notes, nextCursor };
};

// Функція створення нотатки (без змін)
export const createNote = async (noteData: NewNotePayload) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated!");
    }
    const docRef = await addDoc(collection(db, "notes"), {
        ...noteData,
        userId: user.uid,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
};

// Функція видалення нотатки (без змін)
export const deleteNote = async (noteId: string) => {
    const noteDocRef = doc(db, "notes", noteId);
    await deleteDoc(noteDocRef);
};

// НОВА ФУНКЦІЯ: оновлення нотатки
export const updateNote = async (noteId: string, noteData: NewNotePayload) => {
    const noteDocRef = doc(db, "notes", noteId);
    await updateDoc(noteDocRef, {
        ...noteData,
        updatedAt: Timestamp.now(), // Додамо час оновлення
    });
};
