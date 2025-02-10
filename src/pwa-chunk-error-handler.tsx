import React, {useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

export function PwaChunkErrorHandler({ children }: { children: React.ReactNode }) {
    const nav = useNavigate();
    const refLastVisitedPaths = useRef<string[]>([])

    console.log('ChunkErrorBoundary pwa-10.8');

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            const LastPathname = window.location.pathname;

            console.log('LastPathname', LastPathname)
            console.log('Возникла ошибка vite:preloadError', event);
            console.log('event.type === vite:preloadError', event.type === 'vite:preloadError');

            // loggerInstance.error('ChunkErrorBoundary1 Возникла ошибка при переходе на страницу', event);

            if (event.type === 'vite:preloadError') {
                refLastVisitedPaths.current.push(LastPathname)
                const currentPath = window.location.pathname;
                console.log('currentPath', currentPath)
                nav('appUpdate', { state: { prevUrl: currentPath, relative: 'route' } });
                event?.preventDefault();
            }
        };

        const handleError2 = (event: ErrorEvent) => {
            console.log('Возникла ошибка загрузки чанка:', event);
            const LastPathname = window.location.pathname;
            if (refLastVisitedPaths.current.some((path => path === LastPathname))) {
                nav('appUpdate', { state: { prevUrl: LastPathname, relative: 'route' } });
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
