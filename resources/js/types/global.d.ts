import { AxiosInstance } from 'axios';
import { route as routeFn } from 'ziggy-js';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        axios: AxiosInstance;
        Pusher: typeof Pusher;
        Echo: Echo<any>;
    }

    var route: typeof routeFn;
}

declare module '@inertiajs/core' {
    interface PageProps extends Record<string, unknown> {
        auth: {
            user: any;
        };
    }
}
