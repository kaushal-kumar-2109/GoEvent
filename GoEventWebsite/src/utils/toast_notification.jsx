import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastInfo = (message, getTheam) => {
    toast.info(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: (getTheam == "light") ? "dark" : "light",
        transition: Bounce,
    });
}

const ToastSuccess = (message, getTheam) => {
    toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: (getTheam == "light") ? "dark" : "light",
        transition: Bounce,
    });
}

const ToastWarnning = (message, getTheam) => {
    toast.warn(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: (getTheam == "light") ? "dark" : "light",
        transition: Bounce,
    });
}

const ToastError = (message, getTheam) => {
    toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: (getTheam == "light") ? "dark" : "light",
        transition: Bounce,
    });
}

export { ToastInfo, ToastSuccess, ToastWarnning, ToastError }