import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

async function enableMocking() {
    // MSW is disabled to allow fetchWithFallback to test real APIs
    // and fallback to static JSON directly.
    return Promise.resolve();
}

void enableMocking().then(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </StrictMode>
    );
});
