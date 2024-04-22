import React from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Offcanvas from "react-bootstrap/Offcanvas";
// import Logo from "../../assets/EcsWebsiteLogo.png";
import Logo from "../../assets/WebsiteLogo.png";
import "../../styles/user.css";


function Header() {
  const expand = "lg";
  // useLocation();
  return (
    <>
      {["lg"].map((expand) => (
        <Navbar key={expand} expand={expand} className="navBar-CRM">
          <Container fluid>
            <Navbar>
              <Navbar.Brand as={Link} to="/home">
                <img
                  src={Logo}
                  alt="WWG"
                  className="img-fluid"
                  style={{ maxWidth: "250px", maxHeight: "100px" }}
                />
              </Navbar.Brand>
            </Navbar>
            {/* <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand> */}
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  CRMLAH 
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-center align-items-center flex-grow-1 pe-3 gap-4 ">
                  <NavLink
                    to="/about"
                    activeClassName="active"
                    className="headers"
                   
                  >
                    About
                  </NavLink>
                  {/* <NavLink  
                  to="/home"
                   exact
                   activeClassName="active"
                   className="custom-nav-link text-primary"
                   style={{
                     color: "rgba(0, 0, 0, 0.85)",
                     textDecoration: "none",
                   }}>Home</NavLink> */}
                   <NavLink
                    to="/feature"
                    activeClassName="active"
                    className="headers"
                    
                  >
                    Features
                  </NavLink>
                  <NavLink
                    to="/contact"
                    activeClassName="active"
                    className="headers"
                   
                  >
                    Contact
                  </NavLink>
                  
                  {/* <NavDropdown
                    title="Dropdown"
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
                </Nav>
                <Form className="d-flex">
                  {/* <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  /> */}
                  <Nav className="d-flex py-2">
                    <Link to="/login">
                      <button className="btn donateBtn">Sign In</button>
                    </Link>
                    <Link to="/register">
                      <button className="btn volunteerBtn">Sign Up</button>
                    </Link>
                  </Nav>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default Header;
