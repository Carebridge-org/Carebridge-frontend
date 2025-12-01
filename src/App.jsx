import { useEffect, useState } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CalendarPage from "./pages/CalendarPage.jsx";
import SnackProvider from "./components/SnackProvider.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import ResidentOverview from "./pages/residentOverview.jsx";
import CreateJournalPage from "./pages/CreateJournalPage";
import JournalOverviewPage from "./pages/JournalOverviewPage";
import ShowJournalDetails from "./components/Journal/ShowJournalDetails";
import CreateResidentPage from "./pages/CreateResidentPage";
import CreateUser from "./pages/(worker)/CreateUser"
import LinkResidets from "./pages/(worker)/LinkResidents"
import { getResidents } from "./api/api";

import {
  getToken,
  getCurrentUser,
  logout,
  onAuthChanged,
} from "./services/auth";

// Helper
function readAuth() {
  return {
    token: getToken(),
    user: getCurrentUser(),
  };
}

function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();
  const [{ token, user }, setAuth] = useState(readAuth());
  const [journals, setJournals] = useState([]);

  // NY STATE TIL RESIDENTS
  const [residents, setResidents] = useState([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [residentsError, setResidentsError] = useState(null);

  // Listen for login/logout
  useEffect(() => {
    const handle = () => setAuth(readAuth());
    const unsubscribe = onAuthChanged(handle);
    window.addEventListener("storage", handle);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", handle);
    };
  }, []);

  // HENT RESIDENTS FRA API (SAMME PRINCIP SOM JOURNALS KUNNE HAVE)
  useEffect(() => {
    async function fetchResidents() {
      try {
        setResidentsLoading(true);
        setResidentsError(null);

        // antager at getResidents() returnerer et array
        const data = await getResidents();
        setResidents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fejl ved hentning af residents:", err);
        setResidentsError("Kunne ikke hente residents");
      } finally {
        setResidentsLoading(false);
      }
    }

    fetchResidents();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Carebridge
          </Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Dashboard
            </Nav.Link>

            <Nav.Link as={Link} to="/calendar">
              Calendar
            </Nav.Link>

            <Nav.Link as={Link} to="/residentOverview">
              Resident Overview
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

            <Nav.Link as={Link} to="/create-resident">
              Opret Resident
                </Nav.Link> 
            
            <Nav.Link as={Link} to="/admin/create-user">
              Opret Bruger
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center">
            {token ? (
              <>
                {user?.name && (
                  <Navbar.Text className="me-3 fw-semibold">
                    {user.name}
                  </Navbar.Text>
                )}
                <Button
                  size="sm"
                  variant="outline-light"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>



      {/* Routes */}
      <SnackProvider>
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage />
                </PrivateRoute>
              }
            />

                        {/* RESIDENT OVERVIEW LIGNER JOURNAL-OVERVIEW */}
            <Route
              path="/residentOverview"
              element={
                <PrivateRoute>
                  {residentsLoading ? (
                    <p>Henter residents...</p>
                  ) : residentsError ? (
                    <p className="text-danger">{residentsError}</p>
                  ) : (
                    <ResidentOverview residents={residents} />
                  )}
                </PrivateRoute>
              }
            />

            <Route path="/create-resident" element={<CreateResidentPage />} />

            <Route
              path="/residentOverview"
              element={
                <PrivateRoute>
                  <ResidentOverview />
                </PrivateRoute>
              }
            />
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
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path='/admin/create-user' element={<CreateUser />} />
            <Route path="/login" element={<Login />} />
            

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </SnackProvider>
    </>
  );
}
