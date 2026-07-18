import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/public/home/home_page";
import LoginPage from "../pages/auth/login/login_page";
import RegisterPage from "../pages/auth/register/register_page";
import ForgotPasswordPage from "../pages/auth/forgot-password/forgot_password_page";
import VerifyOtpPage from "../pages/auth/verify-otp/verify_otp_page";

const MainRouter = ({ isUserLoggedIN, setIsUserLoggedIn, setUserData, getUserData, getTheam, setTheam }) => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/GoEvent" replace />} />
                <Route path="/GoEvent" element={<HomePage getTheam={getTheam} />} />
                <Route path="/login" element={<LoginPage setIsUserLoggedIn={setIsUserLoggedIn} />} />
                <Route path="/register" element={<RegisterPage setIsUserLoggedIn={setIsUserLoggedIn} />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default MainRouter;