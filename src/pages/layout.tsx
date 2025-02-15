import {Link, Outlet} from "react-router-dom";
import {PwaChunkErrorHandler} from "../pwa-chunk-error-handler.tsx";

export function Layout() {
    return (
        <PwaChunkErrorHandler>
            <div style={{
                display: 'flex', flexDirection: 'column'
            }}>
                <nav style={{
                    display: 'flex', gap: '8px'
                }}>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/dynamicSVG">Dynamic SVG</Link>
                </nav>
                <Outlet />
            </div>
        </PwaChunkErrorHandler>

    )
}