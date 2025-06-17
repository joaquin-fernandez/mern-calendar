import { Navigate } from 'react-router-dom';
import { CalendarApp } from '../CalendarApp';
import { LoginPage } from '../auth';
import { CalendarPage } from '../calendar';

export const getRoutes = (status) => {
    return [
        {
            path: '/',
            element: <CalendarApp />,
            children:
                status === 'authenticated'
                    ? [
                          {
                              path: '/',
                              element: <CalendarPage />,
                          },
                          {
                              path: '*',
                              element: <Navigate to='/' replace />,
                          },
                      ]
                    : [
                          {
                              path: '/auth/login',
                              element: <LoginPage />,
                          },
                          {
                              path: '/auth/*',
                              element: <Navigate to='/auth/login' />,
                          },
                          {
                              path: '*',
                              element: <Navigate to='/auth/login' />,
                          },
                          {
                              path: '/',
                              element: <Navigate to='/auth/login' />,
                          },
                      ],
        },
    ];
};
