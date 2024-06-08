import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [expanded, setExpanded] = useState(false); // State to manage navbar collapse

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setExpanded(false); // Collapse the navbar after logout
  };

  const handleToggle = () => {
    setExpanded(!expanded); // Toggle the navbar state
  };

  return (
    <Navbar
      className="container navbar-container"
      expand="lg"
      expanded={expanded} // Bind state to expanded prop
      onToggle={handleToggle}
    >
      <Container>
        {location.pathname === "/dashboard" ? (
          <Navbar.Brand>Instagram Scraper</Navbar.Brand>
        ) : (
          <Navbar.Brand as={Link} to="/">
            Instagram Scraper
          </Navbar.Brand>
        )}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleToggle}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Conditionally render Login/Signup buttons */}
            {!token && (
              <>
                {location.pathname !== "/login" && (
                  <Nav.Link
                    as={Link}
                    to="/login"
                    onClick={() => setExpanded(false)}
                  >
                    Login
                  </Nav.Link>
                )}
                {location.pathname !== "/signup" && (
                  <Nav.Link
                    as={Link}
                    to="/signup"
                    onClick={() => setExpanded(false)}
                  >
                    Signup
                  </Nav.Link>
                )}
              </>
            )}
            {token && (
              <Button variant="link" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
