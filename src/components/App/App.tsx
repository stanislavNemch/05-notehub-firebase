import { useState, useEffect, useCallback } from "react";
import {
    useQueryClient,
    useMutation,
    useInfiniteQuery,
    type InfiniteData,
} from "@tanstack/react-query";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import toast from "react-hot-toast";
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
type FetchNotesResult = Awaited<ReturnType<typeof fetchNotes>>;
type PageParam = FetchNotesResult["nextCursor"];

import css from "./App.module.css";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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
    } = useInfiniteQuery<
        FetchNotesResult,
        Error,
        InfiniteData<FetchNotesResult>,
        [string, string | undefined, string],
        PageParam
    >({
        queryKey: ["notes", user?.uid, searchQuery],
        queryFn: ({ pageParam }) =>
            fetchNotes({ pageParam, searchQuery: searchQuery }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: undefined as PageParam,
        enabled: !!user,
        refetchOnMount: "always",
    });

    const squashToFirstPage = useCallback(() => {
        if (!user?.uid) return;
        const key: [string, string | undefined, string] = [
            "notes",
            user.uid,
            searchQuery,
        ];
        queryClient.setQueryData<InfiniteData<FetchNotesResult>>(key, (old) => {
            if (!old) return old;
            return {
                pages: old.pages.slice(0, 1),
                pageParams: old.pageParams.slice(0, 1),
            };
        });
    }, [user?.uid, searchQuery, queryClient]);

    useEffect(() => {
        if (!user?.uid) return;
        squashToFirstPage();
        queryClient.invalidateQueries({
            queryKey: ["notes", user.uid],
            exact: false,
        });
    }, [user?.uid, queryClient, squashToFirstPage]);

    const notes: Note[] = data?.pages.flatMap((page) => page.notes) ?? [];

    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            squashToFirstPage();
            queryClient.invalidateQueries({
                queryKey: ["notes", user?.uid, searchQuery],
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
            squashToFirstPage();
            queryClient.invalidateQueries({
                queryKey: ["notes", user?.uid, searchQuery],
            });
            toast.success("Note updated successfully!");
            closeModal();
        },
        onError: (err) => toast.error(`Failed to update note: ${err.message}`),
    });

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            squashToFirstPage();
            queryClient.invalidateQueries({
                queryKey: ["notes", user?.uid, searchQuery],
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

    const handleDelete = (noteId: string) => {
        deleteNoteMutation.mutate(noteId);
    };

    const handleCreateOrUpdateNote = (values: NewNotePayload) => {
        if (editingNote) {
            const titleExists = notes.some(
                (note) =>
                    note.id !== editingNote.id &&
                    note.title.toLowerCase() === values.title.toLowerCase()
            );
            if (titleExists) {
                toast.error("A note with this title already exists!");
                return;
            }
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
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                )}
                {notes.length === 0 && !isNotesLoading && (
                    <p style={{ textAlign: "center" }}>
                        No notes yet. Create one!
                    </p>
                )}
                {hasNextPage && (
                    <div className={css.loadMoreContainer}>
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
