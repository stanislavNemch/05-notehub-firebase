import css from "./Loader.module.css";

// Інтерфейс для пропсів компонента Loader.
interface LoaderProps {
    // Текст, який буде відображатися під анімацією завантаження.
    text?: string;
}

/**
 * Компонент для відображення індикатора завантаження.
 * @param {LoaderProps} props - Пропси компонента.
 */
const Loader = ({ text = "Loading..." }: LoaderProps) => {
    return (
        <div className={css.loaderContainer}>
            <div className={css.loader}></div>
            <p>{text}</p>
        </div>
    );
};

export default Loader;
