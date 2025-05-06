import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ServiceWorkerProvider} from "./providers/service-worker-provider.tsx";
import {ErrorHandler} from "./error-handler.tsx";

createRoot(document.getElementById('root')!).render(
    <ServiceWorkerProvider>
        <ErrorHandler>
            <App />
        </ErrorHandler>
    </ServiceWorkerProvider>,
)
