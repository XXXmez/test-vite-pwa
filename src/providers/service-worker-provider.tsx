import React, { createContext, PropsWithChildren, useContext, useEffect } from 'react';
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';
type RegisterSwState = ReturnType<typeof useRegisterSW>;

/**
 * Интервал проверки наличия новой версии приложения.
 */
const SW_UPDATE_CHECK_INTERVAL = 60 * 1000;

const ServiceWorkerRegistrationContext = createContext<RegisterSwState | null>(null);

/**
 * Возвращает состояние для управления service worker.
 */
export function useServiceWorkerRegistration() {
    return useContext(ServiceWorkerRegistrationContext);
}

/**
 * Представляет компонент, создающий контекст состояния для управления service worker.
 */
export function ServiceWorkerProvider(props: PropsWithChildren) {
    const [isOpenUpdateNotification, setOpenUpdateNotification] = React.useState(false);

    const sw = useRegisterSW({
        // @ts-ignore
        onRegisterError(err) {
            console.log('Ошибка в работе ServiceWorker.', err)
        },
        // @ts-ignore
        onRegisteredSW(swUrl, r) {
            if (r) {
                setInterval(async () => {
                    try {
                        // Код взят из мануала https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html.
                        // Удален фрагмент с проверкой подключения.
                        if (r.installing || !navigator) {
                            return;
                        }

                        if ('connection' in navigator && !navigator.onLine) {
                            return;
                        }

                        const resp = await fetch(swUrl, {
                            cache: 'no-store',
                            headers: {
                                cache: 'no-store',
                                'cache-control': 'no-cache',
                            },
                        });

                        if (resp?.status === 200) {
                            await r.update();
                        }
                    } catch (e) {
                        console.log('Произошла ошибка при проверке наличия новой версий приложения', e)
                    }
                }, SW_UPDATE_CHECK_INTERVAL);
            } else {
                console.log('Не удалось запустить проверку новых версий приложения. Отсутствует ServiceWorkerRegistration.')
            }
        },
    });

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const [needRefresh] = sw.needRefresh;

    useEffect(() => {
        setOpenUpdateNotification(needRefresh);
    }, [needRefresh]);

    const handleCloseUpdateNotification = () => {
        setOpenUpdateNotification(false);
    };

    return (
        <ServiceWorkerRegistrationContext.Provider value={sw}>
            {props.children}
            {needRefresh && isOpenUpdateNotification && (
                <div onClick={() => handleCloseUpdateNotification()} style={{position:'absolute', top:0, left:0}}>Обновите страницу (F5) для использования актуальной версии.</div>
            )}
        </ServiceWorkerRegistrationContext.Provider>
    );
}
