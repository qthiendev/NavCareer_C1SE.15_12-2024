import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';

import Home from "./pages/Home";
import SignIn from "./pages/authentications/SingIn";
import Layout from "./pages/Layout";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Router />);
