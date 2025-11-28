import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import CreateJournalPage from "./pages/CreateJournalPage";
import JournalOverviewPage from "./pages/JournalOverviewPage";
import ShowJournalDetails from "./components/Journal/ShowJournalDetails";
import CreateResidentPage from "./pages/CreateResidentPage";

function App() {
  // --- Hold alle journal entries her ---
  const [journals, setJournals] = useState([]);

  return (
    <>
      {/* Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Min App</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            <Nav.Link as={Link} to="/create-journal">Opret Journal Entry</Nav.Link>
            <Nav.Link as={Link} to="/journal-overview">Journal Oversigt</Nav.Link>
            <Nav.Link as={Link} to="/create-resident">Opret Resident</Nav.Link>

          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create-resident" element={<CreateResidentPage />} />

          {/* Journal Pages */}
          <Route
            path="/create-journal"
            element={<CreateJournalPage addJournal={setJournals} />}
          />
          <Route
            path="/journal-overview"
            element={<JournalOverviewPage journals={journals} />}
          />
          <Route
            path="/journal/:journalId"
            element={<ShowJournalDetails journals={journals} />}
          />

          {/* Fallback */}
          <Route path="/login" element={<h3>Log ind for at fortsætte.</h3>} />
          <Route path="/unauthorized" element={<h3>Ingen adgang.</h3>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
