import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
    notes: Note[];
    onDelete: (noteId: string) => void;
    onEdit: (note: Note) => void; // Новий пропс для редагування
}

const NoteList = ({ notes, onDelete, onEdit }: NoteListProps) => {
    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li key={note.id} className={css.listItem}>
                    <div>
                        <h2 className={css.title}>{note.title}</h2>
                        <p className={css.content}>{note.content}</p>
                    </div>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <div className={css.actions}>
                            <button
                                className={css.buttonEdit}
                                onClick={() => onEdit(note)} // Викликаємо onEdit з даними нотатки
                            >
                                Edit
                            </button>
                            <button
                                className={css.button}
                                onClick={() => onDelete(note.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;
