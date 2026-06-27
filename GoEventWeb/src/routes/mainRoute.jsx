import { Routes, Route, Navigate } from "react-router-dom";

// @import pages
import Signup from "../pages/setupPage/signup";
import Login from "../pages/setupPage/login";
import LandingPage from "../pages/landingPage/landing";
import EventDetailPage from "../pages/applicationPage/eventDetailPage/eventDetailPage";
import ForgotPassword from "../pages/setupPage/forgot";
import EventPage from "../pages/applicationPage/eventPage/eventPage";

// @import pages components
const NotFound = () => <h2>404 - Page Not Found</h2>;

const MainRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/GoEvent" replace />} />
            <Route path="/GoEvent" element={<LandingPage />} />
            <Route path="/GoEvent/signup" element={<Signup />} />
            <Route path="/GoEvent/forgot" element={<ForgotPassword />} />
            <Route path="/GoEvent/login" element={<Login />} />
            <Route path="/GoEvent/events" element={<EventPage />} />
            <Route path="/GoEvent/event/:id" element={<EventDetailPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default MainRouter;