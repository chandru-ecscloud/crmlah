import React, { useEffect } from "react";
import Header from "../components/User/Header";
import Footer from "../components/User/Footer";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import EntryAppointment from "../pages/EntryAppointment";
import Page404 from "../components/common/404";
import { FaWhatsapp } from "react-icons/fa";
import PrivacyAndPolicy from "../pages/PrivacyAndPolicy";
import EventRegister from "../pages/EventRegister";
import PaymentBuffer from "../pages/payment/PaymentBuffer";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentFailed from "../pages/payment/PaymentFailed";

function UserLayout({ handleLogin }) {
  const location = useLocation();

  const isHomeOrAbout =
    location.pathname === "/payment" ||
    location.pathname === "/payment-success" ||
    location.pathname === "/payment-failed" ||
    location.pathname === "/about" ||
    location.pathname === "/error";

  return (
    <>
      <ToastContainer position="top-center" />

      {!isHomeOrAbout && <Header />}

      <Routes>
        <Route path="/payment" element={<PaymentBuffer />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/about" element={<About />} />
        <Route path="/feature" element={<Feature />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/eventregister/:id" element={<EventRegister />} />
        <Route path="/" element={<Home handleLogin={handleLogin} />} />
        <Route path="/register" element={<SignIn />} />
        <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/emailsuccess" element={<EmailSuccess />} />
        <Route path="/CrmAppoinmentReschedule" element={<Schedule />} />
        <Route
          path="/CrmAppoinmentCancelschedule/:id"
          element={<CancelSchedule />}
        />
        <Route path="/entryappointment" element={<EntryAppointment />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/privacyandpolicy" element={<PrivacyAndPolicy />} />
      </Routes>

      {/* Conditionally render Footer based on the route */}
      {!isHomeOrAbout && <Footer />}

      <a
        href="https://api.whatsapp.com/send/?phone=916379086118&text=Hello! I visited your website.&type=phone_number&app_absent=0"
        class="float"
        target="_blank"
        rel="noreferrer"
      >
        <FaWhatsapp />
      </a>
    </>
  );
}

export default UserLayout;
