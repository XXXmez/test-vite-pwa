import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ServiceWorkerProvider} from "./providers/service-worker-provider.tsx";
import {PwaChunkErrorHandler} from "./pwa-chunk-error-handler.tsx";

createRoot(document.getElementById('root')!).render(
    <ServiceWorkerProvider>
        <PwaChunkErrorHandler>
            <StrictMode>
                <App />
            </StrictMode>
        </PwaChunkErrorHandler>
    </ServiceWorkerProvider>,
)
