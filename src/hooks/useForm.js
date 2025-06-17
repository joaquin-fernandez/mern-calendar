import { useMemo, useState, useEffect } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {
    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setFormValidation] = useState({});
    const [initialFormState, setInitialFormState] = useState(
        JSON.stringify(initialForm)
    );

    useEffect(() => {
        createValidators();
    }, [formState]);

    useEffect(() => {
        setFormState(initialForm);
        if (initialForm.id !== JSON.parse(initialFormState).id)
            setInitialFormState(JSON.stringify(initialForm));
    }, [initialForm]);

    const isFormValid = useMemo(() => {
        return Object.values(formValidation).every((value) => value === null);
    }, [formValidation]);

    const isFormValuesChanged = useMemo(() => {
        return JSON.stringify(formState) !== initialFormState;
    }, [formState, initialFormState]);

    const updateInitialFormState = () => {
        setInitialFormState(JSON.stringify(formState));
    };

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({ ...formState, [name]: value });
    };

    const onResetForm = () => setFormState(initialForm);

    const createValidators = () => {
        const formCheckedValues = {};

        for (const formField of Object.keys(formValidations)) {
            const [fn, errorMessage = 'Error al validar'] =
                formValidations[formField];
            formCheckedValues[`${formField}Valid`] = fn(formState[formField])
                ? null
                : errorMessage;
        }
        setFormValidation(formCheckedValues);
    };

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        ...formValidation,
        isFormValid,
        isFormValuesChanged,
        updateInitialFormState,
    };
};
