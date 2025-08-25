import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

/**
 * @description Кастомний хук для керування станом автентифікації користувача.
 * @returns {object} Об'єкт, що містить поточного користувача, стан завантаження та функцію виходу.
 * @property {User | null} user - Об'єкт користувача з Firebase або null, якщо користувач не автентифікований.
 * @property {boolean} isLoading - Прапорець, що вказує на стан перевірки автентифікації.
 * @property {() => Promise<void>} logout - Асинхронна функція для виходу користувача з системи.
 */
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged - це слухач Firebase, який спрацьовує
        // при зміні стану автентифікації (логін, логаут).
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        // Повертаємо функцію для відписки від слухача,
        // коли компонент буде демонтовано. Це запобігає витокам пам'яті.
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Ви успішно вийшли з системи!");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Сталася помилка під час виходу: ${error.message}`);
            }
        }
    };

    return { user, isLoading, logout };
};
