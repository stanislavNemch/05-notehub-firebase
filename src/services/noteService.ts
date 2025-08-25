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

/**
 * Генерує масив ключових слів та їх префіксів для повнотекстового пошуку.
 * Це необхідно для обходу обмежень Firestore, який не підтримує нативний пошук по підрядку.
 * Ми створюємо всі можливі префікси для кожного слова в тексті нотатки.
 * @param {string} title - Заголовок нотатки.
 * @param {string} content - Вміст нотатки.
 * @param {string} tag - Тег нотатки.
 * @returns {string[]} Масив унікальних ключових слів.
 */
const generateKeywords = (
    title: string,
    content: string,
    tag: string
): string[] => {
    const keywords = new Set<string>();
    const text = `${title} ${content} ${tag}`.toLowerCase();

    // Розбиваємо текст на окремі слова
    const words = text.split(/[\s,.;!?]+/).filter(Boolean);

    // Для кожного слова генеруємо всі можливі префікси
    for (const word of words) {
        for (let i = 1; i <= word.length; i++) {
            keywords.add(word.substring(0, i));
        }
    }

    return Array.from(keywords);
};

/**
 * Завантажує порцію нотаток для поточного користувача з Firestore.
 * Підтримує пагінацію (нескінченне прокручування) та пошук.
 * @param {FetchNotesParams} params - Параметри для завантаження, включаючи курсор пагінації та пошуковий запит.
 * @returns {Promise<{notes: Note[], nextCursor: QueryDocumentSnapshot<DocumentData> | undefined}>} Об'єкт з масивом нотаток та курсором для наступної сторінки.
 */
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
        // шукаємо по точному співпадінню з префіксом в масиві
        const searchTerm = searchQuery.toLowerCase().trim();
        if (searchTerm) {
            constraints.push(
                where("searchableKeywords", "array-contains", searchTerm)
            );
        }
        // При пошуку сортування за датою неможливе через обмеження Firestore
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

/**
 * Створює нову нотатку в Firestore для поточного користувача.
 * @param {NewNotePayload} noteData - Дані для нової нотатки.
 * @returns {Promise<string>} ID створеного документа.
 */
export const createNote = async (noteData: NewNotePayload) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Користувач не автентифікований!");

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

/**
 * Видаляє нотатку з Firestore за її ID.
 * @param {string} noteId - ID нотатки, яку потрібно видалити.
 */
export const deleteNote = async (noteId: string) => {
    const noteDocRef = doc(db, "notes", noteId);
    await deleteDoc(noteDocRef);
};

/**
 * Оновлює існуючу нотатку в Firestore.
 * @param {string} noteId - ID нотатки, яку потрібно оновити.
 * @param {NewNotePayload} noteData - Нові дані для нотатки.
 */
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
