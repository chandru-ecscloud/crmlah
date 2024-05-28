// Import necessary dependencies
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import AdminHeader from "../components/common/AdminHeader";
import Dashboard from "../components/Dashboard";
import Leads from "../pages/Leads/Leads";
import LeadsCreate from "../pages/Leads/LeadsCreate";
import LeadsEdit from "../pages/Leads/LeadsEdit";
import LeadsShow from "../pages/Leads/LeadsShow";
import { ToastContainer } from "react-toastify";
import ContactsCreate from "../pages/Contact/ContactsCreate";
import ContactShow from "../pages/Contact/ContactShow";
import ContactEdit from "../pages/Contact/ContactEdit";
import Contacts from "../pages/Contact/Contacts";
import Deals from "../pages/Deals/Deals";
import DealsCreate from "../pages/Deals/DealsCreate";
import DealsEdit from "../pages/Deals/DealsEdit";
import DealsShow from "../pages/Deals/DealsShow";
import Products from "../pages/Products/Products";
import ProductCreate from "../pages/Products/ProductCreate";
import ProductsEdit from "../pages/Products/ProductsEdit";
import ProductsShow from "../pages/Products/ProductsShow";
import Accounts from "../pages/Accounts/Accounts";
import AccountsCreate from "../pages/Accounts/AccountsCreate";
import AccountsEdit from "../pages/Accounts/AccountsEdit";
import AccountsShow from "../pages/Accounts/AccountsShow";
import Quotes from "../pages/Quotes/Quotes";
import QuotesCreate from "../pages/Quotes/QuotesCreate";
import QuotesShow from "../pages/Quotes/QuotesShow";
import QuotesEdit from "../pages/Quotes/QuotesEdit";
import Invoices from "../pages/Invoice/Invoices";
import InvoicesCreate from "../pages/Invoice/InvoicesCreate";
import InvoicesEdit from "../pages/Invoice/InvoicesEdit";
import InvoicesShow from "../pages/Invoice/InvoicesShow";
import Page404 from "../components/common/404";
import ChangePassword from "../components/common/ChangePassword";
import Appointments from "../pages/Appointments/Appointments";
import AppointmentsCreate from "../pages/Appointments/AppointmentsCreate";
import AppointmentsEdit from "../pages/Appointments/AppointmentsEdit";
import AppointmentsShow from "../pages/Appointments/AppointmentsShow";
import Services from "../pages/Services/Services";
import ServicesCreate from "../pages/Services/ServicesCreate";
import ServicesEdit from "../pages/Services/ServicesEdit";
import ServicesShow from "../pages/Services/ServicesShow";
import Invoice from "../components/common/Invoice";
import ChangeRole from "../pages/Change_Role/ChangeRole";
import ChangeRoleShow from "../pages/Change_Role/ChangeRoleShow";
import ChangeRoleEdit from "../pages/Change_Role/ChangeRoleEdit";
import Dragable from "../pages/Dragable";
import Company from "../pages/Company/Company";
import CompanyCreate from "../pages/Company/CompanyCreate";
import CompanyEdit from "../pages/Company/CompanyEdit";
import CompanyShow from "../pages/Company/CompanyShow";
import User from "../pages/User/User";
import UserCreate from "../pages/User/UserCreate";
import UserEdit from "../pages/User/UserEdit";
import UserShow from "../pages/User/UserShow";
import Calender from "../pages/Calendar/Calender";
import CalenderEdit from "../pages/Calendar/CalenderEdit";
import CalenderShow from "../pages/Calendar/CalenderShow";

import AllClient from "../pages/AllClient";

function AdminLayout({ handleLogout }) {
  return (
    <BrowserRouter>
      <AdminHeader handleLogout={handleLogout} />
      <ScrollToTop />
      <ToastContainer position="top-center" />
      <Routes>
        {/*  Calendar  */}
        <Route path="/calendar" element={<Calender />} />
        <Route path="/calender/calenderedit/:id" element={<CalenderEdit />} />
        <Route path="/calender/calendershow/:id" element={<CalenderShow />} />

        <Route path="/dragable" element={<Dragable />} />
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

        {/* Company */}
        <Route path="/company" element={<Company />} />
        <Route path="/company/create" element={<CompanyCreate />} />
        <Route path="/company/edit/:id" element={<CompanyEdit />} />
        <Route path="/company/show/:id" element={<CompanyShow />} />

        {/* User */}
        <Route path="/users" element={<User />} />
        <Route path="/users/create" element={<UserCreate />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />
        <Route path="/users/show/:id" element={<UserShow />} />

        {/* Appointments  */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointments/create" element={<AppointmentsCreate />} />
        <Route path="/appointments/edit/:id" element={<AppointmentsEdit />} />
        <Route path="/appointments/show/:id" element={<AppointmentsShow />} />

        {/* Services  */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/create" element={<ServicesCreate />} />
        <Route path="/services/edit/:id" element={<ServicesEdit />} />
        <Route path="/services/show/:id" element={<ServicesShow />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/changepass" element={<ChangePassword />} />
        <Route path="/invoice" element={<Invoice />} />

        <Route path="/allclient" element={<AllClient />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AdminLayout;
