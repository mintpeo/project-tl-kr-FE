import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Pages
import Layout from "./components/Layout.jsx";
import Home from "./pages/home/Home.jsx";
import Lesson from "./pages/lesson/Lesson.jsx";
import Practice from "./pages/practice/Practice.jsx";
import Progress from "./pages/progress/Progress.jsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/lessons" element={<Lesson />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/progress" element={<Progress />} />
              </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
