import React, {useEffect} from 'react';

export function ErrorHandler({ children }: { children: React.ReactNode }) {

    // const refLastVisitedPaths = useRef<string[]>([])
    // const registration = useServiceWorkerRegistration();

    useEffect(() => {
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


        window.addEventListener('error', handleError2);

        return () => {

            window.removeEventListener('error', handleError2);
        };
    }, []);

    return <>{children}</>;
}
