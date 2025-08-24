import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
    notes: Note[];
    onDelete: (noteId: string) => void;
}

const NoteList = ({ notes, onDelete }: NoteListProps) => {
    return (
        <ul className={css.list}>
            {notes.map(({ id, title, content, tag }) => (
                // ВИПРАВЛЕННЯ: Використовуємо 'id' замість '_id'
                <li key={id} className={css.listItem}>
                    <div>
                        <h2 className={css.title}>{title}</h2>
                        <p className={css.content}>{content}</p>
                    </div>
                    <div className={css.footer}>
                        <span className={css.tag}>{tag}</span>
                        {/* ВИПРАВЛЕННЯ: Передаємо 'id' в функцію видалення */}
                        <button
                            className={css.button}
                            onClick={() => onDelete(id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;
