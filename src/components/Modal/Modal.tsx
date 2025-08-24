import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

// Знаходимо DOM-елемент, куди будемо монтувати модальне вікно.
const modalRoot = document.body;

// Інтерфейс для пропсів компонента Modal.
interface ModalProps {
    // Визначає, чи є модальне вікно відкритим.
    isOpen: boolean;
    // Функція для закриття модального вікна.
    onClose: () => void;
    // Дочірні елементи, що будуть відображатися всередині модального вікна.
    children: React.ReactNode;
}

/**
 * Модальне вікно.
 * - Закриття по Esc/бекдроп.
 * - блокуємо прокручування body, коли модалка відкрита.
 */
const Modal = ({
    isOpen,
    onClose,
    children,
}: ModalProps): React.ReactPortal | null => {
    // Обробка клавіші Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Блокування прокрутки фону під час відкритої модалки
    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden"; // заблокувати скролл фону
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>{children}</div>
        </div>,
        modalRoot
    );
};

export default Modal;
