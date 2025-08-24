# NoteHub App

## 🇺🇦 Українська версія

**NoteHub** — це веб-додаток для керування особистими нотатками. Він дозволяє користувачам легко створювати, переглядати, шукати та видаляти нотатки, взаємодіючи з реальним REST API. Цей проєкт створений як навчальна платформа для вивчення сучасного стеку веб-розробки.

### ✨ Основні функції

-   **Створення нотаток**: Форма для додавання нових нотаток з валідацією полів.
-   **Видалення нотаток**: Можливість видаляти нотатки одним кліком.
-   **Пагінація**: Зручна навігація по сторінках, якщо нотаток багато.
-   **Пошук у реальному часі**: Фільтрація нотаток за ключовим словом із затримкою (debounce) для оптимізації запитів до API.
-   **Модальні вікна**: Сучасний підхід до відображення форм та додаткового контенту.

---

### 💻 Технологічний стек

| Призначення          | Технологія / Бібліотека                              |
| -------------------- | ---------------------------------------------------- |
| **Основа**           | React, TypeScript, Vite                              |
| **Керування станом** | TanStack Query (React Query)                         |
| **HTTP-запити**      | Axios                                                |
| **Форми**            | Formik (для керування станом) та Yup (для валідації) |
| **Стилізація**       | CSS Modules, modern-normalize                        |
| **Компоненти**       | react-paginate, react-hot-toast                      |
| **Лінтинг**          | ESLint, TypeScript ESLint                            |

---

### 📂 Структура проєкту

Проєкт має чітку компонентну архітектуру, що спрощує його підтримку та масштабування:

```
src/
├── components/         # Папка з React-компонентами
│   ├── App/            # Головний компонент-контейнер
│   ├── Modal/          # Універсальне модальне вікно
│   ├── NoteForm/       # Форма створення нотатки
│   ├── NoteList/       # Список нотаток
│   ├── Pagination/     # Компонент пагінації
│   └── SearchBox/      # Поле для пошуку
├── services/           # Логіка для роботи з API
│   └── noteService.ts
├── types/              # Загальні типи TypeScript
│   └── note.ts
└── main.tsx            # Вхідна точка додатку
```

---

### 🚀 Навчальні цілі та фокус для новачка

Цей проєкт був чудовою можливістю для мене, як для новачка, зосередитись на ключових аспектах сучасної React-розробки:

1.  **Робота з TypeScript**: Я навчився строго типізувати компоненти, їх пропси та стан. Це допомогло уникнути багатьох помилок ще на етапі написання коду та покращило його читабельність.

2.  **Керування серверним станом**: Замість традиційного `useState` та `useEffect` для роботи з даними з сервера, я використовував **TanStack Query**. Це дозволило ефективно кешувати дані, автоматично оновлювати їх та керувати станами завантаження і помилок.

3.  **Професійна робота з формами**: Завдяки бібліотекам **Formik** та **Yup**, я реалізував складну логіку форм, включаючи валідацію полів та керування станом відправки, що зробило код чистішим та організованішим.

4.  **Декомпозиція та створення перевикористовуваних компонентів**: Я розробив універсальні компоненти, такі як `Modal` та `Pagination`, які можна легко адаптувати для інших проєктів.

5.  **Оптимізація взаємодії з API**: Реалізація відкладеного пошуку за допомогою хука `useDebounce` стала для мене практичним прикладом того, як покращити досвід користувача та зменшити навантаження на сервер.

## 🇬🇧 English Version

**NoteHub** is a web application for managing personal notes. It allows users to easily create, view, search, and delete notes by interacting with a real REST API. This project was built as a learning platform to master the modern web development stack.

### ✨ Key Features

-   **Note Creation**: A form for adding new notes with field validation.
-   **Note Deletion**: The ability to delete notes with a single click.
-   **Pagination**: Convenient navigation through pages when there are many notes.
-   **Real-time Search**: Filtering notes by a keyword with a debounce effect to optimize API requests.
-   **Modals**: A modern approach to displaying forms and additional content.

---

### 💻 Technology Stack

| Purpose              | Technology / Library                                 |
| -------------------- | ---------------------------------------------------- |
| **Core**             | React, TypeScript, Vite                              |
| **State Management** | TanStack Query (React Query)                         |
| **HTTP Requests**    | Axios                                                |
| **Forms**            | Formik (for state management) & Yup (for validation) |
| **Styling**          | CSS Modules, modern-normalize                        |
| **Components**       | react-paginate, react-hot-toast                      |
| **Linting**          | ESLint, TypeScript ESLint                            |

---

### 📂 Project Structure

The project has a clear component-based architecture, which simplifies its maintenance and scalability:

```
src/
├── components/         # Folder with React components
│   ├── App/            # Main container component
│   ├── Modal/          # Reusable modal window
│   ├── NoteForm/       # Note creation form
│   ├── NoteList/       # List of notes
│   ├── Pagination/     # Pagination component
│   └── SearchBox/      # Search input field
├── services/           # Logic for interacting with the API
│   └── noteService.ts
├── types/              # Global TypeScript types
│   └── note.ts
└── main.tsx            # Application entry point
```

---

### 🚀 Learning Goals & Focus for a Beginner

As a beginner, this project was an excellent opportunity for me to focus on key aspects of modern React development:

1.  **Working with TypeScript**: I learned to strictly type components, their props, and state. This helped prevent many errors during development and improved code readability.

2.  **Managing Server State**: Instead of using the traditional `useState` and `useEffect` for handling server data, I used **TanStack Query**. This allowed for effective data caching, automatic refetching, and managing loading and error states.

3.  **Professional Form Handling**: Thanks to the **Formik** and **Yup** libraries, I implemented complex form logic, including field validation and submission state management, which made the code cleaner and more organized.

4.  **Decomposition and Reusable Components**: I developed universal components like `Modal` and `Pagination` that can be easily adapted for other projects.

5.  **Optimizing API Interaction**: Implementing a debounced search with the `useDebounce` hook was a practical example for me of how to improve user experience and reduce server load.
