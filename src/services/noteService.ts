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
        // Сначала сортируем по полю фильтра (Firestore requirement), затем по дате
        constraints.push(where("title", ">=", searchQuery));
        constraints.push(where("title", "<=", searchQuery + "\uf8ff"));
        constraints.push(orderBy("title"));
        constraints.push(orderBy("createdAt", "desc"));
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

export const deleteNote = async (noteId: string) => {
    const noteDocRef = doc(db, "notes", noteId);
    await deleteDoc(noteDocRef);
};

export const updateNote = async (noteId: string, noteData: NewNotePayload) => {
    const noteDocRef = doc(db, "notes", noteId);
    await updateDoc(noteDocRef, {
        ...noteData,
        updatedAt: Timestamp.now(),
    });
};
