import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyNavbar = () => {
  const navigate = useNavigate();
    const user = ({profileImage:null});
  const handleLogout = () => {
    // Clear token from localStorage (or handle session cleanup)
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Logo */}
        <Navbar.Brand href="/">
          <img
            src="/path-to-logo.png" // ใส่ path โลโก้ที่ต้องการ
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>

        {/* Toggle button for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Menu items */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* ทำให้เมนูไปอยู่ฝั่งขวา */}
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>

            {/* Dropdown สำหรับโปรไฟล์ */}
            <NavDropdown
              title={
                <img
                  src={
                    user.profileImage
                      ? user.profileImage
                      : "https://via.placeholder.com/40x40.png?text=User" // Placeholder ถ้าไม่มีรูปภาพ
                  }
                  alt="Profile"
                  width="40"
                  height="40"
                  className="rounded-circle" // ทำให้รูปเป็นวงกลม
                />
              }
              id="basic-nav-dropdown"
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

export default MyNavbar;
