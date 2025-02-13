import {Link, Outlet} from "react-router-dom";


export function Layout() {
    // const navigation = useNavigation();

    return (
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
    )
}