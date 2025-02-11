import {lazy} from "react";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {Layout} from "./pages/layout.tsx";

export function lazyWithErrorHandler<T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>
) {
    return lazy(() =>
        importFn().catch((error) => {
            console.error('Ошибка загрузки чанка:', error);

            // window.location.href = '/appUpdate';

            return Promise.resolve({
                // @ts-ignore
                default: (() => <div>Ошибка загрузки страницы</div>) as T
            });
        })
    );
}


const router = createBrowserRouter([
    {
        path: '/',
        Component: Layout,
        children: [
            {
                path: '/',
                async lazy() {
                    const Home = lazy(() => import("./pages/Home"));
                    // const Home = lazyWithErrorHandler(() => import("./pages/Home"));
                    return {
                        Component: () => (
                            <Home />
                        )
                    }
                }
            },
            {
                path: '/about',
                async lazy() {

                    // const About = lazy(() => import("./pages/About"));
                    const About = lazyWithErrorHandler(() => import("./pages/About"));
                    return {
                        Component: () => (
                            <About />
                        )
                    }
                }
            },
            {
                path: '/appUpdate',
                async lazy() {
                    return {
                        Component: () => (
                            <div>Страница обновления приложения</div>
                        )
                    }
                }
            }
        ],
        // ErrorBoundary:
        errorElement: <div>errorElement errorElement errorElement</div>
    }
])

function App() {
    return (
        <RouterProvider router={router}   />
    );
}

export default App;
