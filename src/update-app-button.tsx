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
        window.location.reload();
    };

    return (
        needRefresh && (
            <button onClick={handleUpdate}>
                Обновить приложение
            </button>
        )
    );
}
