import {
    authSlice,
    clearErrorMessage,
    onChecking,
    onLogin,
    onLogout,
} from '../../../src/store/auth/authSlice';
import {
    authenticatedState,
    initialState,
    notAuthenticatedState,
} from '../../fixtures/authStates';
import { testUserCredentials } from '../../fixtures/testUser';

describe('Pruebas en authSlice', () => {
    test('Debe de regresar el estado incial', () => {
        expect(authSlice.getInitialState()).toEqual(initialState);
    });

    test('Debe de realizar un login', () => {
        const state = authSlice.reducer(
            initialState,
            onLogin(testUserCredentials)
        );
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined,
        });
    });

    test('Debe de realizar el logout', () => {
        const state = authSlice.reducer(authenticatedState, onLogout());
        expect(state).toEqual(notAuthenticatedState);
    });

    test('Debe de realizar el logout con un mensaje de error', () => {
        const errorMessage = 'Error al cerrar sesión';
        const state = authSlice.reducer(
            authenticatedState,
            onLogout(errorMessage)
        );
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage,
        });
    });

    test('Debe de limpiar el errorMessage', () => {
        const errorMessage = 'Error al cerrar sesión';
        let state = authSlice.reducer(
            authenticatedState,
            onLogout(errorMessage)
        );
        state = authSlice.reducer(state, clearErrorMessage());
        expect(state).toEqual(notAuthenticatedState);
    });

    test('Debe de cambiar el status a checking', () => {
        let state = authSlice.getInitialState();
        state = authSlice.reducer(state, onLogin(testUserCredentials));
        expect(state.status).toBe('authenticated');
        state = authSlice.reducer(state, onChecking());
        expect(state.status).toBe('checking');
    });
});
