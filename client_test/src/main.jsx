import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

import SignIn from './pages/SignIn.jsx';

const Router = () => {
  return (
    <Routes>

        <Route path="signin" element={<SignIn />} />

    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </StrictMode>
);
