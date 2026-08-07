import React, {useEffect, useState} from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {LOCAL_STORAGE_KEYS} from "./components/API_URL.jsx";
import './App.css';

// import Pages
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/loggedPages/home/Home.jsx";
import Lesson from "./pages/loggedPages/lesson/Lesson.jsx";
import Practice from "./pages/loggedPages/practice/Practice.jsx";
import Progress from "./pages/loggedPages/progress/Progress.jsx";
import Admin from "./pages/admin/Admin.jsx";
import AuthWrapper from "./components/AuthWrapper.jsx";

// Not Logged
import HomeNotLogged from "./pages/notLoggedPages/Home.jsx";
import Auth from "./pages/auth/Auth.jsx";
import VerifyMail from "./pages/auth/verifyEmail/VerifyMail.jsx";
import ForgetPass from "./pages/auth/forgetPassword/ForgetPass.jsx";
import ResetPass from "./pages/auth/forgetPassword/ResetPass.jsx";
import LoginSuc from "./pages/auth/loginGoogle/LoginSuc.jsx";
import Profile from "./pages/user/profile/Profile.jsx";
import Setting from "./pages/user/setting/Setting.jsx";

function App() {
    const userInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const isLogged = !!userInfo;

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={isLogged ? <Navigate to="/home" replace /> : <HomeNotLogged />} />
              <Route path="/auth" element={isLogged ? <Navigate to="/home" replace /> : <Auth />} />
              <Route path="/verify" element={isLogged ? <Navigate to="/home" replace /> : <VerifyMail />} />
              <Route path="/forget" element={isLogged ? <Navigate to="/home" replace /> : <ForgetPass />} />
              <Route path="/reset" element={isLogged ? <Navigate to="/home" replace /> : <ResetPass />} />
              <Route path="/google" element={isLogged ? <Navigate to="/home" replace /> : <LoginSuc />} />

              <Route element={<ProtectedRoute allowedRoles={['USER']}/>}>
                  <Route element={<AuthWrapper />}>
                      <Route element={<Layout />}>
                          <Route path="/home" element={<Home />} />
                          <Route path="/lessons" element={<Lesson />} />
                          <Route path="/practice" element={<Practice />} />
                          <Route path="/progress" element={<Progress />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/setting" element={<Setting />} />
                      </Route>
                  </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']}/>}>
                  <Route path="/admin" element={<Admin/>}/>
              </Route>

              {/*<Route path="*" element={<Navigate to="/" replace />} />*/}
          </Routes>
      </BrowserRouter>
  )
}

export default App
