// src/App.jsx
import { useMemo } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CalendarPage from './pages/CalendarPage.jsx';
import SnackProvider from './components/SnackProvider.jsx';

// Disse to sider kan du lave som simple komponenter hvis de ikke findes endnu
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  // læs bruger-info til visning i navbar (email mm.)
  const { token, user } = useMemo(() => {
    const t = localStorage.getItem('token');
    let u = null;
    try { u = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}
    return { token: t, user: u };
  }, []); // ved login/logout redirectes der, så en re-render sker via navigation

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Carebridge</Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav>

          <Nav>
            {token ? (
              <>
                {user?.email && (
                  <Navbar.Text className="me-2">
                    {user.email}
                  </Navbar.Text>
                )}
                <Button size="sm" variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Provider ABOVE routes */}
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

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </SnackProvider>
    </>
  );
}
