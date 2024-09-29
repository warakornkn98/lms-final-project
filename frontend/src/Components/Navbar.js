import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const user = { profileImage: null };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Define an array of links with their paths
  const navLinks = [
    { path: "/", label: "หน้าแรก" },
    { path: "/books", label: "หนังสือ" },
    { path: "/admin", label: "จัดการหนังสือ" },
    { path: "/admin/borrow", label: "ยืม-คืนหนังสือ" },
    { path: "/admin/dashboard", label: "แดชบอร์ด" },
  ];

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Left-aligned Logo and Title */}
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src="https://scontent.fhdy4-1.fna.fbcdn.net/v/t39.30808-6/305750002_517929943669031_5114541724667780409_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG9ZSP4cXfGcA5WKozodLE0tt3tz6Goczu23e3PoahzO57Xtxh3w1ZMpJWzlEErOZVmqedVzJbbZUtnOKXf84tL&_nc_ohc=xkuQj9kUQV0Q7kNvgFoXPFT&_nc_ht=scontent.fhdy4-1.fna&_nc_gid=AM_fEEnW69jc3YkCleNMIb1&oh=00_AYBsabZC6iqkgJHOaQHWnugWxssH9T2XHbVxjQs7sXkFng&oe=66FE68C6"
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="Logo"
          />
          <span className="ms-2 d-none d-lg-block">ห้องสมุดวิทยาลัยเทคนิคปัตตานี</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Menu items */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.path}
                href={link.path}
                active={location.pathname === link.path}
                disabled={location.pathname === link.path} // Disable if the path matches
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Right-aligned menu items */}
          <Nav className="d-flex align-items-center">
            <NavDropdown
              title={
                <img
                  src={
                    user.profileImage
                      ? user.profileImage
                      : "https://via.placeholder.com/40x40.png?text=User" // Placeholder image if no profile picture
                  }
                  alt="Profile"
                  width="40"
                  height="40"
                  className="rounded-circle" // Makes the image circular
                />
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
