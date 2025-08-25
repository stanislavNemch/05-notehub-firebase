import { useCallback } from "react";
import {
    useQueryClient,
    useMutation,
    useInfiniteQuery,
    type InfiniteData,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
    fetchNotes,
    createNote as apiCreateNote,
    deleteNote as apiDeleteNote,
    updateNote as apiUpdateNote,
} from "../services/noteService";
import type { NewNotePayload, Note } from "../types/note";

type FetchNotesResult = Awaited<ReturnType<typeof fetchNotes>>;
type PageParam = FetchNotesResult["nextCursor"];

interface UseNotesProps {
    userId: string | undefined;
    searchQuery: string;
}

/**
 * @description Кастомний хук для керування нотатками (CRUD операції та завантаження).
 * @param {UseNotesProps} props - Пропси, що містять `userId` та `searchQuery`.
 * @returns {object} Об'єкт з даними та функціями для роботи з нотатками.
 */
export const useNotes = ({ userId, searchQuery }: UseNotesProps) => {
    const queryClient = useQueryClient();

    // Функція для "скидання" кешу до першої сторінки.
    // Це корисно після мутацій, щоб уникнути показу застарілих даних на наступних сторінках.
    const squashToFirstPage = useCallback(() => {
        if (!userId) return;
        const key: [string, string | undefined, string] = [
            "notes",
            userId,
            searchQuery,
        ];
        queryClient.setQueryData<InfiniteData<FetchNotesResult>>(key, (old) => {
            if (!old) return old;
            return {
                pages: old.pages.slice(0, 1),
                pageParams: old.pageParams.slice(0, 1),
            };
        });
    }, [userId, searchQuery, queryClient]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery<
        FetchNotesResult,
        Error,
        InfiniteData<FetchNotesResult>,
        [string, string | undefined, string],
        PageParam
    >({
        queryKey: ["notes", userId, searchQuery],
        queryFn: ({ pageParam }) =>
            fetchNotes({ pageParam, searchQuery: searchQuery }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: undefined as PageParam,
        enabled: !!userId, // Запити активні тільки якщо є userId
        refetchOnMount: "always",
    });

    const notes: Note[] = data?.pages.flatMap((page) => page.notes) ?? [];

    const createNoteMutation = useMutation({
        mutationFn: apiCreateNote,
        onSuccess: () => {
            squashToFirstPage();
            queryClient.invalidateQueries({
                queryKey: ["notes", userId, searchQuery],
            });
            toast.success("Нотатку успішно створено!");
        },
        onError: (err) =>
            toast.error(`Не вдалося створити нотатку: ${err.message}`),
    });

    const updateNoteMutation = useMutation({
        mutationFn: (variables: { noteId: string; noteData: NewNotePayload }) =>
            apiUpdateNote(variables.noteId, variables.noteData),
        onSuccess: () => {
            squashToFirstPage();
            queryClient.invalidateQueries({
                queryKey: ["notes", userId, searchQuery],
            });
            toast.success("Нотатку успішно оновлено!");
        },
        onError: (err) =>
            toast.error(`Не вдалося оновити нотатку: ${err.message}`),
    });

    const deleteNoteMutation = useMutation({
        mutationFn: apiDeleteNote,
        onSuccess: () => {
            squashToFirstPage();
            queryClient.invalidateQueries({
                queryKey: ["notes", userId, searchQuery],
            });
            toast.success("Нотатку успішно видалено!");
        },
        onError: (err) =>
            toast.error(`Не вдалося видалити нотатку: ${err.message}`),
    });

    return {
        notes,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        createNote: createNoteMutation.mutate,
        updateNote: updateNoteMutation.mutate,
        deleteNote: deleteNoteMutation.mutate,
        isCreating: createNoteMutation.isPending,
        isUpdating: updateNoteMutation.isPending,
    };
};
