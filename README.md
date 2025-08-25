# NoteHub App (Firebase Version)

## 🇺🇦 Українська версія

**NoteHub** — це повноцінний веб-додаток для керування особистими нотатками, побудований на сучасному стеку з використанням **React** та **Firebase**. Користувачі можуть безпечно реєструватися, створювати особисті нотатки, редагувати їх, шукати за назвою та видаляти. Проєкт слугує чудовою практичною платформою для вивчення інтеграції фронтенду з хмарним бекендом (Backend-as-a-Service).

### ✨ Основні функції

-   **Автентифікація користувачів**: Повний цикл реєстрації, входу та виходу з системи.
-   **CRUD операції**: Створення, читання, оновлення та видалення (CRUD) особистих нотаток.
-   **Безпека**: Кожен користувач має доступ **тільки** до своїх власних нотаток завдяки правилам безпеки Firestore.
-   **Редагування**: Можливість відкривати існуючу нотатку в тій самій формі для внесення змін.
-   **Пагінація**: Динамічне довантаження нотаток за допомогою кнопки "Load More".
-   **Пошук**: Фільтрація нотаток за назвою в реальному часі з використанням debounce-ефекту.
-   **Валідація**: Перевірка унікальності назви нотатки та валідація полів форми.

---

### 💻 Технологічний стек

| Призначення                  | Технологія / Бібліотека                              |
| :--------------------------- | :--------------------------------------------------- |
| **Основа**                   | React, TypeScript, Vite                              |
| **Бекенд та База Даних**     | **Firebase** (Authentication, Firestore Database)    |
| **Керування станом сервера** | TanStack Query (React Query)                         |
| **Форми**                    | Formik (для керування станом) та Yup (для валідації) |
| **Стилізація**               | CSS Modules, modern-normalize                        |
| **Компоненти та утиліти**    | `react-hot-toast`, `use-debounce`                    |
| **Безпека**                  | Firebase App Check, Firestore Security Rules         |

---

### 📂 Структура проєкту

Архітектура проєкту побудована навколо компонентного підходу та чіткого розділення логіки.

```
src/
├── components/         # Папка з React-компонентами
│   ├── App/            # Головний компонент-контейнер
│   ├── AuthForm/       # Форма реєстрації та входу
│   ├── Modal/          # Універсальне модальне вікно
│   ├── NoteForm/       # Форма для створення/редагування нотатки
│   ├── NoteList/       # Список нотаток
│   └── ...             # Інші UI-компоненти
├── services/           # Логіка для роботи з Firebase
│   └── noteService.ts
├── types/              # Загальні типи TypeScript
│   └── note.ts
├── firebase.ts         # Файл ініціалізації Firebase
└── main.tsx            # Вхідна точка додатку
```

---

### 🚀 Навчальні цілі та фокус для новачка

Цей проєкт став для мене значним кроком уперед. Основний фокус був на наступних аспектах:

1.  **Перехід від REST API до BaaS (Firebase)**: Замість простого споживання готового API, я навчився будувати повноцінний додаток з нуля, використовуючи Firebase як бекенд. Це включало налаштування бази даних Firestore, системи автентифікації та їх інтеграцію в React-додаток.

2.  **Реалізація повної автентифікації**: Одним з ключових завдань було створення повного циклу реєстрації, входу та виходу користувачів. Я зрозумів, як керувати станом сесії користувача в додатку та захищати маршрути.

3.  **Безпека даних на практиці**: Я навчився писати **правила безпеки (Security Rules)** для Firestore, щоб гарантувати, що кожен користувач має доступ тільки до своїх власних нотаток. Це був надзвичайно важливий урок про захист даних на стороні сервера.

4.  **Складний стан форми**: Компонент `NoteForm` був адаптований для роботи у двох режимах: створення та редагування. Це дозволило попрактикуватися з передачею початкових даних у форму та реалізацією умовної логіки.

5.  **Пагінація та пошук у Firestore**: Я дізнався, що пагінація та пошук у NoSQL базах даних працюють інакше, ніж у REST API. Я реалізував логіку на основі **курсорів** (`startAfter`) та складних запитів (`query`) до бази даних, що є важливою навичкою при роботі з Firestore.

## 🇬🇧 English Version

**NoteHub** is a full-featured web application for managing personal notes, built on a modern stack using **React** and **Firebase**. Users can securely register, create personal notes, edit them, search by title, and delete them. This project serves as an excellent hands-on platform for learning frontend integration with a cloud backend (Backend-as-a-Service).

### ✨ Key Features

-   **User Authentication**: A complete registration, login, and logout cycle.
-   **CRUD Operations**: Create, Read, Update, and Delete (CRUD) for personal notes.
-   **Security**: Each user has access **only** to their own notes, enforced by Firestore Security Rules.
-   **Editing**: Ability to open an existing note in the same form to make changes.
-   **Pagination**: Dynamic loading of more notes using a "Load More" button.
-   **Search**: Real-time filtering of notes by title with a debounce effect.
-   **Validation**: Unique note title check and form field validation.

---

### 💻 Technology Stack

| Purpose                     | Technology / Library                                 |
| :-------------------------- | :--------------------------------------------------- |
| **Core**                    | React, TypeScript, Vite                              |
| **Backend & Database**      | **Firebase** (Authentication, Firestore Database)    |
| **Server State Management** | TanStack Query (React Query)                         |
| **Forms**                   | Formik (for state management) & Yup (for validation) |
| **Styling**                 | CSS Modules, modern-normalize                        |
| **Components & Utilities**  | `react-hot-toast`, `use-debounce`                    |
| **Security**                | Firebase App Check, Firestore Security Rules         |

---

### 📂 Project Structure

The project architecture is built around a component-based approach and a clear separation of concerns.

```
src/
├── components/         # Folder with React components
│   ├── App/            # Main container component
│   ├── AuthForm/       # Registration and login form
│   ├── Modal/          # Reusable modal window
│   ├── NoteForm/       # Form for creating/editing a note
│   ├── NoteList/       # List of notes
│   └── ...             # Other UI components
├── services/           # Logic for interacting with Firebase
│   └── noteService.ts
├── types/              # Global TypeScript types
│   └── note.ts
├── firebase.ts         # Firebase initialization file
└── main.tsx            # Application entry point
```

---

### 🚀 Learning Goals & Focus for a Beginner

This project was a significant step forward for me. The main focus was on the following aspects:

1.  **Transitioning from REST API to BaaS (Firebase)**: Instead of just consuming a ready-made API, I learned to build a full-fledged application from scratch using Firebase as the backend. This included setting up the Firestore database and authentication system and integrating them into a React application.

2.  **Implementing Full Authentication**: One of the key tasks was creating a complete user registration, login, and logout flow. I understood how to manage the user's session state within the application and protect routes.

3.  **Practical Data Security**: I learned to write **Security Rules** for Firestore to ensure that each user can only access their own notes. This was an extremely important lesson in server-side data protection.

4.  **Complex Form State**: The `NoteForm` component was adapted to work in two modes: creating and editing. This provided practice in passing initial data to a form and implementing conditional logic.

5.  **Pagination and Search in Firestore**: I discovered that pagination and searching in NoSQL databases work differently than with REST APIs. I implemented logic based on **cursors** (`startAfter`) and complex queries (`query`), which is a crucial skill when working with Firestore.
