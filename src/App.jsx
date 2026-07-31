import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// import Pages
import Layout from "./components/Layout.jsx";
import Home from "./pages/loggedPages/home/Home.jsx";
import Lesson from "./pages/loggedPages/lesson/Lesson.jsx";
import Practice from "./pages/loggedPages/practice/Practice.jsx";
import Progress from "./pages/loggedPages/progress/Progress.jsx";

// Not Logged
import HomeNotLogged from "./pages/notLoggedPages/Home.jsx";
import Auth from "./pages/auth/Auth.jsx";
import {LOCAL_STORAGE_KEYS} from "./components/API_URL.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    const isLogged = !!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO));

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={isLogged ? <Navigate to="/home" replace /> : <HomeNotLogged />} />
              <Route path="/auth" element={isLogged ? <Navigate to="/home" replace /> : <Auth />} />

              <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                      <Route path="/home" element={<Home />} />
                      <Route path="/lessons" element={<Lesson />} />
                      <Route path="/practice" element={<Practice />} />
                      <Route path="/progress" element={<Progress />} />
                  </Route>
              </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
