import React, {useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
// import {useServiceWorkerRegistration} from "./providers/service-worker-provider.tsx";

export function PwaChunkErrorHandler({ children }: { children: React.ReactNode }) {
    const nav = useNavigate();
    const refLastVisitedPaths = useRef<string[]>([])
    // const registration = useServiceWorkerRegistration();

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            const currentPath = window.location.pathname;

            console.log('Возникла ошибка vite:preloadError', event);

            // loggerInstance.error('ChunkErrorBoundary1 Возникла ошибка при переходе на страницу', event);

            if (event.type === 'vite:preloadError') {
                refLastVisitedPaths.current.push(currentPath)
                nav('appUpdate', { state: { prevUrl: currentPath, relative: 'route' } });
                event.preventDefault();
            }
        };

        const handleError2 = (event: ErrorEvent) => {
            console.log('Возникла непредвиденная ошибка:', event);
            // const currentPath = window.location.pathname;
            // console.log('currentPath3', currentPath)
            // console.log('refLastVisitedPaths.current', refLastVisitedPaths.current)
            //
            // const isPrevLastPath = refLastVisitedPaths.current.some((path => path === currentPath))
            //
            // console.log('isPrevLastPath', isPrevLastPath)
            //
            // if (isPrevLastPath) {
            //     // registration.updateServiceWorker().then(() => {
            //     //     caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))).then(() => {
            //     //         window.location.reload();
            //     //     })
            //     // })
            //
            // }
            // nav('appUpdate', { state: { prevUrl: currentPath, relative: 'route' } });
            // window.location.reload();
            // event.preventDefault();

        };

        window.addEventListener('vite:preloadError', handleError as EventListener);
        window.addEventListener('error', handleError2);

        return () => {
            window.removeEventListener('vite:preloadError', handleError as EventListener);
            window.removeEventListener('error', handleError2);
        };
    }, [nav]);

    return <>{children}</>;
}
