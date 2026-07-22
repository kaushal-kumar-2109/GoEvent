import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/public/home/home_page";
import EventsPage from "../pages/public/events/events_page";
import EventDetailsPage from "../pages/public/event-details/event_details_page";
import LoginPage from "../pages/auth/login/login_page";
import RegisterPage from "../pages/auth/register/register_page";
import ForgotPasswordPage from "../pages/auth/forgot-password/forgot_password_page";
import ProfilePage from "../pages/profile/profile_page";
import ManageEventPage from "../pages/organizer/manage-event/manage_event_page";

const MainRouter = ({ isUserLoggedIN, setIsUserLoggedIn, setUserData, getUserData, getTheam, setTheam }) => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/GoEvent" replace />} />
                <Route path="/GoEvent" element={<HomePage getTheam={getTheam} />} />
                <Route path="/GoEvent/events" element={<EventsPage getTheam={getTheam} isUserLoggedIN={isUserLoggedIN} getUserData={getUserData} />} />
                <Route path="/GoEvent/event-details/:eid" element={<EventDetailsPage getTheam={getTheam} />} />
                <Route path="/login" element={<LoginPage setIsUserLoggedIn={setIsUserLoggedIn} />} />
                <Route path="/register" element={<RegisterPage setIsUserLoggedIn={setIsUserLoggedIn} />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={
                    <ProfilePage
                        getTheam={getTheam}
                        isUserLoggedIN={isUserLoggedIN}
                        getUserData={getUserData}
                        setUserData={setUserData}
                        setIsUserLoggedIn={setIsUserLoggedIn}
                    />
                } />
                <Route path="/GoEvent/create-event" element={
                    <ProfilePage
                        getTheam={getTheam}
                        isUserLoggedIN={isUserLoggedIN}
                        getUserData={getUserData}
                        setUserData={setUserData}
                        setIsUserLoggedIn={setIsUserLoggedIn}
                        initialTab="create_event"
                    />
                } />
                <Route path="/GoEvent/manage-event/:eid" element={
                    <ManageEventPage
                        getTheam={getTheam}
                        isUserLoggedIN={isUserLoggedIN}
                        getUserData={getUserData}
                    />
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default MainRouter;