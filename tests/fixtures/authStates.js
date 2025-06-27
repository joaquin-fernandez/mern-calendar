export const initialState = {
    status: 'checking',
    user: {},
    errorMessage: undefined,
};

export const authenticatedState = {
    status: 'authenticated',
    user: {
        name: 'John Doe',
        uid: '123456789',
    },
    errorMessage: undefined,
};

export const notAuthenticatedState = {
    status: 'not-authenticated',
    user: {},
    errorMessage: undefined,
};
