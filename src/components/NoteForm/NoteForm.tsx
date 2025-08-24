// src/components/NoteForm/NoteForm.tsx
import {
    Formik,
    Form,
    Field,
    ErrorMessage as FormikErrorMessage,
} from "formik";
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
    initialData?: NewNotePayload;
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
            enableReinitialize // Дозволяє формі оновлюватись при зміні initialData
            onSubmit={(values, actions) => {
                onSubmit(values);
                if (!initialData) {
                    // Очищуємо форму тільки при створенні нової нотатки
                    actions.resetForm();
                }
            }}
        >
            {({ isValid }) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field
                            id="title"
                            type="text"
                            name="title"
                            className={css.input}
                        />
                        <FormikErrorMessage
                            name="title"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                            id="content"
                            as="textarea"
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <FormikErrorMessage
                            name="content"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field
                            id="tag"
                            as="select"
                            name="tag"
                            className={css.select}
                        >
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <FormikErrorMessage
                            name="tag"
                            component="span"
                            className={css.error}
                        />
                    </div>

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
