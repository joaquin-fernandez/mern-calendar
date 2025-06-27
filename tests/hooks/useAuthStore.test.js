import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { initialState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';
import { calendarApi } from '../../src/apis';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            calendar: null,
            ui: null,
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState },
        },
    });
};

describe('Pruebas en useAuthStore', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('Debe de regresar el estado por defecto', () => {
        const mockStore = getMockStore(initialState);

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        expect(result.current).toEqual({
            ...initialState,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        });
    });

    test('startLogin debe de hacer el login correctamente', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.startLogin({
                ...testUserCredentials,
            });
        });

        const { user, status, errorMessage } = result.current;
        expect({ user, status, errorMessage }).toEqual({
            user: {
                name: testUserCredentials.name,
                uid: testUserCredentials.uid,
            },
            status: 'authenticated',
            errorMessage: undefined,
        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(
            expect.any(String)
        );
    });

    test('startLogin debe de fallar la autenticación', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.startLogin({
                email: 'some@mail.com',
                password: '123456asd',
            });
        });

        const { user, status, errorMessage } = result.current;
        expect({ user, status, errorMessage }).toEqual({
            user: {},
            status: 'not-authenticated',
            errorMessage: expect.any(String),
        });
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('token-init-date')).toBeNull();

        await waitFor(() => {
            expect(result.current.errorMessage).toBe(undefined);
        });
    });

    test('startRegister debe de registrar correctamente', async () => {
        const newUser = {
            email: 'new@mail.com',
            password: '123456asd',
            name: 'New User',
        };

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: '685295ebc68e19425d347a19',
                name: 'New User',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2ODUyOTVlYmM2OGUxOTQyNWQzNDdhMDgiLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNzUwMjQyNzk1LCJleHAiOjE3NTAyNDk5OTV9.OZBH8JmB0ReUpBIBNKjGt8-xaL81F4nqdjgXR47O5UM',
            },
        });

        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const { user, status, errorMessage } = result.current;
        expect({ user, status, errorMessage }).toEqual({
            user: {
                name: newUser.name,
                uid: '685295ebc68e19425d347a19',
            },
            status: 'authenticated',
            errorMessage: undefined,
        });

        spy.mockRestore();
    });

    test('startRegister debe de fallar la creación del usuario', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.startRegister(testUserCredentials);
        });

        const { user, status, errorMessage } = result.current;
        expect({ user, status, errorMessage }).toEqual({
            user: {},
            status: 'not-authenticated',
            errorMessage: expect.any(Array),
        });

        await waitFor(() => {
            expect(result.current.errorMessage).toBe(undefined);
        });
    });

    test('checkAuthToken debe de fallar si no hay token', async () => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { user, status, errorMessage } = result.current;
        expect({ user, status, errorMessage }).toEqual(notAuthenticatedState);
    });

    test('checkAuthToken debe de autenticar al usuario si existe el token', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { user, status, errorMessage } = result.current;
        expect({ user, status, errorMessage }).toEqual({
            user: {
                name: testUserCredentials.name,
                uid: testUserCredentials.uid,
            },
            status: 'authenticated',
            errorMessage: undefined,
        });
    });

    test('startLogout debe de borrar el token y el token-init-date', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('token-init-date', new Date().getTime());

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        act(() => {
            result.current.startLogout();
        });

        const { user, status, errorMessage } = result.current;

        expect({ user, status, errorMessage }).toEqual(notAuthenticatedState);
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('token-init-date')).toBeNull();
    });
});
