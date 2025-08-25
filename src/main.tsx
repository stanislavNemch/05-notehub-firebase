import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import App from "./components/App/App";

import "./index.css";

// Створюємо єдиний екземпляр QueryClient.
// Цей клієнт буде керувати кешуванням, завантаженням та оновленням
// усіх серверних даних у додатку.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* QueryClientProvider "огортає" наш додаток (компонент App).
        Це дозволяє будь-якому компоненту всередині отримати доступ
        до кешу та функцій TanStack Query через кастомні хуки.
    */}
        <QueryClientProvider client={queryClient}>
            {/* Основний компонент нашого додатку */}
            <App />

            {/* Toaster - компонент для відображення спливаючих повідомлень (тостів).
            Ми розміщуємо його тут, щоб повідомлення були доступні з будь-якої точки додатку. */}
            <Toaster position="top-right" />

            {/* ReactQueryDevtools - корисний інструмент для розробки.
            Він дозволяє візуально перевіряти стан кешу, запити та їхні дані.
            Він не буде включений у фінальну збірку додатку. */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
