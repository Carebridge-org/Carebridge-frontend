import { Container, Nav, Navbar } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CreateJournalPage from "./pages/CreateJournalPage";
import ProtectedRoute from "./components/ProtectedRoute"; 

function App() {
  // Mock currentUser til test
  const mockUser = {
    id: 1,
    username: "careworker1",
    displayName: "Hans Hansen",
    roles: ["CareWorker"], 
    createdAt: "2025-11-03",
  };

  return (
    <>
      {/* Navigation med React Bootstrap */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Min App
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
            <Nav.Link as={Link} to="/create-journal">
              Opret Journal Entry
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Indholdsruter */}
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Beskyttet route */}
          <Route
            path="/create-journal"
            element={
              <ProtectedRoute
                user={mockUser}
                roles={["CareWorker", "Admin"]}
              >
                <CreateJournalPage currentUser={mockUser} />
              </ProtectedRoute>
            }
          />

          {/* Fallback-sider */}
          <Route path="/unauthorized" element={<h3>Du har ikke adgang til denne side.</h3>} />
          <Route path="/login" element={<h3>Log venligst ind for at fortsætte.</h3>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
