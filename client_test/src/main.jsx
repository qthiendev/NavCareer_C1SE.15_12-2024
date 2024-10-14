import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';
import SignIn from './pages/authentications/SignIn.jsx';
import SignUp from './pages/authentications/SignUp.jsx';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="signin" element={<SignIn />} /> 
        <Route path="signup" element={<SignUp />} /> 

      </Route>

    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
