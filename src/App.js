import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import Topbar from "./components/common/Topbar";
import Home from "./pages/Home";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import SignIn from "./components/common/Signin";
import LogIn from "./components/common/LogIn";
import Forgot from "./components/common/Forgot";
// import Header_1 from "./components/common/Header_1";
import LeadsTab from "./components/Leads/LeadsTab";


function App() {
  return (
    <>
      <BrowserRouter>
        <Topbar />
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product" element={<Product />} />
          <Route path="/signin" element={<SignIn />} /> 
          <Route path="/login" element={<LogIn />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/lead" element={<LeadsTab />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
