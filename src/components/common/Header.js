import React from "react";
import { Navbar, Container, Nav, Offcanvas } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../../styles/custom.css";
import Logo from "../../assets/Logo.png";

function Header() {
  const expand = "lg";
  useLocation();
  return (
    <>
      <Navbar expand={expand} className="bg-body-tertiary header ">
        <Container fluid>
          <Navbar.Brand href="#">
            <img src={Logo} alt="WWG" className="img-fluid" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                ECS CRMLAH
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1 pe-3">
                <NavLink
                  to="/"
                  exact
                  activeClassName="active"
                  className="custom-nav-link"
                  style={{
                    color: "rgba(0, 0, 0, 0.85)",
                    textDecoration: "none",
                  }}
                >
                  Home
                </NavLink>

                {/* <NavDropdown
                  title="Service"
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown> */}

                <NavLink
                  to="/products"
                  activeClassName="active"
                  className="custom-nav-link"
                  style={{
                    color: "rgba(0, 0, 0, 0.85)",
                    textDecoration: "none",
                  }}
                >
                  Products
                </NavLink>

                <NavLink
                  to="/contacts"
                  activeClassName="active"
                  className="custom-nav-link"
                  style={{
                    color: "rgba(0, 0, 0, 0.85)",
                    textDecoration: "none",
                  }}
                >
                  Contact Us
                </NavLink>
              </Nav>
              <Nav className="d-flex" style={{ padding: "20px 0" }}>
                <Link to="/login">
                  <button className="btn donateBtn">Sign In</button>
                </Link>
                <Link to="/register">
                  <button className="btn volunteerBtn">Sign </button>
                </Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
