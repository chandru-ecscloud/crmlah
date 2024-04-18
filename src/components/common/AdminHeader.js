import React, { useState } from "react";
import "../../styles/dummy.css";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CRMLogo from "../../assets/CRMLogo.png";
import User from "../../assets/user.png";
import { IoMdAdd, IoMdAddCircleOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Tooltip, Zoom } from "@mui/material";
import { AiOutlineEllipsis } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { IoSettings } from "react-icons/io5";
import { BsBuildingAdd } from "react-icons/bs";
import { IoPersonAdd } from "react-icons/io5";
const menuItems = [
  // { to: "/calls", label: "calls" },
  // { to: "/meeting", label: "meeting" },
  // { to: "/report", label: "report" },
  // { to: "/task", label: "task" },
  { to: "/calender", label: "Calender" },
  // { to: "/projects", label: "projects" },
  { to: "/quotes", label: "Quotes" },
  { to: "/products", label: "Products" },
  { to: "/invoices", label: "Invoices" },
  { to: "/services", label: "Services" },
  // { to: "/cases", label: "cases" },
  // { to: "/vendor", label: "vendor" },
];

const mainMenu = [
  { to: "/dashboard", label: "Home" },
  { to: "/leads", label: "Leads" },
  { to: "/contacts", label: "Contacts" },
  { to: "/accounts", label: "Accounts" },
  { to: "/deals", label: "Deals" },
  { to: "/dragable", label: "Sales" },
  { to: "/appointments", label: "Appointments" },
  // { to: "/company", label: "Company" },
];

function AdminHeader({ handleLogout }) {
  const expand = "lg";
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // const company_name = sessionStorage.getItem("company_name");
  const user_name = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");

  const handleClose = () => {
    setShow(false);
    setSearchTerm("");
  };
  const handelNavigate = () => {
    navigate("/users");
    handleClose();
  };
  const handleShow = () => setShow(true);

  const filteredMenuItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handelLogoutClick = () => {
    handleLogout();
    navigate("/");
    handleClose();
  };
  return (
    <>
      <Navbar expand={expand} className="adminNavbar">
        <Container fluid>
          <Navbar.Brand href="#">
            <img src={CRMLogo} alt="WWG" className="img-fluid" width={"50px"} />
            &nbsp;&nbsp;
            <span style={{ color: "#fff", fontWeight: "bolder" }}>CRM</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`navbar-expand-${expand}`} />
          <Navbar.Collapse id={`navbar-expand-${expand}`}>
            <Nav className=" flex-grow-1 pe-3">
              {mainMenu.map((menuItem) => (
                <NavLink
                  key={menuItem.to}
                  to={menuItem.to}
                  exact
                  activeClassName="actives"
                  className="custom-nav-links"
                >
                  {menuItem.label}
                </NavLink>
              ))}

              <Tooltip TransitionComponent={Zoom} title="Other Modules">
                <NavDropdown
                  title={<AiOutlineEllipsis className="text-white " />}
                  className="navDropdown"
                  style={{marginTop:"7px"}}
                >
                  <span>
                    <input
                      className="form-control mx-1"
                      style={{ width: "95%" }}
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </span>

                  {filteredMenuItems.map((menuItem) => (
                    <NavDropdown.Item
                      as={NavLink}
                      to={menuItem.to}
                      key={menuItem.to}
                    >
                      {menuItem.label}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              </Tooltip>

              <Tooltip TransitionComponent={Zoom} title="Creat Menus">
                <NavDropdown
                  title={<FiPlus className="text-white fs-5 mt-2" />}
                  className="navDropdowns"
                >
                  <NavDropdown.Item as={NavLink} to="/leads/create">
                    <IoMdAdd /> create Lead
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/contacts/create">
                    <IoMdAdd /> create contact
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/accounts/create">
                    <IoMdAdd /> create account
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/deals/create">
                    <IoMdAdd /> create deal
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/quotes/create">
                    <IoMdAdd /> create quote
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/products/create">
                    <IoMdAdd /> create product
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/invoices/create">
                    <IoMdAdd /> create invoice
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item as={NavLink} to="/company/companycreate">
                    <IoMdAdd /> create company
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/users/create">
                    <IoMdAdd /> create User
                  </NavDropdown.Item> */}
                </NavDropdown>
              </Tooltip>

              <Tooltip TransitionComponent={Zoom} title="Profile">
                <Nav
                  className="custom-nav-links"
                  style={{ fontSize: "20px",paddingTop:"8px"}}
                  onClick={handleShow}
                >
                  <FaUserCircle style={{ cursor: "pointer" }} />
                </Nav>
              </Tooltip>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton className="d-flex align-items-center ">
          {(role === "CRM_SUPERADMIN" || role === "CMP_OWNER" || role === "CRM_ADMIN")&&  (
            <div>
              <button className="btn" onClick={handelNavigate}>
                <IoPersonAdd /> User
              </button>
            </div>
          ) }
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column align-items-center ">
          {/* <button onClick={handelNavigate}>
            Add user</button> */}

          <img className="img-fluid" src={User} alt="user" width={100} />
          <p>Users</p>
          {/* <p>Company Name : {company_name}</p> */}
          <p>User Name : {user_name}</p>

          <button
            onClick={handelLogoutClick}
            className="btn btn-danger mb-3"
            style={{ width: "100%" }}
          >
            Logout
          </button>
          <Link to="/changepass" style={{ width: "100%" }}>
            <button className="btn btn-primary" style={{ width: "100%" }}>
              Change Password
            </button>
          </Link>

          <div className="d-flex gap-3 align-items-end align-self-start h-100">
            {(role === "CRM_SUPERADMIN" || role==="CRM_ADMIN") && (
              <div className="">
                <Link to="/company">
                  <button className="btn" onClick={handleClose}>
                    <BsBuildingAdd className="mx-1" />
                    &nbsp; Add Company
                  </button>
                </Link>
              </div>
            )}

            {(role === "CRM_SUPERADMIN" || role==="CRM_ADMIN") && (
              <div className="">
                <Link to="/changerole">
                  <button className="btn" onClick={handleClose}>
                    <IoSettings className="mx-1" /> Change Role
                  </button>
                </Link>
              </div>
            ) }
          </div>

          {/* <div className="d-flex align-items-end align-self-end h-100">
            <Link to="/changerole">
              <button className="btn" onClick={handleClose}>
                <IoSettings className="mx-1" /> Change Role
              </button>
            </Link>
          </div> */}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AdminHeader;
