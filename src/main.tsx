import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import App from "./components/App/App";

import "./index.css";

// Створюємо екземпляр QueryClient для керування серверним станом.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* Надаємо доступ до queryClient усім дочірнім компонентам 
      через QueryClientProvider.
    */}
        <QueryClientProvider client={queryClient}>
            <App />
            <Toaster position="top-right" />
            {/* Інструменти розробника для TanStack Query */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
