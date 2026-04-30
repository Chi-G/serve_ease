import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import { Toaster } from 'react-hot-toast';
import { ConfirmProvider } from '@/Contexts/ConfirmContext';

const appName = import.meta.env.VITE_APP_NAME || 'ServeEase';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob(['./Pages/**/*.tsx', './Pages/**/*.jsx', './Pages/**/*.js']),
        ).catch(() => 
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob(['./Pages/**/*.tsx', './Pages/**/*.jsx', './Pages/**/*.js']),
            )
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ConfirmProvider>
                <App {...props} />
                <Toaster position="top-right" reverseOrder={false} />
            </ConfirmProvider>
        );
    },
    progress: {
        color: '#FF5C00',
    },
});
