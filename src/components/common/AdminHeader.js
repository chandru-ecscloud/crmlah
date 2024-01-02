import React, { useState } from "react";
import "../../styles/dummy.css";
import { Link } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import CRMLogo from "../../assets/CRMLogo.png";
import User from "../../assets/user.png";
import { IoMdAdd } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
const menuItems = [
  { to: "/calls", label: "calls" },
  { to: "/meeting", label: "meeting" },
  { to: "/report", label: "report" },
  { to: "/task", label: "task" },
  { to: "/projects", label: "projects" },
  { to: "/services", label: "services" },
  { to: "/cases", label: "cases" },
  { to: "/vendor", label: "vendor" },
];

function AdminHeader({ handleLogout }) {
  const expand = "lg";
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => {
    setShow(false);
    setSearchTerm(""); // Clear search term when closing the dropdown
  };
  const handleShow = () => setShow(true);

  const filteredMenuItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
              <NavLink
                to="/home"
                exact
                activeClassName="actives"
                className="custom-nav-links"
              >
                Home
              </NavLink>

              <NavLink
                to="/lead"
                activeClassName="actives"
                className="custom-nav-links"
              >
                Leads
              </NavLink>

              <NavLink
                to="/"
                activeClassName="actives"
                className="custom-nav-links"
              >
                Contact
              </NavLink>

              <NavLink
                to="/"
                activeClassName="actives"
                className="custom-nav-links"
              >
                Accounts
              </NavLink>
              <NavLink
                to="/"
                activeClassName="actives"
                className="custom-nav-links"
              >
                Deals
              </NavLink>

              <NavLink
                to="/"
                activeClassName="actives"
                className="custom-nav-links"
              >
                Quotes
              </NavLink>

              <NavLink
                to="/"
                activeClassName="actives"
                className="custom-nav-links"
              >
                Products
              </NavLink>

              <NavLink
                to="/"
                activeClassName="actives"
                className="custom-nav-links"
              >
                Invoices
              </NavLink>

              <NavDropdown
                title="..."
                className="navDropdown"
                style={{ marginTop: "-7px" }}
              >
                <span>
                  <input
                    className="form-control"
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

              <NavDropdown title="+" className="navDropdowns">
                <NavDropdown.Item as={NavLink} to="/lead/create">
                  <IoMdAdd /> create Lead
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/contact/create">
                  <IoMdAdd /> create contact
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/account/create">
                  <IoMdAdd /> create account
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/deal/create">
                  <IoMdAdd /> create deal
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/quote/create">
                  <IoMdAdd /> create quote
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/product/create">
                  <IoMdAdd /> create product
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/invoice/create">
                  <IoMdAdd /> create invoice
                </NavDropdown.Item>
              </NavDropdown>
              <Nav
                className="custom-nav-links"
                style={{ fontSize: "20px" }}
                onClick={handleShow}
              >
                <FaUserCircle />
              </Nav>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column align-items-center ">
          <img className="img-fluid" src={User} alt="user" width={100} />
          <p>Users</p>
          <p>User Id:23457987</p>
          <p>ECS Cloud Infotech</p>
          <Link to="/" style={{ width: "100%" }}>
            <button
              className="btn btn-danger mb-3"
              onClick={handleLogout}
              style={{ width: "100%" }}
            >
              Logout
            </button>
          </Link>
          <button className="btn btn-primary" style={{ width: "100%" }}>
            Change Password
          </button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AdminHeader;
