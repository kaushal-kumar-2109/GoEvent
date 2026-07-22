import { useState, useEffect } from 'react'
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import NavBar from './components/nav_bar/nav_bar'
import SideBar from './components/side_bar/side_bar'
import Footer from './components/footer/footer'
import Loader from './components/loader/loader'
import MainRouter from './routers/main_router'
import { GET_USER_DATA } from './apis/sender';

function App() {
  const [getTheam, setTheam] = useState("light");
  const [getUserData, setUserData] = useState({});
  const [isUserLoggedIN, setIsUserLoggedIn] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = getTheam === "light" ? "dark" : "light";
    setTheam(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const setApplicationDetails = async () => {
    try {
      const userRes = await GET_USER_DATA();
      if (userRes && userRes.status == 200 && userRes.success && userRes.data) {
        setIsUserLoggedIn(true);
        setUserData(userRes.data);
        const themeVal = (userRes.data.theam || "LIGHT").toLowerCase();
        setTheam(themeVal);
        document.documentElement.setAttribute('data-theme', themeVal);
      } else {
        setTheam("light");
        localStorage.removeItem("GoEventUserData");
        document.documentElement.setAttribute('data-theme', "light");
      }
    } catch (error) {
      console.error("Error fetching user details: ", error);
      setTheam("light");
      document.documentElement.setAttribute('data-theme', "light");
    }
  };

  // Sync theme selection to document element for global CSS variables support
  useEffect(() => {
    const initApp = async () => {
      setIsLoader(true);
      await setApplicationDetails();
      setIsLoader(false);
    };
    initApp();
  }, []);

  return (
    (isLoader)
      ? <Loader />
      : <>
        <div className="app-layout">
          <NavBar
            theme={getTheam} onToggleTheme={toggleTheme} onOpenSidebar={() => setSidebarOpen(true)} getTheam={getTheam} setTheam={setTheam}
            isUserLoggedIN={isUserLoggedIN} setIsUserLoggedIn={setIsUserLoggedIn} setUserData={setUserData} getUserData={getUserData}
          />
          <SideBar
            isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} theme={getTheam} onToggleTheme={toggleTheme}
            isUserLoggedIN={isUserLoggedIN} setIsUserLoggedIn={setIsUserLoggedIn} setUserData={setUserData} getUserData={getUserData}
          />
          <main className="main-content">
            <MainRouter
              isUserLoggedIN={isUserLoggedIN} setIsUserLoggedIn={setIsUserLoggedIn} setUserData={setUserData} getUserData={getUserData}
              getTheam={getTheam} setTheam={setTheam}
            />
          </main>
          <Footer
            isUserLoggedIN={isUserLoggedIN} setIsUserLoggedIn={setIsUserLoggedIn} setUserData={setUserData} getUserData={getUserData}
          />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={getTheam == "light" ? "dark" : "light"}
            transition={Bounce}
          />
        </div>
      </>
  );
}

export default App
