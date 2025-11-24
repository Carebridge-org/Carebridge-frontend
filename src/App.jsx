import { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import CreateJournalPage from "./pages/CreateJournalPage";
import JournalOverviewPage from "./pages/JournalOverviewPage";
import ShowJournalDetails from "./components/Journal/ShowJournalDetails";

function App() {
  // --- Hold alle journal entries her ---
  const [journals, setJournals] = useState([]);

  // --- Theme state: default dark ---
  const [theme, setTheme] = useState("dark");

  // --- Opdater body klasser ved tema skift ---
  useEffect(() => {
    document.body.className =
      theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      {/* Navigation */}
      <Navbar
        bg={theme === "dark" ? "dark" : "light"}
        variant={theme === "dark" ? "dark" : "light"}
        expand="lg"
      >
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
            <Nav.Link as={Link} to="/journal-overview">
              Journal Oversigt
            </Nav.Link>
          </Nav>
          {/* Theme toggle knap */}
          <Button
            variant={theme === "dark" ? "light" : "dark"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

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
