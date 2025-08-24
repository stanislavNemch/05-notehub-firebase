import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../firebase";
import css from "./AuthForm.module.css";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Successfully logged in!");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success("Account created successfully!");
            }
        } catch (error) {
            // ВИПРАВЛЕННЯ: Безпечна обробка помилки
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={css.container}>
            <form onSubmit={handleSubmit} className={css.form}>
                <h2>{isLogin ? "Login" : "Register"}</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className={css.input}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min. 6 characters)"
                    required
                    className={css.input}
                />
                <button type="submit" className={css.button} disabled={loading}>
                    {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                </button>
                <p className={css.toggle} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin
                        ? "Need an account? Register"
                        : "Have an account? Login"}
                </p>
            </form>
        </div>
    );
};

export default AuthForm;
