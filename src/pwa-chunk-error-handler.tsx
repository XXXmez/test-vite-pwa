import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PwaChunkErrorHandler({ children }: { children: React.ReactNode }) {
    const nav = useNavigate();

    console.log('ChunkErrorBoundary pwa-10.8');

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            console.log('Возникла ошибка vite:preloadError', event);
            console.log('event.type === vite:preloadError', event.type === 'vite:preloadError');

            // loggerInstance.error('ChunkErrorBoundary1 Возникла ошибка при переходе на страницу', event);

            if (event.type === 'vite:preloadError') {
                const currentPath = window.location.pathname;
                nav('appUpdate', { state: { prevUrl: currentPath, relative: 'route' } });
                event?.preventDefault();
            }
        };

        const handleError2 = (event: ErrorEvent) => {
            console.log('Возникла ошибка загрузки чанка:', event);

        };

        window.addEventListener('vite:preloadError', handleError as EventListener);
        window.addEventListener('error', handleError2);

        return () => {
            window.removeEventListener('vite:preloadError', handleError as EventListener);
        };
    }, [nav]);

    return <>{children}</>;
}
