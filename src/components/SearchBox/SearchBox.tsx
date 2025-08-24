import css from "./SearchBox.module.css";

// Інтерфейс для пропсів компонента SearchBox.
interface SearchBoxProps {
    // Поточне значення поля пошуку.
    value: string;
    // Функція-обробник, яка викликається при зміні значення в полі.
    onChange: (newValue: string) => void;
}

/**
 * Компонент текстового поля для пошуку нотаток.
 * @param {SearchBoxProps} props - Пропси компонента.
 */
const SearchBox = ({ value, onChange }: SearchBoxProps) => {
    // Обробник зміни значення в полі вводу.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            value={value}
            onChange={handleChange}
        />
    );
};

export default SearchBox;
