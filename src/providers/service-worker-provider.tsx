import React, { createContext, PropsWithChildren, useContext, useEffect } from 'react';
// @ts-ignore
import { useRegisterSW } from 'virtual:pwa-register/react';
import {UpdateAppButton} from "../update-app-button.tsx";
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

// async function checkingAppVersionByInit(swUrl: string, registration: ServiceWorkerRegistration) {
//     try {
//         console.log('Проверка обновлений при старте приложения');
//         const resp = await fetch(swUrl, {
//             cache: 'no-store',
//             headers: {
//                 cache: 'no-store',
//                 'cache-control': 'no-cache',
//             },
//         });
//
//         if (resp?.status === 200) {
//             await registration.update();
//
//             if (registration.waiting) {
//                 console.log('Обновление уже доступно, активируем его');
//                 registration.waiting.postMessage({ type: 'SKIP_WAITING' });
//                 await caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
//                 window.location.reload();
//                 return;
//             }
//             if (registration.installing) {
//                 console.log('Установка нового сервис-воркера в процессе, ждем завершения');
//                 await new Promise((resolve) => {
//                     registration.installing?.addEventListener('statechange', (event) => {
//
//                         console.log('event', event)
//                         console.log('event.target', event.target)
//                         // @ts-ignore
//                         console.log('event.target?.state', event.target?.state)
//                         // @ts-ignore
//                         if (event.target?.state === 'installed' && registration.waiting) {
//                             console.log('Новый сервис-воркер установлен, активируем его');
//                             registration.waiting.postMessage({ type: 'SKIP_WAITING' });
//                             // @ts-ignore
//                             resolve();
//                         }
//                     });
//                 });
//                 await caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
//                 window.location.reload();
//                 return;
//             }
//             console.log('Обновление не требуется');
//         }
//     } catch (e) {
//         console.error('Ошибка при проверке обновлений при старте приложения:', e);
//     }
// }

async function checkingAppVersionByInit(swUrl: string, registration: ServiceWorkerRegistration) {
    try {
        console.log('Проверка обновлений при старте приложения');

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
                console.log('Обновление уже доступно, активируем его');
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                await caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
                window.location.reload();
                return;
            }

            if (registration.installing) {
                console.log('Установка нового сервис-воркера в процессе, ждем завершения');
                await new Promise<void>((resolve) => {
                    registration.installing?.addEventListener('statechange', (event) => {
                        const target = event.target as ServiceWorker | null;
                        console.log('event', event);
                        console.log('target', target);

                        if (target?.state === 'installed' && registration.waiting) {
                            console.log('Новый сервис-воркер установлен, активируем его');
                            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                            resolve();
                        }
                    });
                });
                await caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
                window.location.reload();
                return;
            }
            console.log('Обновление не требуется');
        }
    } catch (error) {
        console.error('Возникла ошибка при проверке обновления при старте приложения:', error);
    }
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
                checkingAppVersionByInit(swUrl, registration).then()

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
