import React, {useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

export function PwaChunkErrorHandler({ children }: { children: React.ReactNode }) {
    const nav = useNavigate();
    const refLastVisitedPaths = useRef<string[]>([])

    console.log('ChunkErrorBoundary pwa-10.8');

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            const currentPath = window.location.pathname;

            console.log('currentPath1', currentPath)
            console.log('Возникла ошибка vite:preloadError', event);
            console.log('event.type === vite:preloadError', event.type === 'vite:preloadError');

            // loggerInstance.error('ChunkErrorBoundary1 Возникла ошибка при переходе на страницу', event);

            if (event.type === 'vite:preloadError') {
                refLastVisitedPaths.current.push(currentPath)
                console.log('currentPath2', currentPath)
                nav('appUpdate', { state: { prevUrl: currentPath, relative: 'route' } });
                event.preventDefault();
            }
        };

        const handleError2 = (event: ErrorEvent) => {
            console.log('Возникла ошибка загрузки чанка:', event);
            const currentPath = window.location.pathname;
            console.log('currentPath3', currentPath)
            console.log('refLastVisitedPaths.current', refLastVisitedPaths.current)

            const isPrevLastPath = refLastVisitedPaths.current.some((path => path === currentPath))

            console.log('isPrevLastPath', isPrevLastPath)

            if (isPrevLastPath) {
                nav('appUpdate', { state: { prevUrl: currentPath, relative: 'route' } });
                event.preventDefault();
            }

        };

        window.addEventListener('vite:preloadError', handleError as EventListener);
        window.addEventListener('error', handleError2);

        return () => {
            window.removeEventListener('vite:preloadError', handleError as EventListener);
        };
    }, [nav]);

    return <>{children}</>;
}
