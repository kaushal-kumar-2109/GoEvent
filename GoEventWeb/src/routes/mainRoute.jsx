import { Routes, Route, Navigate } from "react-router-dom";

// @import pages
import Signup from "../pages/setupPage/signup";
import Login from "../pages/setupPage/login";
import LandingPage from "../pages/landingPage/landing";

// @import pages components
const NotFound = () => <h2>404 - Page Not Found</h2>;

const MainRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/GoEvent" replace />} />
            <Route path="/GoEvent" element={<LandingPage />} />
            <Route path="/GoEvent/signup" element={<Signup />} />
            <Route path="/GoEvent/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default MainRouter;