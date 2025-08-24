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
    endBefore,
    QueryDocumentSnapshot,
    type DocumentData,
    limitToLast,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import type { NewNotePayload, Note } from "../types/note";

interface FetchNotesParams {
    direction: "next" | "prev" | "initial";
    cursor?: QueryDocumentSnapshot<DocumentData>;
    searchQuery?: string;
}

export const fetchNotes = async ({
    direction,
    cursor,
    searchQuery,
}: FetchNotesParams) => {
    const user = auth.currentUser;
    if (!user) return { notes: [], newCursor: null };

    const notesCollectionRef = collection(db, "notes");
    let q;

    const constraints = [
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
    ];

    // Логіка для пошуку
    if (searchQuery) {
        constraints.push(where("title", ">=", searchQuery));
        constraints.push(where("title", "<=", searchQuery + "\uf8ff"));
    }

    // Логіка для пагінації
    const notesPerPage = 12;
    if (direction === "next" && cursor) {
        constraints.push(startAfter(cursor));
        constraints.push(limit(notesPerPage));
    } else if (direction === "prev" && cursor) {
        constraints.push(endBefore(cursor));
        constraints.push(limitToLast(notesPerPage));
    } else {
        constraints.push(limit(notesPerPage));
    }

    q = query(notesCollectionRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Note[];

    return {
        notes,
        newCursor: querySnapshot.docs[querySnapshot.docs.length - 1],
        firstCursor: querySnapshot.docs[0],
    };
};

export const createNote = async (noteData: NewNotePayload) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User is not authenticated!");
    }

    // Додаємо новий документ у колекцію 'notes'
    const docRef = await addDoc(collection(db, "notes"), {
        ...noteData,
        userId: user.uid, // Прив'язуємо нотатку до ID користувача
        createdAt: Timestamp.now(), // Додаємо мітку часу для сортування
    });
    return docRef.id;
};

export const deleteNote = async (noteId: string) => {
    // Отримуємо посилання на конкретний документ за його ID
    const noteDocRef = doc(db, "notes", noteId);
    // Видаляємо документ
    await deleteDoc(noteDocRef);
};
