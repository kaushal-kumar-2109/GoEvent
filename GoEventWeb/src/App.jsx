import { useState } from 'react';
import { BrowserRouter } from "react-router-dom";

import MainRouter from './routes/mainRoute';

function App() {
  return (
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  )
}

export default App






{/* <nav>
  <Link to="/">Home</Link> | <Link to="/about">About</Link>
</nav> */}
