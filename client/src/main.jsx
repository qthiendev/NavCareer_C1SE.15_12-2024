import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';

import SignIn from './pages/authentication/SignIn.jsx';
import SignUp from './pages/authentication/SignUp.jsx';

import Search from './pages/utilities/Search.jsx';

import AdminHome from './pages/manageSystem/AdminHome.jsx';
import ViewAllUser from './pages/manageSystem/ViewAllUser.jsx';
import ModifyUser from './pages/manageSystem/ModifyUser.jsx';
import UserFunctionGeneral from './pages/manageSystem/UserFunctionGeneral.jsx';
import UserFunctionESP from './pages/manageSystem/UserFunctionESP.jsx';

import CreateProfile from './pages/profile/CreateProfile.jsx';
import UpdateProfile from './pages/profile/UpdateProfile.jsx';
import ViewProfile from './pages/profile/ViewProfile.jsx';

import ViewCourse from './pages/course/ViewCourse.jsx';
import CreateCourse from './pages/course/CreateCourse.jsx';
import UpdateCourse from './pages/course/UpdateCourse.jsx';

import ESPHome from './pages/course/ESPHome.jsx';
import ViewAllCourse from './pages/course/ViewAllCourse.jsx';

import Payment from './pages/learning/Payment.jsx';
import PaymentCheck from './pages/learning/PaymentCheck.jsx';
import ReadEnrollment from './pages/learning/ReadEnrollment.jsx';
import ReadCollection from './pages/learning/ReadCollection.jsx';
import Accomplishment from './pages/learning/Accomplishment.jsx';
import AccomplishmentByID from './pages/learning/AccomplishmentByID.jsx';

import Servey from './pages/utilities/servey/servey.jsx';
const Router = () => {
    return (
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />

          <Route path="signin" element={<SignIn />} /> 
          <Route path="signup" element={<SignUp />} /> 

          <Route path="search" element={<Search />} /> 

          <Route path="admin" element={<AdminHome />} /> 
          <Route path="admin/user/view-all" element={<ViewAllUser />} />
          <Route path="admin/user/modify" element={<ModifyUser />} />
          <Route path="admin/user/function/general" element={<UserFunctionGeneral />} />
          <Route path="admin/user/function/esp" element={<UserFunctionESP />} />

          <Route path="profile/:user_id/" element={<ViewProfile />} />
          <Route path="profile/update" element={<UpdateProfile />} /> 
          <Route path="profile/create" element={<CreateProfile />} /> 

          <Route path="course/:course_id" element={<ViewCourse />} />

          <Route path="esp" element={<ESPHome />} /> 
          <Route path="esp/course/view-all" element={<ViewAllCourse />} /> 
          <Route path="esp/course/:course_id/update" element={<UpdateCourse />} /> 
          <Route path="esp/course/create" element={<CreateCourse />} /> 

          <Route path="edu/" element={<ReadEnrollment />} /> 
          <Route path="edu/payment" element={<Payment />} /> 
          <Route path="edu/payment/check" element={<PaymentCheck />} /> 
          <Route path="edu/collection" element={<ReadCollection />} /> 
<<<<<<< HEAD
=======
          <Route path="cert/find" element={<AccomplishmentByID />} /> 
          <Route path="cert/:certificate_id" element={<Accomplishment />} /> 

          <Route path='chatbot' element={<Chatbot />} />
>>>>>>> 34fcaa8824541f9201c565f18d4d8c78b4a333bc
          <Route path='servey' element={<Servey />} />

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