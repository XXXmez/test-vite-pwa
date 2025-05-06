import React, { createContext, PropsWithChildren, useContext, useEffect } from 'react';
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';
import {UpdateAppButton} from "../update-app-button.tsx";
type RegisterSwState = ReturnType<typeof useRegisterSW>;

/**
 * Интервал проверки наличия новой версии приложения.
 */
const SW_UPDATE_CHECK_INTERVAL = 20 * 1000;

const ServiceWorkerRegistrationContext = createContext<RegisterSwState | null>(null);

/**
 * Возвращает состояние для управления service worker.
 */
export function useServiceWorkerRegistration() {
    return useContext(ServiceWorkerRegistrationContext);
}

async function waitForWaitingSW(registration: ServiceWorkerRegistration): Promise<void> {
    if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
        const onUpdateFound = () => {
            const newSW = registration.installing;
            if (!newSW) {
                return;
            }
            newSW.addEventListener('statechange', () => {
                if (newSW.state === 'installed' && registration.waiting) {
                    registration.waiting!.postMessage({ type: 'SKIP_WAITING' });
                    resolve();
                }
            });
        };

        registration.addEventListener('updatefound', onUpdateFound);

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            resolve();
        });
    });
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
        onRegisteredSW(swUrl, registration) {
            if (registration) {
                // (async () => {
                //     try {
                //         console.log('Попытка обновления приложения при ините');
                //
                //         const resp = await fetch(swUrl, {
                //             cache: 'no-store',
                //             headers: {
                //                 cache: 'no-store',
                //                 'cache-control': 'no-cache',
                //             },
                //         });
                //
                //         console.log('Подгрузили SW', resp);
                //
                //         if (resp?.status === 200) {
                //             console.log('Прошли проверку статуса загрузки sw и обновили registration');
                //
                //             await registration.update();
                //
                //             console.log('Регистрация SW', registration);
                //             console.log('Статус SW', registration.waiting);
                //
                //             await waitForWaitingSW(registration);
                //
                //             await registration.updateServiceWorker();
                //             const keys = await caches.keys();
                //             await Promise.all(keys.map((k) => caches.delete(k)));
                //             // eslint-disable-next-line no-restricted-globals
                //             location.reload();
                //         }
                //     } catch (e) {
                //         console.log('Ошибка при initial update-check', e)
                //     }
                // })()

                (async () => {
                    try {
                        console.log('Попытка обновления приложения при ините');
                        const resp = await fetch(swUrl, {
                            cache: 'no-store',
                            headers: {
                                cache: 'no-store',
                                'cache-control': 'no-cache',
                            },
                        });

                        if (resp?.status === 200) {
                            await registration.update();
                            if (registration.waiting) {
                                console.log('Обновление доступно при инициализации, применяем его');
                                await registration.updateServiceWorker();
                                await caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
                                location.reload();
                            }
                        }
                    } catch (e) {
                        console.log('Ошибка при initial update-check', e)
                    }
                })();

                setInterval(async () => {
                    try {
                        // Код взят из мануала https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html.
                        // Удален фрагмент с проверкой подключения.
                        if (registration.installing || !navigator) {
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
                            await registration.update();
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
                <div onClick={() => handleCloseUpdateNotification()} style={{position:'absolute', top:0, left:0}}>Обновите страницу (F5) для использования актуальной версии. <UpdateAppButton /></div>
            )}
        </ServiceWorkerRegistrationContext.Provider>
    );
}
