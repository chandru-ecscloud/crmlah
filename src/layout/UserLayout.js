import React from "react";
import Header from "../components/User/Header";
import Footer from "../components/User/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Contact from "../components/User/Contact";
import Home from "../components/User/Home";
import About from "../components/User/About";
import Feature from "../components/User/Feature";
import Schedule from "../components/common/Schedule";
import { CancelSchedule } from "../components/common/CancelSchedule";
import SignIn from "../components/common/Signin";
import LogIn from "../components/common/LogIn";
import Forgot from "../components/common/Forgot";
import EmailSuccess from "../components/common/EmailSuccess";
import "../styles/user.css";
import { ToastContainer } from "react-toastify";

// import About from "../Components/About";
// import Feature from "../Components/Feature";
// import Contact from "../Components/Contact";

function UserLayout({ handleLogin }) {
  return (
    <>
      <BrowserRouter>
        <ToastContainer position="top-center" />
        <Header />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/feature" element={<Feature />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<SignIn />} />
          <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/emailsuccess" element={<EmailSuccess />} />
          <Route path="/Crm_Appoinment_Reschedule/:id" element={<Schedule />} />
          <Route
            path="/Crm_Appoinment_Cancelschedule/:id"
            element={<CancelSchedule />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default UserLayout;
