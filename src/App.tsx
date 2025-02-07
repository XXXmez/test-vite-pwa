import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {PwaChunkErrorHandler} from "./pwa-chunk-error-handler.tsx";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

function App() {
    return (
        <PwaChunkErrorHandler>
            <Router>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </nav>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/appUpdate" element={<div>appUpdate</div>} />
                    </Routes>
                </Suspense>
            </Router>
        </PwaChunkErrorHandler>
    );
}

export default App;
