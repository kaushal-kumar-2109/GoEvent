import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// @import pages
import Signup from "../pages/setupPage/signup";
import Login from "../pages/setupPage/login";
import LandingPage from "../pages/landingPage/landing";
import EventDetailPage from "../pages/applicationPage/eventDetailPage/eventDetailPage";
import ForgotPassword from "../pages/setupPage/forgot";
import EventPage from "../pages/applicationPage/eventPage/eventPage";
import AboutUs from "../pages/aboutUs/aboutUs";
import ContactUs from "../pages/contactUs/contactUs";
import TermsOfService from "../pages/termsOfService/termsOfService";
import PrivacyPolicy from "../pages/privacyPolicy/privacyPolicy";
import CookiePreferences from "../pages/cookiePreferences/cookiePreferences";
import { CheckUserAuth } from "../middleware/chekUserAuth";

import NotFound from "../pages/notFound/notFound";
import EventCreate from "../pages/applicationPage/eventCreate/eventCreate";
import UserProfile from "../pages/applicationPage/userProfile/userProfile";
import { UpdateEvent } from "../pages/applicationPage/updateEventPage/updateEvent";
import EventBooking from "../pages/applicationPage/eventBooking/eventBooking";

const MainRouter = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const CheckUserLoggedIn = async () => {
        const value = CheckUserAuth();
        console.log("checking use, ", value)
        setIsUserLoggedIn(value);
    }

    useEffect(() => {
        CheckUserLoggedIn();
    }, [CheckUserAuth()]);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/GoEvent" replace />} />

            <Route path="/GoEvent" element={<LandingPage isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />

            <Route path="/GoEvent/signup" element={<Signup isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/forgot" element={<ForgotPassword isUserLoggedIn={isUserLoggedIn} />} />
            <Route path="/GoEvent/login" element={<Login isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />

            <Route path="/GoEvent/about" element={<AboutUs isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/contact" element={<ContactUs isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/terms" element={<TermsOfService isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/privacy" element={<PrivacyPolicy isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/cookies" element={<CookiePreferences isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />

            <Route path="/GoEvent/events" element={<EventPage isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/event/:id" element={<EventDetailPage isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/:uid/update/:eid" element={<UpdateEvent isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/event/create-event" element={<EventCreate isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
            <Route path="/GoEvent/:uid/booking/:eid" element={<EventBooking isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />

            <Route path="/GoEvent/profile" element={<UserProfile isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />


            <Route path="*" element={<NotFound isUserLoggedIn={isUserLoggedIn} setIsUserLoggedIn={setIsUserLoggedIn} />} />
        </Routes>
    )
}

export default MainRouter;