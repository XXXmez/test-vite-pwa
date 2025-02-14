import React, {useEffect} from 'react';

export function ErrorHandler({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleGlobalError = (event: ErrorEvent) => {
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
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
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

        window.

        window.addEventListener('error', handleGlobalError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {

            window.removeEventListener('error', handleGlobalError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return <>{children}</>;
}
