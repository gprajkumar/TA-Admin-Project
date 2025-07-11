import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Header = ({ userdetails, onSignOut }) => {
  const employee_id = useSelector(
    (state) => state.employee.employee_details?.employee_id
  );
  const [activeSection, setActiveSection] = useState(null);
  const token = localStorage.getItem("accessToken");

  const handleMainLinkClick = (section) => {
    setActiveSection(section);
  };

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
              as={NavLink}
              to="/"
              onClick={() => handleMainLinkClick("home")}
              active={activeSection === "home"}
            >
              Home
            </Nav.Link>

            {/* Requirement Dropdown */}
            {token && (
              <>
                {" "}
                <NavDropdown
                  title="Requirement"
                  id="requirement-nav-dropdown"
                  active={
                    activeSection === "requirement-add" ||
                    activeSection === "requirement-all" ||
                    activeSection === "requirement-filled"
                  }
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="/addrequirements"
                    onClick={() => handleDropdownItemClick("requirement-add")}
                    active={activeSection === "requirement-add"}
                  >
                    Add Requirement
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/allreqs" end
                    onClick={() => handleDropdownItemClick("requirement-all")}
                    active={activeSection === "requirement-all"} 
                  >
                    All Requirements
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/filledjob"
                    onClick={() =>
                      handleDropdownItemClick("requirement-filled")
                    }
                    active={activeSection === "requirement-filled"}
                  >
                    Job Fill
                  </NavDropdown.Item>
                </NavDropdown>
                {/* Submission Dropdown */}
                <NavDropdown
                  title="Submission"
                  id="submission-nav-dropdown"
                  active={
                    activeSection === "submission-add" ||
                    activeSection === "submission-all" ||
                    activeSection === "submission-dates" ||
                    activeSection === "submission-dates-details"
                  }
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="/submissions"
                    onClick={() => handleDropdownItemClick("submission-add")}
                    active={activeSection === "submission-add"}
                  >
                    Add Submission
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/allsubmissions" end
                    onClick={() => handleDropdownItemClick("submission-all")}
                    active={activeSection === "submission-all"} 
                  >
                    All Submissions
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/submissionsDateEntry"
                    onClick={() => handleDropdownItemClick("submission-dates")}
                    active={activeSection === "submission-dates"}
                  >
                    Submission Date Updates
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/submissionsDateDetails"
                    onClick={() =>
                      handleDropdownItemClick("submission-dates-details")
                    }
                    active={activeSection === "submission-dates-details"}
                  >
                    Submission Date Details
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="My View"
                  id="myrequirements-nav-dropdown"
                  active={
                    activeSection === "myrequirements" ||
                    activeSection === "mysubmissions"
                  }
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to={`/allreqs/${employee_id}`} // <-- Pass employee_id dynamically
                    onClick={() => handleDropdownItemClick("myrequirements")}
                    active={activeSection === "myrequirements"}
                  >
                    My Requirements
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to={`/allsubmissions/${employee_id}`}
                    onClick={() => handleDropdownItemClick("mysubmissions")}
                    active={activeSection === "mysubmissions"}
                  >
                    My Submissions
                  </NavDropdown.Item>
                </NavDropdown>
                {/* Analytics Dropdown */}
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
                  
                      as={NavLink}
                    to="/clientdashboard"
                    
                    onClick={() => handleDropdownItemClick("analytics-client")}
                    active={activeSection === "analytics-client"}
                  >
                    Client Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="#recruiter-dashboard"
                    onClick={() =>
                      handleDropdownItemClick("analytics-recruiter")
                    }
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
              </>
            )}

            {/* Sign In or Welcome */}
            <Nav className="auth-section">
              {!userdetails ? (
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  onClick={() => setIsLoggedin(true)}
                  active={activeSection === "signin"}
                  className="signin-link"
                >
                  Sign In
                </Nav.Link>
              ) : (
                <NavDropdown
                  title={`Welcome: ${userdetails.empName}`}
                  id="signin-nav-dropdown"
                  active={activeSection === "signout"}
                  className="welcome-dropdown"
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="/myprofile"
                    onClick={() => handleDropdownItemClick("mprofile")}
                    active={activeSection === "myprofile"}
                  >
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={onSignOut}
                    active={activeSection === "signout"}
                  >
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
