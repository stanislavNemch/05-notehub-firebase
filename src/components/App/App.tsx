// src/components/App/App.tsx
import { useState, useEffect } from "react";
import {
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";
import { onAuthStateChanged, type User, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { auth } from "../../firebase";
import {
    fetchNotes,
    createNote,
    deleteNote,
    updateNote,
} from "../../services/noteService";
import type { NewNotePayload, Note } from "../../types/note";

import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import AuthForm from "../AuthForm/AuthForm";
import SearchBox from "../SearchBox/SearchBox";

import css from "./App.module.css";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 500);

    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isNotesLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["notes", user?.uid, debouncedSearch],
        queryFn: ({ pageParam }) =>
            fetchNotes({ pageParam, searchQuery: debouncedSearch }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: undefined,
        enabled: !!user,
    });
    const notes = data?.pages.flatMap((page) => page.notes) ?? [];

    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notes", user?.uid, debouncedSearch],
            });
            toast.success("Note created successfully!");
            closeModal();
        },
        onError: (err) => toast.error(`Failed to create note: ${err.message}`),
    });

    const updateNoteMutation = useMutation({
        mutationFn: (variables: { noteId: string; noteData: NewNotePayload }) =>
            updateNote(variables.noteId, variables.noteData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notes", user?.uid, debouncedSearch],
            });
            toast.success("Note updated successfully!");
            closeModal();
        },
        onError: (err) => toast.error(`Failed to update note: ${err.message}`),
    });

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notes", user?.uid, debouncedSearch],
            });
            toast.success("Note deleted successfully!");
        },
        onError: (err) => toast.error(`Failed to delete note: ${err.message}`),
    });

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("You have successfully logged out!");
        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
    };

    const handleEdit = (note: Note) => {
        setEditingNote(note);
        openModal();
    };

    const handleCreateOrUpdateNote = (values: NewNotePayload) => {
        if (editingNote) {
            updateNoteMutation.mutate({
                noteId: editingNote.id,
                noteData: values,
            });
        } else {
            const titleExists = notes.some(
                (note) =>
                    note.title.toLowerCase() === values.title.toLowerCase()
            );
            if (titleExists) {
                toast.error("A note with this title already exists!");
                return;
            }
            createNoteMutation.mutate(values);
        }
    };

    if (isAuthLoading) return <Loader text="Checking user session..." />;
    if (!user) return <AuthForm />;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <div className={css.userInfo}>
                    <p>Welcome, {user.email}</p>
                    <button onClick={handleLogout} className={css.buttonLogout}>
                        Logout
                    </button>
                </div>
                <SearchBox value={searchQuery} onChange={setSearchQuery} />
                <button className={css.button} onClick={openModal}>
                    Create note +
                </button>
            </header>

            <main>
                {isNotesLoading && <Loader />}
                {isError && <ErrorMessage message={error.message} />}
                {notes.length > 0 && (
                    <NoteList
                        notes={notes}
                        onDelete={deleteNoteMutation.mutate}
                        onEdit={handleEdit}
                    />
                )}
                {notes.length === 0 && !isNotesLoading && (
                    <p style={{ textAlign: "center" }}>
                        No notes yet. Create one!
                    </p>
                )}
                {hasNextPage && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    >
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className={css.button}
                        >
                            {isFetchingNextPage
                                ? "Loading more..."
                                : "Load More"}
                        </button>
                    </div>
                )}
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <NoteForm
                    onSubmit={handleCreateOrUpdateNote}
                    onCancel={closeModal}
                    isSubmitting={
                        createNoteMutation.isPending ||
                        updateNoteMutation.isPending
                    }
                    initialData={
                        editingNote
                            ? {
                                  title: editingNote.title,
                                  content: editingNote.content,
                                  tag: editingNote.tag,
                              }
                            : undefined
                    }
                />
            </Modal>
        </div>
    );
};

export default App;
