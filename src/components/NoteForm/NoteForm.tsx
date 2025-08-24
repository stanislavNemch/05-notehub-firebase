import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { NewNotePayload, NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

const validationSchema = Yup.object({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title must be at most 50 characters")
        .required("Title is required"),
    content: Yup.string().max(500, "Content must be at most 500 characters"),
    tag: Yup.mixed<NoteTag>()
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
        .required("Tag is required"),
});

const defaultInitialValues: NewNotePayload = {
    title: "",
    content: "",
    tag: "Todo",
};

interface NoteFormProps {
    onSubmit: (values: NewNotePayload) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    initialData?: NewNotePayload; // Необов'язкові дані для режиму редагування
}

const NoteForm = ({
    onSubmit,
    onCancel,
    isSubmitting,
    initialData,
}: NoteFormProps) => {
    const initialValues = initialData || defaultInitialValues;

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize // Дозволяє формі оновлюватись, коли змінюється initialData
            onSubmit={(values, actions) => {
                onSubmit(values);
                if (!initialData) {
                    // Очищуємо форму тільки при створенні
                    actions.resetForm();
                }
            }}
        >
            {({ isValid }) => (
                <Form className={css.form}>
                    {/* ... поля форми (title, content, tag) без змін ... */}
                    <div className={css.actions}>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting
                                ? "Saving..."
                                : initialData
                                ? "Update Note"
                                : "Create Note"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default NoteForm;
