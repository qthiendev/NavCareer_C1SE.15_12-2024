import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';

import SignIn from './pages/authentication/SignIn.jsx';
import SignUp from './pages/authentication/SignUp.jsx';

import AdminHome from './pages/administrator/AdminHome.jsx';
import ViewAllUser from './pages/administrator/ViewAllUser.jsx';

import CreateProfile from './pages/profile/CreateProfile.jsx';
import UpdateProfile from './pages/profile/UpdateProfile.jsx';
import ViewProfile from './pages/profile/ViewProfile.jsx';

import CreateCourse from './pages/course/CreateCourse.jsx';
import UpdateCourse from './pages/course/UpdateCourse.jsx';
import ViewCourse from './pages/course/ViewCourse.jsx';

const Router = () => {
    return (
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />

          <Route path="signin" element={<SignIn />} /> 
          <Route path="signup" element={<SignUp />} /> 

          <Route path="admin" element={<AdminHome />} /> 
          <Route path="admin/user/view-all" element={<ViewAllUser />} />

          <Route path="/profile/view/:user_id" element={<ViewProfile />} />
          <Route path="profile/update/:user_id" element={<UpdateProfile />} /> 
          <Route path="profile/create" element={<CreateProfile />} /> 

          <Route path="course/view" element={<ViewCourse />} />
          <Route path="course/update" element={<UpdateCourse />} /> 
          <Route path="course/create" element={<CreateCourse />} /> 

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