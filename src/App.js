// Import necessary dependencies
import React, { useEffect, useState } from "react";
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
import AdminHeader from "./components/common/AdminHeader";
import Dashboard from "./components/Dashboard";
import Leads from "./pages/Leads/Leads";
import LeadsCreate from "./pages/Leads/LeadsCreate";
import LeadsEdit from "./pages/Leads/LeadsEdit";
import LeadsShow from "./pages/Leads/LeadsShow";
import { ToastContainer, toast } from "react-toastify";
import EmailSuccess from "./components/common/EmailSuccess";
import ContactsCreate from "./pages/Contact/ContactsCreate";
import ContactShow from "./pages/Contact/ContactShow";
import ContactEdit from "./pages/Contact/ContactEdit";
import Contacts from "./pages/Contact/Contacts";
import Deals from "./pages/Deals/Deals";
import DealsCreate from "./pages/Deals/DealsCreate";
import DealsEdit from "./pages/Deals/DealsEdit";
import DealsShow from "./pages/Deals/DealsShow";
import Products from "./pages/Products/Products";
import ProductCreate from "./pages/Products/ProductCreate";
import ProductsEdit from "./pages/Products/ProductsEdit";
import ProductsShow from "./pages/Products/ProductsShow";
import Accounts from "./pages/Accounts/Accounts";
import AccountsCreate from "./pages/Accounts/AccountsCreate";
import AccountsEdit from "./pages/Accounts/AccountsEdit";
import AccountsShow from "./pages/Accounts/AccountsShow";
import Quotes from "./pages/Quotes/Quotes";
import QuotesCreate from "./pages/Quotes/QuotesCreate";
import QuotesShow from "./pages/Quotes/QuotesShow";
import QuotesEdit from "./pages/Quotes/QuotesEdit";
import Invoices from "./pages/Invoice/Invoices";
import InvoicesCreate from "./pages/Invoice/InvoicesCreate";
import InvoicesEdit from "./pages/Invoice/InvoicesEdit";
import InvoicesShow from "./pages/Invoice/InvoicesShow";
import Page404 from "./components/common/404";
import ChangePassword from "./components/common/ChangePassword";
import Appointments from "./pages/Appointments/Appointments";
import AppointmentsCreate from "./pages/Appointments/AppointmentsCreate";
import AppointmentsEdit from "./pages/Appointments/AppointmentsEdit";
import AppointmentsShow from "./pages/Appointments/AppointmentsShow";
import Services from "./pages/Services/Services";
import ServicesCreate from "./pages/Services/ServicesCreate";
import ServicesEdit from "./pages/Services/ServicesEdit";
import ServicesShow from "./pages/Services/ServicesShow";
import axios from "axios";
import Invoice from "./components/common/Invoice";
import ChangeRole from "./pages/Change_Role/ChangeRole";
import ChangeRoleShow from "./pages/Change_Role/ChangeRoleShow";
import ChangeRoleEdit from "./pages/Change_Role/ChangeRoleEdit";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    sessionStorage.setItem("isAdmin", true);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    sessionStorage.setItem("isAdmin", false);
    sessionStorage.removeItem("company_id");
    sessionStorage.removeItem("user_name");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    setIsAdmin(false);
  };

  useEffect(() => {
    const isAdminFromStorage = sessionStorage.getItem("isAdmin");
    const isAdminBoolean = isAdminFromStorage === "true";
    if (isAdmin !== isAdminBoolean) {
      setIsAdmin(isAdminBoolean);
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,

      (error) => {
        // console.log("Error is", error.response);
        if (error.response?.status === 401) {
          toast.warning("Session Experied!! Please Login");
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      {isAdmin ? "" : <Topbar />}
      {isAdmin ? <AdminHeader handleLogout={handleLogout} /> : <Header />}
      <ScrollToTop />
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<Product />} />
        <Route path="/register" element={<SignIn />} />
        <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/emailsuccess" element={<EmailSuccess />} />

        {isAdmin && (
          <>
            {/* Lead   */}
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/create" element={<LeadsCreate />} />
            <Route path="/leads/edit/:id" element={<LeadsEdit />} />
            <Route path="/leads/show/:id" element={<LeadsShow />} />

            {/* contact  */}
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/create" element={<ContactsCreate />} />
            <Route path="/contacts/edit/:id" element={<ContactEdit />} />
            <Route path="/contacts/show/:id" element={<ContactShow />} />

            {/* Accounts  */}
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/create" element={<AccountsCreate />} />
            <Route path="/accounts/edit/:id" element={<AccountsEdit />} />
            <Route path="/accounts/show/:id" element={<AccountsShow />} />

            {/* Deal  */}
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/create" element={<DealsCreate />} />
            <Route path="/deals/edit/:id" element={<DealsEdit />} />
            <Route path="/deals/show/:id" element={<DealsShow />} />

            {/* Product  */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/create" element={<ProductCreate />} />
            <Route path="/products/edit/:id" element={<ProductsEdit />} />
            <Route path="/products/show/:id" element={<ProductsShow />} />

            {/* Quotes  */}
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/create" element={<QuotesCreate />} />
            <Route path="/quotes/edit/:id" element={<QuotesEdit />} />
            <Route path="/quotes/show/:id" element={<QuotesShow />} />

            {/* Invoice  */}
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/create" element={<InvoicesCreate />} />
            <Route path="/invoices/edit/:id" element={<InvoicesEdit />} />
            <Route path="/invoices/show/:id" element={<InvoicesShow />} />

            {/* Change Role  */}
            <Route path="/changerole" element={<ChangeRole />} />
            <Route path="/changerole/show/:id" element={<ChangeRoleShow />} />
            <Route path="/changerole/edit/:id" element={<ChangeRoleEdit />} />

            {/* Appointments  */}
            <Route path="/appointments" element={<Appointments />} />
            <Route
              path="/appointments/create"
              element={<AppointmentsCreate />}
            />
            <Route
              path="/appointments/edit/:id"
              element={<AppointmentsEdit />}
            />
            <Route
              path="/appointments/show/:id"
              element={<AppointmentsShow />}
            />

            {/* Services  */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/create" element={<ServicesCreate />} />
            <Route path="/services/edit/:id" element={<ServicesEdit />} />
            <Route path="/services/show/:id" element={<ServicesShow />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/changepass" element={<ChangePassword />} />
            <Route path="/invoice" element={<Invoice />} />
          </>
        )}

        <Route path="*" element={<Page404 />} />
      </Routes>
      {isAdmin ? "" : <Footer />}
    </BrowserRouter>
  );
}

export default App;
