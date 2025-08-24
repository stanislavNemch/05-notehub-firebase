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
    type QueryConstraint, // ВАЖЛИВО: імпортуємо тип для умов запиту
} from "firebase/firestore";
import { db, auth } from "../firebase";
import type { NewNotePayload, Note } from "../types/note";

// Інтерфейс для параметрів функції
interface FetchNotesParams {
    pageParam?: QueryDocumentSnapshot<DocumentData>; // Курсор для пагінації
    searchQuery?: string;
}

// Функція для отримання нотаток з пагінацією та пошуком
export const fetchNotes = async ({
    pageParam,
    searchQuery,
}: FetchNotesParams) => {
    const user = auth.currentUser;
    if (!user) {
        // Якщо користувач не увійшов, повертаємо порожній результат
        return { notes: [], nextCursor: undefined };
    }

    const notesPerPage = 12;
    const notesCollectionRef = collection(db, "notes");

    // ВИПРАВЛЕННЯ: Явно вказуємо тип масиву для умов запиту
    const constraints: QueryConstraint[] = [
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
    ];

    // Додаємо умову пошуку, якщо вона є
    if (searchQuery) {
        constraints.push(where("title", ">=", searchQuery));
        constraints.push(where("title", "<=", searchQuery + "\uf8ff"));
    }

    // Додаємо курсор для пагінації, якщо він переданий
    if (pageParam) {
        constraints.push(startAfter(pageParam));
    }

    // Додаємо ліміт на кількість записів
    constraints.push(limit(notesPerPage));

    // Створюємо фінальний запит, передаючи масив умов
    const q = query(notesCollectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Note[];

    // Останній документ на сторінці буде нашим "курсором" для наступної
    const nextCursor = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { notes, nextCursor };
};

// Функція створення нотатки
export const createNote = async (noteData: NewNotePayload) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authenticated!");

    const docRef = await addDoc(collection(db, "notes"), {
        ...noteData,
        userId: user.uid,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
};

// Функція видалення нотатки
export const deleteNote = async (noteId: string) => {
    const noteDocRef = doc(db, "notes", noteId);
    await deleteDoc(noteDocRef);
};

// Функція оновлення нотатки
export const updateNote = async (noteId: string, noteData: NewNotePayload) => {
    const noteDocRef = doc(db, "notes", noteId);
    await updateDoc(noteDocRef, {
        ...noteData,
        updatedAt: Timestamp.now(), // Додамо час оновлення
    });
};
