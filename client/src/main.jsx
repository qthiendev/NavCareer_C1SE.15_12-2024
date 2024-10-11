import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';
import SignIn from './pages/authentications/SignIn.jsx';

import LayoutAdmin from './pages/systemMangement/LayoutAdmin.jsx';
import SignInAdmin from './pages/systemMangement/SignInAdmin.jsx';
import AdminHome from './pages/systemMangement/AdminHome.jsx';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="signin" element={<SignIn />} /> 
      </Route>

      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<AdminHome />} />
        <Route path="signin" element={<SignInAdmin />} />
      </Route>
      
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  //</StrictMode>
);