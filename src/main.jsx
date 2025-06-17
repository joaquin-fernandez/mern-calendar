import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { store } from './store';
import { AppRouter } from './router';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <AppRouter />
        </Provider>
    </StrictMode>
);
