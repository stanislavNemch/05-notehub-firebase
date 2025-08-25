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
    type QueryConstraint,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import type { NewNotePayload, Note } from "../types/note";

interface FetchNotesParams {
    pageParam?: QueryDocumentSnapshot<DocumentData>;
    searchQuery?: string;
}

// ОБНОВЛЕННАЯ функция для генерации ключевых слов и их префиксов
const generateKeywords = (
    title: string,
    content: string,
    tag: string
): string[] => {
    const keywords = new Set<string>();
    const text = `${title} ${content} ${tag}`.toLowerCase();

    // Разбиваем текст на отдельные слова
    const words = text.split(/[\s,.;!?]+/).filter(Boolean);

    // Для каждого слова генерируем все возможные префиксы
    for (const word of words) {
        for (let i = 1; i <= word.length; i++) {
            keywords.add(word.substring(0, i));
        }
    }

    return Array.from(keywords);
};

export const fetchNotes = async ({
    pageParam,
    searchQuery,
}: FetchNotesParams) => {
    const user = auth.currentUser;
    if (!user) return { notes: [], nextCursor: undefined };

    const notesPerPage = 12;
    const notesCollectionRef = collection(db, "notes");

    const constraints: QueryConstraint[] = [where("userId", "==", user.uid)];

    if (searchQuery && searchQuery.trim() !== "") {
        // ОБНОВЛЕНА логика поиска: ищем по точному совпадению с префиксом в массиве
        const searchTerm = searchQuery.toLowerCase().trim();
        if (searchTerm) {
            constraints.push(
                where("searchableKeywords", "array-contains", searchTerm)
            );
        }
        // ВАЖНО: При поиске сортировка по дате невозможна из-за ограничений Firestore
    } else {
        constraints.push(orderBy("createdAt", "desc"));
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

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const nextCursor =
        querySnapshot.docs.length === notesPerPage ? lastVisible : undefined;

    return { notes, nextCursor };
};

// Функции createNote и updateNote используют обновленную generateKeywords,
// поэтому их код остается прежним, но результат работы будет новым.

export const createNote = async (noteData: NewNotePayload) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authenticated!");

    const keywords = generateKeywords(
        noteData.title,
        noteData.content,
        noteData.tag
    );

    const docRef = await addDoc(collection(db, "notes"), {
        ...noteData,
        searchableKeywords: keywords,
        userId: user.uid,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
};

export const deleteNote = async (noteId: string) => {
    const noteDocRef = doc(db, "notes", noteId);
    await deleteDoc(noteDocRef);
};

export const updateNote = async (noteId: string, noteData: NewNotePayload) => {
    const noteDocRef = doc(db, "notes", noteId);
    const keywords = generateKeywords(
        noteData.title,
        noteData.content,
        noteData.tag
    );
    await updateDoc(noteDocRef, {
        ...noteData,
        searchableKeywords: keywords,
        updatedAt: Timestamp.now(),
    });
};
