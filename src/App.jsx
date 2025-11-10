// src/App.jsx
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

import {
  getToken,
  getCurrentUser,
  logout,
  onAuthChanged,
} from "./services/auth";

// Helper to re-read auth state
function readAuth() {
  return {
    token: getToken(),
    user: getCurrentUser(),
  };
}

// Private route wrapper
function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();
  const [{ token, user }, setAuth] = useState(readAuth());

  // React to login/logout events
  useEffect(() => {
    const handle = () => setAuth(readAuth());
    const unsubscribe = onAuthChanged(handle);
    window.addEventListener("storage", handle);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", handle);
    };
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
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
          </Nav>

          <Nav>
            {token ? (
              <>
                {user && (
                  <Navbar.Text className="me-3">
                                     {" "}
                    <span className="fw-semibold">{user.name}</span>{" "}
                    <small className="text-muted">({user.email})</small>
                  </Navbar.Text>
                )}
                <Button size="sm" variant="outline-light" onClick={handleLogout}>
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

      {/* Main content */}
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
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </SnackProvider>
    </>
  );
}
