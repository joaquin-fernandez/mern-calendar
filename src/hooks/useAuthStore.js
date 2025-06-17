import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../apis';
import {
    clearErrorMessage,
    onChecking,
    onLogin,
    onLogout,
    onLogoutCalendar,
} from '../store';
import { getErrorList } from '../helpers';

export const useAuthStore = () => {
    const dispatch = useDispatch();
    const { status, user, errorMessage } = useSelector((state) => state.auth);

    const saveTokenAndLogin = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('token-init-date', new Date().getTime());
        dispatch(onLogin({ name: data.name, uid: data.uid }));
    };

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking());
        try {
            const { data } = await calendarApi.post('/auth', {
                email,
                password,
            });
            saveTokenAndLogin(data);
        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'));
            setTimeout(() => dispatch(clearErrorMessage()), 10);
        }
    };

    const startRegister = async ({ email, password, name }) => {
        dispatch(onChecking());
        try {
            const { data } = await calendarApi.post('/auth/register', {
                email,
                password,
                name,
            });
            saveTokenAndLogin(data);
        } catch (error) {
            dispatch(onLogout(getErrorList(error)));
            setTimeout(() => dispatch(clearErrorMessage()), 10);
        }
    };

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout());
        try {
            const { data } = await calendarApi.get('/auth/renew');
            saveTokenAndLogin(data);
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    };

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogoutCalendar());
        dispatch(onLogout());
    };

    return {
        status,
        user,
        errorMessage,
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    };
};
