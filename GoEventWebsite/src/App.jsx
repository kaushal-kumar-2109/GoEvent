import { useState, useEffect } from 'react'
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import NavBar from './components/nav_bar/nav_bar'
import SideBar from './components/side_bar/side_bar'
import Footer from './components/footer/footer'
import Loader from './components/loader/loader'
import MainRouter from './routers/main_router'

function App() {
  const [getTheam, setTheam] = useState("light");
  const [getUserData, setUserData] = useState({});
  const [isUserLoggedIN, setIsUserLoggedIn] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setTheam((prev) => (prev === 'light' ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', getTheam);
  };

  const setApplicationDetails = async () => {
    const user = localStorage.getItem("GoEvent_User");
    if (user) {
      setIsUserLoggedIn(true);
      setUserData(JSON.parse(user));
    }
    document.documentElement.setAttribute('data-theme', getTheam);
    // --- soon creting
  };

  // Sync theme selection to document element for global CSS variables support
  useEffect(() => {
    setIsLoader(true);
    setApplicationDetails();
    setIsLoader(false);
  }, []);

  return (
    (isLoader)
      ? <Loader />
      : <>
        <div className="app-layout">
          <NavBar
            theme={getTheam} onToggleTheme={toggleTheme} onOpenSidebar={() => setSidebarOpen(true)}
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
