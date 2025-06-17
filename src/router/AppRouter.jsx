import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getRoutes } from './Routes';
import { useAuthStore } from '../hooks';
import { Loading } from '../ui';
import { useEffect } from 'react';

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
        checkAuthToken();
    }, []);

    if (status === 'checking') return <Loading />;

    const router = createBrowserRouter(getRoutes(status));
    return <RouterProvider router={router} />;
};
