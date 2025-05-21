import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import'./Header.css';
function Header() {
  return (
    <>
      <Navbar className="custom-navbar"  sticky='top'>
        <Container>
          <Navbar.Brand href="#home">TA Team</Navbar.Brand>
          <Nav>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Requirement</Nav.Link>
            <Nav.Link href="#pricing">Submissions</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      </>
  );
}

export default Header;