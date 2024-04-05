// Import necessary dependencies
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
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

function PrivateRoute({ children, ...rest }) {
  const isAuthenticated = sessionStorage.getItem("token");

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: rest.location.pathname }} replace />
  );
}

function Route() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    sessionStorage.setItem("isAdmin", true);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    sessionStorage.setItem("isAdmin", false);
    sessionStorage.removeItem("company_id");
    sessionStorage.removeItem("user_name");
    sessionStorage.removeItem("token");
    setIsAdmin(false);
  };

  useEffect(() => {
    const isAdminFromStorage = sessionStorage.getItem("isAdmin");
    const isAdminBoolean = isAdminFromStorage === "true";
    if (isAdmin !== isAdminBoolean) {
      setIsAdmin(isAdminBoolean);
    }

    // Add a response interceptor to catch 401 responses
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.warning("Unauthorized User Please Login");
          handleLogout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Remove the interceptor when component unmounts
      axios.interceptors.response.eject(interceptor);
    };
  }, [isAdmin]);

  return (
    <>
      <BrowserRouter>
        {isAdmin ? "" : <Topbar />}
        {isAdmin ? <AdminHeader handleLogout={handleLogout} /> : <Header />}
        <ScrollToTop />
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Product />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<LogIn handleLogin={handleLogin} />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/emailsuccess" element={<EmailSuccess />} />

          {isAdmin && (
            <>
              <Route
                path="/lead/*"
                element={
                  <PrivateRoute>
                    <Routes>
                      <Route path="/" element={<Leads />} />
                      <Route path="create" element={<LeadsCreate />} />
                      <Route path="edit/:id" element={<LeadsEdit />} />
                      <Route path="show/:id" element={<LeadsShow />} />
                    </Routes>
                  </PrivateRoute>
                }
              />

              <Route
                path="/contacts/*"
                element={
                  <PrivateRoute>
                    <Routes>
                      <Route path="/" element={<Contacts />} />
                      <Route path="create" element={<ContactsCreate />} />
                      <Route path="edit/:id" element={<ContactEdit />} />
                      <Route path="show/:id" element={<ContactShow />} />
                    </Routes>
                  </PrivateRoute>
                }
              />

              {/* <PrivateRoute path="/lead" element={<Leads />} />
              <PrivateRoute path="/lead/create" element={<LeadsCreate />} />
              <PrivateRoute path="/lead/edit/:id" element={<LeadsEdit />} />
              <PrivateRoute path="/lead/show/:id" element={<LeadsShow />} />

              <PrivateRoute path="/contacts" element={<Contacts />} />
              <PrivateRoute
                path="/contacts/create"
                element={<ContactsCreate />}
              />
              <PrivateRoute
                path="/contacts/edit/:id"
                element={<ContactEdit />}
              />
              <PrivateRoute
                path="/contacts/show/:id"
                element={<ContactShow />}
              />

              <PrivateRoute path="/account" element={<Accounts />} />
              <PrivateRoute
                path="/account/create"
                element={<AccountsCreate />}
              />
              <PrivateRoute
                path="/account/edit/:id"
                element={<AccountsEdit />}
              />
              <PrivateRoute
                path="/account/show/:id"
                element={<AccountsShow />}
              />

              <PrivateRoute path="/deal" element={<Deals />} />
              <PrivateRoute path="/deal/create" element={<DealsCreate />} />
              <PrivateRoute path="/deal/edit/:id" element={<DealsEdit />} />
              <PrivateRoute path="/deal/show/:id" element={<DealsShow />} />

              <PrivateRoute path="/product" element={<Products />} />
              <PrivateRoute
                path="/product/create"
                element={<ProductCreate />}
              />
              <PrivateRoute
                path="/product/edit/:id"
                element={<ProductsEdit />}
              />
              <PrivateRoute
                path="/product/show/:id"
                element={<ProductsShow />}
              />

              <PrivateRoute path="/quote" element={<Quotes />} />
              <PrivateRoute path="/quote/create" element={<QuotesCreate />} />
              <PrivateRoute path="/quote/edit/:id" element={<QuotesEdit />} />
              <PrivateRoute path="/quote/show/:id" element={<QuotesShow />} />

              <PrivateRoute path="/invoice" element={<Invoices />} />
              <PrivateRoute
                path="/invoice/create"
                element={<InvoicesCreate />}
              />
              <PrivateRoute
                path="/invoice/edit/:id"
                element={<InvoicesEdit />}
              />
              <PrivateRoute
                path="/invoice/show/:id"
                element={<InvoicesShow />}
              />

              <PrivateRoute path="/appointment" element={<Appointments />} />
              <PrivateRoute
                path="/appointment/create"
                element={<AppointmentsCreate />}
              />
              <PrivateRoute
                path="/appointment/edit/:id"
                element={<AppointmentsEdit />}
              />
              <PrivateRoute
                path="/appointment/show/:id"
                element={<AppointmentsShow />}
              />

              <PrivateRoute path="/services" element={<Services />} />
              <PrivateRoute
                path="/services/create"
                element={<ServicesCreate />}
              />
              <PrivateRoute
                path="/services/edit/:id"
                element={<ServicesEdit />}
              />
              <PrivateRoute
                path="/services/show/:id"
                element={<ServicesShow />}
              /> */}
              {/* 
              <PrivateRoute path="/dashboard" element={<Dashboard />} />
              <PrivateRoute path="/changepass" element={<ChangePassword />} /> */}
            </>
          )}

          <Route path="*" element={<Page404 />} />
        </Routes>
        {isAdmin ? "" : <Footer />}
      </BrowserRouter>
    </>
  );
}

export default Route;
