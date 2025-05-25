import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Header.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  // State to track which section is active (including dropdown items)
  const [activeSection, setActiveSection] = useState(null);

  // Handler for main links (like Home)
  const handleMainLinkClick = (section) => {
    setActiveSection(section);
  };

  // Handler for dropdown items with distinct keys
  const handleDropdownItemClick = (section) => {
    setActiveSection(section);
  };

  return (
    <Navbar expand="lg" className="custom-navbar" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home" onClick={() => handleMainLinkClick("home")}>
           <img
              alt=""
              src="src/assets/op_logo.png"
              width="70"
              height="70"
              className="d-inline-block align-center"
            />
            TA Team
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            <Nav.Link
              as={NavLink} to="/"
              onClick={() => handleMainLinkClick("home")}
              active={activeSection === "home"}
            >
              Home
            </Nav.Link>

            <NavDropdown
              title="Requirement"
              id="requirement-nav-dropdown"
              active={
                activeSection === "requirement-add" ||
                activeSection === "requirement-all"
              }
            >
              <NavDropdown.Item
                href="#add-requirement"
                onClick={() => handleDropdownItemClick("requirement-add")}
                active={activeSection === "requirement-add"}
              >
                Add Requirement
              </NavDropdown.Item>
              <NavDropdown.Item
                href="#all-requirements"
                onClick={() => handleDropdownItemClick("requirement-all")}
                active={activeSection === "requirement-all"}
              >
                All Requirements
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Submission"
              id="submission-nav-dropdown"
              active={
                activeSection === "submission-add" ||
                activeSection === "submission-all"
              }
            >
              <NavDropdown.Item
                as={NavLink} to="/submissions"
                onClick={() => handleDropdownItemClick("submission-add")}
                active={activeSection === "submission-add"}
              >
                Add Submission
              </NavDropdown.Item>
              <NavDropdown.Item
                href="#all-submissions"
                onClick={() => handleDropdownItemClick("submission-all")}
                active={activeSection === "submission-all"}
              >
                All Submissions
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Analytics"
              id="analytics-nav-dropdown"
              active={
                activeSection === "analytics-client" ||
                activeSection === "analytics-recruiter" ||
                activeSection === "analytics-sourcer"
              }
            >
              <NavDropdown.Item
                href="#client-dashboard"
                onClick={() => handleDropdownItemClick("analytics-client")}
                active={activeSection === "analytics-client"}
              >
                Client Dashboard
              </NavDropdown.Item>
              <NavDropdown.Item
                href="#recruiter-dashboard"
                onClick={() => handleDropdownItemClick("analytics-recruiter")}
                active={activeSection === "analytics-recruiter"}
              >
                Recruiter Dashboard
              </NavDropdown.Item>
              <NavDropdown.Item
                href="#sourcer-dashboard"
                onClick={() => handleDropdownItemClick("analytics-sourcer")}
                active={activeSection === "analytics-sourcer"}
              >
                Sourcer Dashboard
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
