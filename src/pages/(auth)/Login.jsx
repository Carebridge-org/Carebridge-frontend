import { useState } from "react";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Vi sender JSON nu i stedet for FormData
            const res = await fetch("http://localhost:7070/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: username,  // din state for username/email
                    password: password, // din state for password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || "Login failed"); // msg er det vi får fra backend
                return;
            }

            // Gem token og user info i localStorage
            localStorage.setItem("jwt_token", data.token);
            localStorage.setItem("user", JSON.stringify({
                email: data.email,
                role: data.role,
            }));

            // Naviger til forsiden (eller dashboard)
            navigate("/");

        } catch (err) {
            console.error(err);
            setError("Network error");
        }
    };


    return (
        <Container
            className="d-flex justify-content-center align-items-center min-vh-100"
        >
            <Card className="w-100" style={{ maxWidth: "400px" }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Login</h3>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
