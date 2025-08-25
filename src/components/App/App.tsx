import { useState } from "react";
import toast from "react-hot-toast";

import type { NewNotePayload, Note } from "../../types/note";
import { useAuth } from "../../hooks/useAuth";
import { useNotes } from "../../hooks/useNotes";

import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import AuthForm from "../AuthForm/AuthForm";
import SearchBox from "../SearchBox/SearchBox";

import css from "./App.module.css";

const App = () => {
    // --- СТАН КОМПОНЕНТА ---
    // Отримуємо дані користувача та стан завантаження з кастомного хука.
    const { user, isLoading: isAuthLoading, logout } = useAuth();
    // Стан для керування модальним вікном.
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Стан для зберігання нотатки, яку редагують. null, якщо створюється нова.
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    // Стан для поля пошуку.
    const [searchQuery, setSearchQuery] = useState("");

    // --- РОБОТА З ДАНИМИ ---
    // Отримуємо всі дані та функції для роботи з нотатками з кастомного хука.
    // Передаємо йому `userId` та `searchQuery`, щоб він міг реагувати на їхні зміни.
    const {
        notes,
        isLoading: isNotesLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        createNote,
        updateNote,
        deleteNote,
        isCreating,
        isUpdating,
    } = useNotes({
        userId: user?.uid,
        searchQuery: searchQuery,
    });

    // --- ОБРОБНИКИ ПОДІЙ ---
    // Функції для керування модальним вікном.
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNote(null); // Скидаємо редаговану нотатку при закритті.
    };

    // Встановлює нотатку для редагування і відкриває модальне вікно.
    const handleEdit = (note: Note) => {
        setEditingNote(note);
        openModal();
    };

    const handleDelete = (noteId: string) => {
        if (window.confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
            deleteNote(noteId);
        }
    };

    // Обробляє подання форми: створює або оновлює нотатку.
    const handleCreateOrUpdateNote = (values: NewNotePayload) => {
        // Перевірка на унікальність назви нотатки (без урахування поточної редагованої).
        const titleExists = notes.some(
            (note) =>
                note.title.toLowerCase() === values.title.toLowerCase() &&
                note.id !== editingNote?.id
        );

        if (titleExists) {
            toast.error("Нотатка з такою назвою вже існує!");
            return;
        }

        if (editingNote) {
            updateNote(
                { noteId: editingNote.id, noteData: values },
                {
                    onSuccess: () => {
                        closeModal();
                    },
                }
            );
        } else {
            createNote(values, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    if (isAuthLoading) return <Loader text="Checking user session..." />;
    if (!user) return <AuthForm />;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <div className={css.userInfo}>
                    <p>Welcome, {user.email}</p>
                    <button onClick={logout} className={css.buttonLogout}>
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
                {isError && error && <ErrorMessage message={error.message} />}
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
                    isSubmitting={isCreating || isUpdating}
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
