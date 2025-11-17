import { Container, Nav, Navbar } from 'react-bootstrap'
import { Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from "./pages/(auth)/Login"
import CreateUser from "./pages/(worker)/CreateUser"
import LinkResidents from "./pages/(worker)/LinkResidents"
function App() {
    return (
        <>
            {/* Navigation med React Bootstrap */}
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">Min App</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            {/* Indholdsruter */}
            <Container className="mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* Auth */}
                    <Route path="/auth/login" element={<Login />} />
    

                    {/* Medarbejder */}
                    <Route path='/admin/create-user' element={<CreateUser />} />
                    <Route path='/admin/link' element={<LinkResidents />} />
                </Routes>
            </Container>
        </>
    )
}

export default App
