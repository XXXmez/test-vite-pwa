import {useServiceWorkerRegistration} from "./providers/service-worker-provider.tsx";

/**
 * Представляет компонент кнопки обновления приложения.
 */
export function UpdateAppButton() {
    const registration = useServiceWorkerRegistration();
    if (!registration) {
        return null;
    }

    const [needRefresh] = registration.needRefresh;

    const handleUpdate = async () => {
        console.log(1)
        await registration.updateServiceWorker();
        console.log(2)
        await caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))));
        console.log(3)
        window.location.reload();
        console.log(4)
    };

    return (
        needRefresh && (
            <button onClick={handleUpdate}>
                Обновить приложение
            </button>
        )
    );
}
