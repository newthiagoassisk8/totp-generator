import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

// Try to dynamically polyfill Buffer/buffer for libraries (like otplib) that
// expect Node-style Buffer globals in the browser. This uses dynamic import so
// the app can still build if the `buffer` package isn't installed; if it is
// installed we'll set global variables before mounting the app.
const ensureBufferPolyfill = async (): Promise<void> => {
    try {
        const mod = await import('buffer');
        const modAny = mod as any;
        // Expose the module itself as `buffer` so code that references `buffer.Buffer`
        // works (some libraries do `import buffer from 'buffer'` and then use
        // `buffer.Buffer`). Also expose the constructor as `Buffer` on globals.
        (window as any).buffer = modAny;
        (window as any).Buffer = modAny.Buffer;
        // Also set on globalThis for broader compatibility
        (globalThis as any).buffer = modAny;
        (globalThis as any).Buffer = modAny.Buffer;
        console.info('Buffer polyfill applied');
    } catch (err) {
        // Not fatal — if `buffer` isn't installed we'll warn and continue. The
        // runtime error will persist until `buffer` is installed or another
        // resolution is applied.
        // eslint-disable-next-line no-console
        console.warn('`buffer` package not available; install it to polyfill Buffer for otplib if needed', err);
    }
};

// Ensure polyfill first, then dynamically import the app and mount it.
// Dynamically importing `App` after the polyfill prevents otplib (which is
// imported inside app modules) from running before the polyfill is applied.
ensureBufferPolyfill().then(async () => {
    try {
        const { default: App } = await import('./App.tsx');
        ReactDOM.createRoot(document.getElementById('root')!).render(
            <React.StrictMode>
                <BrowserRouter basename={import.meta.env.BASE_URL}>
                    <App />
                </BrowserRouter>
            </React.StrictMode>
        );
    } catch (err) {
        // If importing the app fails, show a clear error in console.
        // eslint-disable-next-line no-console
        console.error('Failed to load App after applying polyfill', err);
    }
});
