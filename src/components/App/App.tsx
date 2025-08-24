import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, type User, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../firebase";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { NewNotePayload } from "../../types/note";

import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import AuthForm from "../AuthForm/AuthForm";

import css from "./App.module.css";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const {
        data: notes,
        isLoading: isNotesLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["notes", user?.uid],
        queryFn: fetchNotes,
        enabled: !!user,
    });

    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", user?.uid] });
            toast.success("Note created successfully!");
            closeModal();
        },
        onError: (err) => {
            toast.error(`Failed to create note: ${err.message}`);
        },
    });

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", user?.uid] });
            toast.success("Note deleted successfully!");
        },
        onError: (err) => {
            toast.error(`Failed to delete note: ${err.message}`);
        },
    });

    const handleDeleteNote = (noteId: string) => {
        deleteNoteMutation.mutate(noteId);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("You have successfully logged out!");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown logout error occurred.");
            }
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleCreateNote = (values: NewNotePayload) => {
        createNoteMutation.mutate(values);
    };

    if (isAuthLoading) {
        return <Loader text="Checking user session..." />;
    }

    if (!user) {
        return <AuthForm />;
    }

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <div className={css.userInfo}>
                    <p>Welcome, {user.email}</p>
                    <button onClick={handleLogout} className={css.buttonLogout}>
                        Logout
                    </button>
                </div>
                <button className={css.button} onClick={openModal}>
                    Create note +
                </button>
            </header>

            <main>
                {isNotesLoading && <Loader />}
                {isError && <ErrorMessage message={error?.message} />}
                {notes && notes.length > 0 && (
                    <NoteList notes={notes} onDelete={handleDeleteNote} />
                )}
                {notes?.length === 0 && !isNotesLoading && (
                    <p style={{ textAlign: "center" }}>
                        No notes yet. Create one!
                    </p>
                )}
            </main>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <NoteForm
                    onSubmit={handleCreateNote}
                    onCancel={closeModal}
                    isSubmitting={createNoteMutation.isPending}
                />
            </Modal>
        </div>
    );
};

export default App;
