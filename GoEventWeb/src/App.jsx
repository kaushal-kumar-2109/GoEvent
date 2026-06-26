import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";

import MainRouter from './routes/mainRoute';

function App() {
  return (
    <BrowserRouter>
      <MainRouter />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </BrowserRouter>
  )
}

export default App






{/* <nav>
  <Link to="/">Home</Link> | <Link to="/about">About</Link>
</nav> */}
